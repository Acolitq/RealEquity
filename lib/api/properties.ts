import { supabase } from "../supabase";
import type { Property } from "@/types/database";

export async function getProperties(options?: {
  status?: string;
  propertyType?: string;
  search?: string;
  limit?: number;
  offset?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
}) {
  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  } else {
    // Default to showing active and coming soon properties
    query = query.in("status", ["active", "coming_soon"]);
  }

  if (options?.propertyType) {
    query = query.eq("property_type", options.propertyType);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,city.ilike.%${options.search}%,address.ilike.%${options.search}%`
    );
  }

  if (options?.city) {
    query = query.ilike("city", `%${options.city}%`);
  }

  if (options?.minPrice) {
    query = query.gte("share_price", options.minPrice);
  }

  if (options?.maxPrice) {
    query = query.lte("share_price", options.maxPrice);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Property[];
}

export async function getProperty(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Property;
}

export async function getFeaturedProperties(limit = 5) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "active")
    .order("annual_return_rate", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Property[];
}

export async function getPropertyTypes() {
  const { data, error } = await supabase
    .from("properties")
    .select("property_type")
    .eq("status", "active");

  if (error) throw error;

  const types = [...new Set(data.map((p) => p.property_type))];
  return types;
}

export async function getCities() {
  const { data, error } = await supabase
    .from("properties")
    .select("city")
    .in("status", ["active", "coming_soon"]);

  if (error) throw error;

  const cities = [...new Set(data.map((p) => p.city))];
  return cities.sort();
}
