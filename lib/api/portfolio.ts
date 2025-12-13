import { supabase } from "../supabase";
import type { Investment, PortfolioSummary, Transaction } from "@/types/database";

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("get_portfolio_summary", {
    p_user_id: user.id,
  });

  if (error) throw error;
  return data as PortfolioSummary;
}

export async function getInvestments(): Promise<Investment[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("investments")
    .select(
      `
      *,
      property:properties(*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Investment[];
}

export async function getTransactions(limit = 20): Promise<Transaction[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      property:properties(name, thumbnail_url, city)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Transaction[];
}

export async function buyShares(
  propertyId: string,
  shares: number
): Promise<{ success: boolean; transaction_id: string; total_amount: number }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("process_buy_transaction", {
    p_user_id: user.id,
    p_property_id: propertyId,
    p_shares: shares,
  });

  if (error) throw error;

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

export async function sellShares(
  propertyId: string,
  shares: number
): Promise<{ success: boolean; transaction_id: string; total_amount: number }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("process_sell_transaction", {
    p_user_id: user.id,
    p_property_id: propertyId,
    p_shares: shares,
  });

  if (error) throw error;

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

export async function getInvestmentForProperty(
  propertyId: string
): Promise<Investment | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as Investment | null;
}
