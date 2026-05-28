import { cache } from "react";
import { OFFICIAL_PRODUCT_SLUGS, isOfficialProductSlugValue } from "@/lib/product-images";
import { resolveProductSlug } from "@/lib/products/catalog";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type {
  DashboardStats,
  Order,
  Product,
  ProductWithRelations,
  Review,
  Settings,
} from "@/lib/types/database";

export const getSettings = cache(async (): Promise<Settings | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return data as Settings | null;
});

const PRODUCT_SELECT =
  "*, product_images(url, sort_order, is_primary), product_offers(*)";

export async function getOfficialProductsWithOffers(): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), product_offers(*)")
    .eq("is_active", true)
    .order("sort_order");

  return (
    (data as ProductWithRelations[])
      ?.filter((product) => isOfficialProductSlugValue(product.slug))
      .map(normalizeProductRelations) ?? []
  );
}

export async function getFeaturedProducts(): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order");

  let products =
    (featured as ProductWithRelations[])
      ?.filter((product) => isOfficialProductSlugValue(product.slug))
      .map(normalizeProductRelations) ?? [];

  if (!products.length) {
    products = await getOfficialProductsWithOffers();
  }

  return products;
}

function normalizeProductRelations(
  data: ProductWithRelations,
): ProductWithRelations {
  const product = data;
  product.product_offers?.sort((a, b) => a.sort_order - b.sort_order);
  product.product_images?.sort((a, b) => a.sort_order - b.sort_order);
  return product;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) return null;
  const resolvedSlug = resolveProductSlug(slug);
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), product_offers(*)")
    .eq("slug", resolvedSlug)
    .eq("is_active", true)
    .single();
  if (!data) return null;
  return normalizeProductRelations(data as ProductWithRelations);
}

export async function getProductById(
  id: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), product_offers(*)")
    .eq("id", id)
    .single();
  if (!data) return null;
  return normalizeProductRelations(data as ProductWithRelations);
}

export async function getActiveProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [...OFFICIAL_PRODUCT_SLUGS];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .order("sort_order");
  const slugs =
    data
      ?.map((row) => row.slug as string)
      .filter((slug) => isOfficialProductSlugValue(slug)) ?? [];
  return slugs.length ? slugs : [...OFFICIAL_PRODUCT_SLUGS];
}

export async function getActiveReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as Review[]) ?? [];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    conversionRate: 0,
  };
  if (!isSupabaseConfigured()) return empty;

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("total_price, status");

  if (!orders?.length) return empty;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0,
  );
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "shipped" || o.status === "delivered",
  ).length;

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    confirmedOrders,
    conversionRate: totalOrders
      ? Math.round((confirmedOrders / totalOrders) * 100)
      : 0,
  };
}

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getAllProducts(options?: {
  ensureOfficial?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  if (options?.ensureOfficial) {
    const { ensureOfficialProductsSynced } = await import(
      "@/lib/products/ensure-official-products"
    );
    await ensureOfficialProductsSynced();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), product_offers(*)")
    .order("sort_order");
  return (
    (data as Product[])?.filter((product) =>
      isOfficialProductSlugValue(product.slug),
    ) ?? []
  );
}

export async function getAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Review[]) ?? [];
}

export async function getCustomersFromOrders() {
  const orders = await getAllOrders();
  const map = new Map<
    string,
    { phone: string; name: string; city: string; orders: Order[] }
  >();

  orders.forEach((order) => {
    const existing = map.get(order.phone);
    if (existing) {
      existing.orders.push(order);
    } else {
      map.set(order.phone, {
        phone: order.phone,
        name: order.customer_name,
        city: order.city,
        orders: [order],
      });
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => b.orders.length - a.orders.length,
  );
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Order[]) ?? [];
}

export async function getAnalyticsStats(days = 30) {
  const { getAnalyticsStats: loadStats } = await import("@/lib/analytics/dashboard");
  return loadStats(days);
}
