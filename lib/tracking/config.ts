import { getSettings } from "@/lib/supabase/queries";
import type { TrackingProviderConfig } from "./types";

function env(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

export async function getTrackingProviderConfig(): Promise<TrackingProviderConfig> {
  const settings = await getSettings();

  return {
    metaPixelId: env("META_PIXEL_ID") ?? settings?.facebook_pixel_id ?? null,
    metaAccessToken: env("META_CAPI_ACCESS_TOKEN"),
    metaTestEventCode: env("META_TEST_EVENT_CODE"),
    tiktokPixelId: env("TIKTOK_PIXEL_ID") ?? settings?.tiktok_pixel_id ?? null,
    tiktokAccessToken: env("TIKTOK_EVENTS_ACCESS_TOKEN"),
    tiktokTestEventCode: env("TIKTOK_TEST_EVENT_CODE"),
    snapchatPixelId: env("SNAPCHAT_PIXEL_ID") ?? settings?.snapchat_pixel_id ?? null,
    snapchatAccessToken: env("SNAPCHAT_CAPI_ACCESS_TOKEN"),
    snapchatTestEventCode: env("SNAPCHAT_TEST_EVENT_CODE"),
    siteUrl:
      env("NEXT_PUBLIC_SITE_URL") ??
      settings?.site_url ??
      "https://limora.sa",
  };
}

export function isServerTrackingEnabled(config: TrackingProviderConfig): boolean {
  return Boolean(
    (config.metaPixelId && config.metaAccessToken) ||
      (config.tiktokPixelId && config.tiktokAccessToken) ||
      (config.snapchatPixelId && config.snapchatAccessToken),
  );
}
