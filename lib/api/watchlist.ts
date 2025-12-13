import { supabase } from "../supabase";
import type { WatchlistItem } from "@/types/database";

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("watchlist")
    .select(
      `
      *,
      property:properties(*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as WatchlistItem[];
}

export async function addToWatchlist(propertyId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    property_id: propertyId,
  });

  if (error) throw error;
}

export async function removeFromWatchlist(propertyId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("property_id", propertyId);

  if (error) throw error;
}

export async function isInWatchlist(propertyId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}
