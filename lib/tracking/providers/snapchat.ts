import { hashPhoneForTracking } from "../hash";
import { mapSnapchatEventName } from "../event-map";
import type {
  DispatchResult,
  ServerRequestContext,
  ServerTrackingPayload,
  TrackingProviderConfig,
} from "../types";

export async function sendSnapchatConversionEvent(
  config: TrackingProviderConfig,
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): Promise<DispatchResult> {
  if (!config.snapchatPixelId || !config.snapchatAccessToken) {
    return {
      provider: "snapchat",
      ok: false,
      error: "Snapchat CAPI not configured",
    };
  }

  const phoneHash = payload.user?.phone
    ? hashPhoneForTracking(payload.user.phone)
    : null;

  const body: Record<string, unknown> = {
    pixel_id: config.snapchatPixelId,
    timestamp: (payload.event_time ?? Math.floor(Date.now() / 1000)) * 1000,
    event_type: mapSnapchatEventName(payload.event_name),
    event_conversion_type: "WEB",
    client_dedup_id: payload.event_id,
    user_agent: request.user_agent ?? undefined,
    ip_address: request.client_ip ?? undefined,
    hashed_phone_number: phoneHash ?? undefined,
    price: payload.value ?? undefined,
    currency: payload.currency ?? "SAR",
    item_ids: payload.product_slug ? [payload.product_slug] : undefined,
    transaction_id: payload.order_id ?? undefined,
  };

  if (config.snapchatTestEventCode) {
    body.event_tag = config.snapchatTestEventCode;
  }

  try {
    const response = await fetch("https://tr.snapchat.com/v2/conversion", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.snapchatAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        provider: "snapchat",
        ok: false,
        status: response.status,
        error: text.slice(0, 500),
      };
    }

    return { provider: "snapchat", ok: true, status: response.status };
  } catch (error) {
    return {
      provider: "snapchat",
      ok: false,
      error:
        error instanceof Error ? error.message : "Snapchat CAPI request failed",
    };
  }
}
