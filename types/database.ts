export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
  description: string | null;
  property_type: "residential" | "commercial" | "industrial" | "mixed";
  total_value: number;
  share_price: number;
  total_shares: number;
  available_shares: number;
  annual_return_rate: number | null;
  images: string[];
  thumbnail_url: string | null;
  status: "active" | "sold_out" | "coming_soon" | "closed";
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  property_id: string;
  shares_owned: number;
  average_purchase_price: number;
  total_invested: number;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Transaction {
  id: string;
  user_id: string;
  property_id: string;
  transaction_type: "buy" | "sell";
  shares: number;
  price_per_share: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled" | "failed";
  created_at: string;
  property?: Property;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type:
    | "info"
    | "success"
    | "warning"
    | "transaction"
    | "dividend";
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_return: number;
  return_percentage: number;
  total_properties: number;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}
