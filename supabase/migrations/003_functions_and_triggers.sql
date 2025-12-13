-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to process buy transaction
CREATE OR REPLACE FUNCTION public.process_buy_transaction(
  p_user_id UUID,
  p_property_id UUID,
  p_shares INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_property RECORD;
  v_total_amount DECIMAL(15, 2);
  v_existing_investment RECORD;
  v_transaction_id UUID;
BEGIN
  -- Get property details and lock the row
  SELECT * INTO v_property 
  FROM public.properties 
  WHERE id = p_property_id 
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;
  
  IF v_property.available_shares < p_shares THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not enough shares available');
  END IF;
  
  IF v_property.status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property is not available for purchase');
  END IF;
  
  -- Calculate total amount
  v_total_amount := v_property.share_price * p_shares;
  
  -- Update available shares
  UPDATE public.properties 
  SET available_shares = available_shares - p_shares
  WHERE id = p_property_id;
  
  -- Check for existing investment
  SELECT * INTO v_existing_investment 
  FROM public.investments 
  WHERE user_id = p_user_id AND property_id = p_property_id;
  
  IF FOUND THEN
    -- Update existing investment
    UPDATE public.investments 
    SET 
      shares_owned = shares_owned + p_shares,
      total_invested = total_invested + v_total_amount,
      average_purchase_price = (total_invested + v_total_amount) / (shares_owned + p_shares)
    WHERE user_id = p_user_id AND property_id = p_property_id;
  ELSE
    -- Create new investment
    INSERT INTO public.investments (user_id, property_id, shares_owned, average_purchase_price, total_invested)
    VALUES (p_user_id, p_property_id, p_shares, v_property.share_price, v_total_amount);
  END IF;
  
  -- Create transaction record
  INSERT INTO public.transactions (user_id, property_id, transaction_type, shares, price_per_share, total_amount, status)
  VALUES (p_user_id, p_property_id, 'buy', p_shares, v_property.share_price, v_total_amount, 'completed')
  RETURNING id INTO v_transaction_id;
  
  -- Create notification
  INSERT INTO public.notifications (user_id, title, message, notification_type, metadata)
  VALUES (
    p_user_id,
    'Purchase Successful',
    format('You bought %s shares of %s for $%s', p_shares, v_property.name, v_total_amount),
    'transaction',
    jsonb_build_object('transaction_id', v_transaction_id, 'property_id', p_property_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'total_amount', v_total_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process sell transaction
CREATE OR REPLACE FUNCTION public.process_sell_transaction(
  p_user_id UUID,
  p_property_id UUID,
  p_shares INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_property RECORD;
  v_investment RECORD;
  v_total_amount DECIMAL(15, 2);
  v_transaction_id UUID;
BEGIN
  -- Get property details
  SELECT * INTO v_property FROM public.properties WHERE id = p_property_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;
  
  -- Get user's investment and lock
  SELECT * INTO v_investment 
  FROM public.investments 
  WHERE user_id = p_user_id AND property_id = p_property_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'You do not own shares in this property');
  END IF;
  
  IF v_investment.shares_owned < p_shares THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not enough shares to sell');
  END IF;
  
  -- Calculate total amount
  v_total_amount := v_property.share_price * p_shares;
  
  -- Update property available shares
  UPDATE public.properties 
  SET available_shares = available_shares + p_shares
  WHERE id = p_property_id;
  
  -- Update or delete investment
  IF v_investment.shares_owned = p_shares THEN
    DELETE FROM public.investments 
    WHERE user_id = p_user_id AND property_id = p_property_id;
  ELSE
    UPDATE public.investments 
    SET 
      shares_owned = shares_owned - p_shares,
      total_invested = total_invested - (v_investment.average_purchase_price * p_shares)
    WHERE user_id = p_user_id AND property_id = p_property_id;
  END IF;
  
  -- Create transaction record
  INSERT INTO public.transactions (user_id, property_id, transaction_type, shares, price_per_share, total_amount, status)
  VALUES (p_user_id, p_property_id, 'sell', p_shares, v_property.share_price, v_total_amount, 'completed')
  RETURNING id INTO v_transaction_id;
  
  -- Create notification
  INSERT INTO public.notifications (user_id, title, message, notification_type, metadata)
  VALUES (
    p_user_id,
    'Sale Successful',
    format('You sold %s shares of %s for $%s', p_shares, v_property.name, v_total_amount),
    'transaction',
    jsonb_build_object('transaction_id', v_transaction_id, 'property_id', p_property_id)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'total_amount', v_total_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get portfolio summary
CREATE OR REPLACE FUNCTION public.get_portfolio_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_invested DECIMAL(15, 2);
  v_current_value DECIMAL(15, 2);
  v_total_properties INTEGER;
BEGIN
  SELECT 
    COALESCE(SUM(i.total_invested), 0),
    COALESCE(SUM(i.shares_owned * p.share_price), 0),
    COUNT(DISTINCT i.property_id)
  INTO v_total_invested, v_current_value, v_total_properties
  FROM public.investments i
  JOIN public.properties p ON i.property_id = p.id
  WHERE i.user_id = p_user_id;
  
  RETURN jsonb_build_object(
    'total_invested', v_total_invested,
    'current_value', v_current_value,
    'total_return', v_current_value - v_total_invested,
    'return_percentage', CASE WHEN v_total_invested > 0 
      THEN ((v_current_value - v_total_invested) / v_total_invested * 100)
      ELSE 0 END,
    'total_properties', v_total_properties
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
