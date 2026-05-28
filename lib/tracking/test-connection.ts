import { getTrackingProviderConfig } from "./config";
import { sendMetaConversionEvent } from "./providers/meta";
import { sendSnapchatConversionEvent } from "./providers/snapchat";
import { sendTikTokConversionEvent } from "./providers/tiktok";
import type { DispatchResult, TrackingProviderConfig } from "./types";

export type TrackingProviderName = "meta" | "tiktok" | "snapchat";

export function validatePixelId(
  provider: TrackingProviderName,
  pixelId: string,
): string | null {
  const value = pixelId.trim();
  if (!value) return "Pixel ID مطلوب";

  if (provider === "meta") {
    if (!/^\d{5,20}$/.test(value)) {
      return "Meta Pixel ID يجب أن يكون أرقاماً (5–20 رقم)";
    }
    return null;
  }

  if (provider === "tiktok") {
    if (!/^C[A-Z0-9]{10,}$/i.test(value)) {
      return "TikTok Pixel ID يبدأ عادةً بـ C متبوعاً بأحرف وأرقام";
    }
    return null;
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return "Snapchat Pixel ID يجب أن يكون بصيغة UUID";
  }
  return null;
}

function getProviderReadiness(
  provider: TrackingProviderName,
  config: TrackingProviderConfig,
): { pixelReady: boolean; capiReady: boolean } {
  if (provider === "meta") {
    return {
      pixelReady: Boolean(config.metaPixelId),
      capiReady: Boolean(config.metaPixelId && config.metaAccessToken),
    };
  }
  if (provider === "tiktok") {
    return {
      pixelReady: Boolean(config.tiktokPixelId),
      capiReady: Boolean(config.tiktokPixelId && config.tiktokAccessToken),
    };
  }
  return {
    pixelReady: Boolean(config.snapchatPixelId),
    capiReady: Boolean(config.snapchatPixelId && config.snapchatAccessToken),
  };
}

export async function sendTrackingTestEvent(
  provider: TrackingProviderName,
  configOverride?: Partial<TrackingProviderConfig>,
): Promise<DispatchResult & { ready: ReturnType<typeof getProviderReadiness> }> {
  const baseConfig = await getTrackingProviderConfig();
  const config: TrackingProviderConfig = { ...baseConfig, ...configOverride };

  const ready = getProviderReadiness(provider, config);
  if (!ready.capiReady) {
    return {
      provider,
      ok: false,
      error: "Pixel ID و Access Token مطلوبان",
      ready,
    };
  }

  const eventId = `limora-test-${provider}-${Date.now()}`;
  const payload = {
    event_name: "PageView" as const,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: `${config.siteUrl.replace(/\/$/, "")}/admin/settings`,
    page_path: "/admin/settings",
    value: 0,
    currency: "SAR",
  };

  const request = {
    client_ip: "127.0.0.1",
    user_agent: "LIMORA-Admin-Tracking-Test/1.0",
  };

  let result: DispatchResult;
  if (provider === "meta") {
    result = await sendMetaConversionEvent(config, payload, request);
  } else if (provider === "tiktok") {
    result = await sendTikTokConversionEvent(config, payload, request);
  } else {
    result = await sendSnapchatConversionEvent(config, payload, request);
  }

  return { ...result, ready };
}
