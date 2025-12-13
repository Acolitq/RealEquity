-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Properties policies (everyone can view active properties)
CREATE POLICY "Anyone can view active properties" 
  ON public.properties FOR SELECT 
  USING (status IN ('active', 'coming_soon'));

-- Investments policies
CREATE POLICY "Users can view own investments" 
  ON public.investments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" 
  ON public.investments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments" 
  ON public.investments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments" 
  ON public.investments FOR DELETE 
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Watchlist policies
CREATE POLICY "Users can view own watchlist" 
  ON public.watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own watchlist" 
  ON public.watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own watchlist" 
  ON public.watchlist FOR DELETE 
  USING (auth.uid() = user_id);
