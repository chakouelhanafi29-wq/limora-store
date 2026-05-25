import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type SupabaseHealth = {
  configured: boolean;
  connected: boolean;
  tables: Record<string, boolean>;
  storageReady: boolean;
  adminCount: number;
  productCount: number;
  orderCount: number;
  reviewCount: number;
};

const TABLE_NAMES = [
  "settings",
  "products",
  "product_images",
  "product_offers",
  "orders",
  "reviews",
  "admins",
  "analytics_events",
] as const;

export async function getSupabaseHealth(): Promise<SupabaseHealth> {
  const empty: SupabaseHealth = {
    configured: isSupabaseConfigured(),
    connected: false,
    tables: Object.fromEntries(TABLE_NAMES.map((name) => [name, false])),
    storageReady: false,
    adminCount: 0,
    productCount: 0,
    orderCount: 0,
    reviewCount: 0,
  };

  if (!isSupabaseConfigured()) return empty;

  const supabase = await createClient();
  const tables: Record<string, boolean> = {};

  for (const table of TABLE_NAMES) {
    const { error } = await supabase.from(table).select("*", { head: true, count: "exact" });
    tables[table] = !error;
  }

  const connected = tables.settings && tables.products && tables.orders;

  let productCount = 0;
  let orderCount = 0;
  let reviewCount = 0;
  let adminCount = 0;
  let storageReady = false;

  if (connected) {
    const [products, orders, reviews, storage] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase.storage.from("product-images").list("", { limit: 1 }),
    ]);

    productCount = products.count ?? 0;
    orderCount = orders.count ?? 0;
    reviewCount = reviews.count ?? 0;
    storageReady = !storage.error;
  }

  return {
    configured: true,
    connected,
    tables,
    storageReady,
    adminCount,
    productCount,
    orderCount,
    reviewCount,
  };
}
