import { OFFICIAL_PRODUCT_SLUGS } from "@/lib/product-images";
import { resolveProductSlug } from "@/lib/products/catalog";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import type {
  AnalyticsStats,
  DashboardStats,
  Order,
  Product,
  ProductWithRelations,
  Review,
  Settings,
} from "@/lib/types/database";

export async function getSettings(): Promise<Settings | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return data as Settings | null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(url, sort_order, is_primary)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order");
  return (data as Product[]) ?? [];
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
  const slugs = data?.map((row) => row.slug as string).filter(Boolean) ?? [];
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

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*), product_offers(*)")
    .order("sort_order");
  return (data as Product[]) ?? [];
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

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  google: "Google",
  organic: "Organic",
  direct: "Direct",
};

export async function getAnalyticsStats(days = 30): Promise<AnalyticsStats> {
  const empty: AnalyticsStats = {
    totalVisitors: 0,
    totalPageViews: 0,
    totalConversions: 0,
    conversionRate: 0,
    totalRevenue: 0,
    trafficByPlatform: [],
    topProducts: [],
    ordersPerDay: [],
    deviceBreakdown: [],
    eventBreakdown: [],
  };

  if (!isSupabaseConfigured()) return empty;

  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [{ data: events }, { data: orders }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false }),
  ]);

  if (!events?.length && !orders?.length) return empty;

  const eventList = events ?? [];
  const orderList = orders ?? [];

  const sessions = new Set(
    eventList.map((e) => e.session_id).filter(Boolean) as string[],
  );
  const pageViews = eventList.filter((e) => e.event_name === "PageView").length;
  const purchases = eventList.filter((e) => e.event_name === "Purchase").length;
  const conversions = Math.max(purchases, orderList.length);
  const totalRevenue = orderList.reduce(
    (sum, o) => sum + Number(o.total_price),
    0,
  );

  const platformMap = new Map<string, number>();
  for (const event of eventList) {
    if (event.event_name !== "PageView") continue;
    const key = event.traffic_platform || "direct";
    platformMap.set(key, (platformMap.get(key) ?? 0) + 1);
  }
  for (const order of orderList) {
    const key = order.traffic_platform || "direct";
    platformMap.set(key, (platformMap.get(key) ?? 0) + 1);
  }

  const trafficByPlatform = Array.from(platformMap.entries())
    .map(([platform, count]) => ({
      platform,
      label: PLATFORM_LABELS[platform] ?? platform,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const productViews = new Map<string, number>();
  const productOrders = new Map<string, number>();
  for (const event of eventList) {
    if (event.event_name === "ViewContent" && event.product_name) {
      productViews.set(
        event.product_name,
        (productViews.get(event.product_name) ?? 0) + 1,
      );
    }
  }
  for (const order of orderList) {
    productOrders.set(
      order.product_name,
      (productOrders.get(order.product_name) ?? 0) + 1,
    );
  }
  const productNames = new Set([
    ...productViews.keys(),
    ...productOrders.keys(),
  ]);
  const topProducts = Array.from(productNames)
    .map((name) => ({
      name,
      views: productViews.get(name) ?? 0,
      orders: productOrders.get(name) ?? 0,
    }))
    .sort((a, b) => b.orders - a.orders || b.views - a.views)
    .slice(0, 5);

  const dayMap = new Map<string, { count: number; revenue: number }>();
  for (const order of orderList) {
    const date = order.created_at.slice(0, 10);
    const existing = dayMap.get(date) ?? { count: 0, revenue: 0 };
    existing.count += 1;
    existing.revenue += Number(order.total_price);
    dayMap.set(date, existing);
  }
  const ordersPerDay = Array.from(dayMap.entries())
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const deviceMap = new Map<string, number>();
  for (const event of eventList) {
    if (!event.device_type) continue;
    deviceMap.set(
      event.device_type,
      (deviceMap.get(event.device_type) ?? 0) + 1,
    );
  }
  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  const eventMap = new Map<string, number>();
  for (const event of eventList) {
    eventMap.set(event.event_name, (eventMap.get(event.event_name) ?? 0) + 1);
  }
  const eventBreakdown = Array.from(eventMap.entries())
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalVisitors: sessions.size || pageViews,
    totalPageViews: pageViews,
    totalConversions: conversions,
    conversionRate: sessions.size
      ? Math.round((conversions / sessions.size) * 100)
      : 0,
    totalRevenue,
    trafficByPlatform,
    topProducts,
    ordersPerDay,
    deviceBreakdown,
    eventBreakdown,
  };
}
