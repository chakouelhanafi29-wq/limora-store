import { hashPhoneForTracking } from "../hash";
import { mapTikTokEventName } from "../event-map";
import { buildEventSourceUrl } from "../server-context";
import type {
  DispatchResult,
  ServerRequestContext,
  ServerTrackingPayload,
  TrackingProviderConfig,
} from "../types";

export async function sendTikTokConversionEvent(
  config: TrackingProviderConfig,
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): Promise<DispatchResult> {
  if (!config.tiktokPixelId || !config.tiktokAccessToken) {
    return { provider: "tiktok", ok: false, error: "TikTok Events API not configured" };
  }

  const eventTime = payload.event_time ?? Math.floor(Date.now() / 1000);
  const pageUrl = payload.event_source_url?.startsWith("http")
    ? payload.event_source_url
    : buildEventSourceUrl(config.siteUrl, payload.page_path);

  const user: Record<string, string> = {};
  if (request.client_ip) user.ip = request.client_ip;
  if (request.user_agent) user.user_agent = request.user_agent;
  if (payload.click_ids?.ttclid) user.ttclid = payload.click_ids.ttclid;

  const phoneHash = payload.user?.phone
    ? hashPhoneForTracking(payload.user.phone)
    : null;
  if (phoneHash) user.phone = phoneHash;

  const eventBody: Record<string, unknown> = {
    event: mapTikTokEventName(payload.event_name),
    event_time: eventTime,
    event_id: payload.event_id,
    user,
    properties: {
      currency: payload.currency ?? "SAR",
      value: payload.value ?? 0,
      content_type: "product",
      content_name: payload.product_name ?? payload.offer_label ?? "LIMORA",
      content_id: payload.product_slug ?? undefined,
      order_id: payload.order_id ?? undefined,
    },
    page: {
      url: pageUrl,
    },
  };

  if (config.tiktokTestEventCode) {
    eventBody.test_event_code = config.tiktokTestEventCode;
  }

  try {
    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": config.tiktokAccessToken,
        },
        body: JSON.stringify({
          event_source: "web",
          event_source_id: config.tiktokPixelId,
          data: [eventBody],
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return {
        provider: "tiktok",
        ok: false,
        status: response.status,
        error: text.slice(0, 500),
      };
    }

    return { provider: "tiktok", ok: true, status: response.status };
  } catch (error) {
    return {
      provider: "tiktok",
      ok: false,
      error: error instanceof Error ? error.message : "TikTok Events API failed",
    };
  }
}
