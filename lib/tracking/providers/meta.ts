import { hashNameForTracking, hashPhoneForTracking } from "../hash";
import { mapMetaEventName } from "../event-map";
import { buildEventSourceUrl } from "../server-context";
import type {
  DispatchResult,
  ServerRequestContext,
  ServerTrackingPayload,
  TrackingProviderConfig,
} from "../types";

type MetaUserData = Record<string, string | string[]>;

function buildMetaUserData(
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): MetaUserData {
  const userData: MetaUserData = {};

  if (request.client_ip) userData.client_ip_address = request.client_ip;
  if (request.user_agent) userData.client_user_agent = request.user_agent;

  const phoneHash = payload.user?.phone
    ? hashPhoneForTracking(payload.user.phone)
    : null;
  if (phoneHash) userData.ph = [phoneHash];

  const nameHash = payload.user?.firstName
    ? hashNameForTracking(payload.user.firstName)
    : null;
  if (nameHash) userData.fn = [nameHash];

  if (payload.click_ids?.fbp) userData.fbp = payload.click_ids.fbp;
  if (payload.click_ids?.fbc) userData.fbc = payload.click_ids.fbc;

  return userData;
}

export async function sendMetaConversionEvent(
  config: TrackingProviderConfig,
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): Promise<DispatchResult> {
  if (!config.metaPixelId || !config.metaAccessToken) {
    return { provider: "meta", ok: false, error: "Meta CAPI not configured" };
  }

  const eventTime = payload.event_time ?? Math.floor(Date.now() / 1000);
  const eventSourceUrl = payload.event_source_url?.startsWith("http")
    ? payload.event_source_url
    : buildEventSourceUrl(config.siteUrl, payload.page_path);

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: mapMetaEventName(payload.event_name),
        event_time: eventTime,
        event_id: payload.event_id,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: buildMetaUserData(payload, request),
        custom_data: {
          currency: payload.currency ?? "SAR",
          value: payload.value ?? 0,
          content_name: payload.product_name ?? payload.offer_label ?? "LIMORA",
          content_ids: payload.product_slug ? [payload.product_slug] : undefined,
          order_id: payload.order_id ?? undefined,
        },
      },
    ],
  };

  if (config.metaTestEventCode) {
    body.test_event_code = config.metaTestEventCode;
  }

  const url = new URL(
    `https://graph.facebook.com/v21.0/${config.metaPixelId}/events`,
  );
  url.searchParams.set("access_token", config.metaAccessToken);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        provider: "meta",
        ok: false,
        status: response.status,
        error: text.slice(0, 500),
      };
    }

    return { provider: "meta", ok: true, status: response.status };
  } catch (error) {
    return {
      provider: "meta",
      ok: false,
      error: error instanceof Error ? error.message : "Meta CAPI request failed",
    };
  }
}
