import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ServerTrackingPayload } from "./types";

export async function persistTrackingEvent(payload: ServerTrackingPayload) {
  if (!isSupabaseConfigured()) return { ok: true, fallback: true };

  const supabase = await createClient();
  const attribution = payload.attribution ?? {};

  const { error } = await supabase.from("analytics_events").insert({
    event_name: payload.event_name,
    page_path: payload.page_path ?? null,
    product_name: payload.product_name ?? null,
    product_slug: payload.product_slug ?? null,
    offer_label: payload.offer_label ?? null,
    value: payload.value ?? null,
    currency: payload.currency ?? "SAR",
    order_id: payload.order_id ?? null,
    traffic_source: attribution.traffic_source ?? null,
    traffic_platform: attribution.traffic_platform ?? null,
    utm_source: attribution.utm_source ?? null,
    utm_medium: attribution.utm_medium ?? null,
    utm_campaign: attribution.utm_campaign ?? null,
    utm_content: attribution.utm_content ?? null,
    utm_term: attribution.utm_term ?? null,
    referrer: attribution.referrer ?? null,
    device_type: attribution.device_type ?? null,
    session_id: attribution.session_id ?? null,
    metadata: {
      event_id: payload.event_id,
      click_ids: payload.click_ids ?? {},
      event_source_url: payload.event_source_url ?? null,
      server_side: true,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
