export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TrafficPlatform =
  | "facebook"
  | "tiktok"
  | "snapchat"
  | "google"
  | "organic"
  | "direct";

export type AnalyticsEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead";

export type Product = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  bullets: string[];
  urgency_text: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductOffer = {
  id: string;
  product_id: string;
  label: string;
  display_label: string | null;
  quantity: number;
  price: number;
  badge: string | null;
  is_recommended: boolean;
  sort_order: number;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  city: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  offer_id: string | null;
  offer_label: string;
  offer_quantity: number;
  total_price: number;
  status: OrderStatus;
  notes: string | null;
  traffic_source: string | null;
  traffic_platform: TrafficPlatform | string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  device_type: string | null;
  landing_page: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  product_id: string | null;
  customer_name: string;
  location: string | null;
  product_label: string | null;
  rating: number;
  content: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Settings = {
  id: number;
  facebook_pixel_id: string | null;
  tiktok_pixel_id: string | null;
  snapchat_pixel_id: string | null;
  google_analytics_id: string | null;
  whatsapp_number: string | null;
  free_shipping: boolean;
  cod_enabled: boolean;
  announcement_1: string | null;
  announcement_2: string | null;
  announcement_3: string | null;
  site_url: string | null;
  site_domain: string | null;
  site_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  twitter_handle: string | null;
  updated_at: string;
};

export type AnalyticsEvent = {
  id: string;
  event_name: AnalyticsEventName | string;
  page_path: string | null;
  product_name: string | null;
  product_slug: string | null;
  offer_label: string | null;
  value: number | null;
  currency: string | null;
  order_id: string | null;
  traffic_source: string | null;
  traffic_platform: TrafficPlatform | string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  device_type: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ProductWithRelations = Product & {
  product_images: ProductImage[];
  product_offers: ProductOffer[];
};

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  conversionRate: number;
};

export type AnalyticsStats = {
  totalVisitors: number;
  totalPageViews: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  trafficByPlatform: { platform: string; label: string; count: number }[];
  topProducts: { name: string; views: number; orders: number }[];
  ordersPerDay: { date: string; count: number; revenue: number }[];
  deviceBreakdown: { device: string; count: number }[];
  eventBreakdown: { event: string; count: number }[];
};
