export type TrackingEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead";

export type TrackingUserData = {
  phone?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type TrackingClickIds = {
  fbp?: string | null;
  fbc?: string | null;
  fbclid?: string | null;
  ttclid?: string | null;
  gclid?: string | null;
  sc_click_id?: string | null;
};

export type TrackingAttribution = {
  traffic_source?: string | null;
  traffic_platform?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  referrer?: string | null;
  device_type?: string | null;
  landing_page?: string | null;
  session_id?: string | null;
};

export type ServerTrackingPayload = {
  event_name: TrackingEventName;
  event_id: string;
  event_time?: number;
  event_source_url?: string | null;
  page_path?: string | null;
  product_name?: string | null;
  product_slug?: string | null;
  offer_label?: string | null;
  value?: number | null;
  currency?: string;
  order_id?: string | null;
  user?: TrackingUserData;
  click_ids?: TrackingClickIds;
  attribution?: TrackingAttribution;
};

export type ServerRequestContext = {
  client_ip: string | null;
  user_agent: string | null;
};

export type TrackingProviderConfig = {
  metaPixelId: string | null;
  metaAccessToken: string | null;
  metaTestEventCode: string | null;
  tiktokPixelId: string | null;
  tiktokAccessToken: string | null;
  tiktokTestEventCode: string | null;
  snapchatPixelId: string | null;
  snapchatAccessToken: string | null;
  snapchatTestEventCode: string | null;
  siteUrl: string;
};

export type DispatchResult = {
  provider: "meta" | "tiktok" | "snapchat";
  ok: boolean;
  status?: number;
  error?: string;
};
