import { getSettings } from "@/lib/supabase/queries";
import { getTrackingSecretsForServer } from "./secrets";
import type { TrackingProviderConfig } from "./types";

function env(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function pickSecret(dbValue: string | null | undefined, envName: string): string | null {
  return dbValue?.trim() || env(envName);
}

export async function getTrackingProviderConfig(): Promise<TrackingProviderConfig> {
  const [settings, secrets] = await Promise.all([
    getSettings(),
    getTrackingSecretsForServer(),
  ]);

  return {
    metaPixelId: env("META_PIXEL_ID") ?? settings?.facebook_pixel_id ?? null,
    metaAccessToken: pickSecret(secrets?.meta_capi_access_token, "META_CAPI_ACCESS_TOKEN"),
    metaTestEventCode:
      secrets?.meta_test_event_code?.trim() || env("META_TEST_EVENT_CODE"),
    tiktokPixelId: env("TIKTOK_PIXEL_ID") ?? settings?.tiktok_pixel_id ?? null,
    tiktokAccessToken: pickSecret(
      secrets?.tiktok_events_access_token,
      "TIKTOK_EVENTS_ACCESS_TOKEN",
    ),
    tiktokTestEventCode:
      secrets?.tiktok_test_event_code?.trim() || env("TIKTOK_TEST_EVENT_CODE"),
    snapchatPixelId: env("SNAPCHAT_PIXEL_ID") ?? settings?.snapchat_pixel_id ?? null,
    snapchatAccessToken: pickSecret(
      secrets?.snapchat_capi_access_token,
      "SNAPCHAT_CAPI_ACCESS_TOKEN",
    ),
    snapchatTestEventCode:
      secrets?.snapchat_test_event_code?.trim() || env("SNAPCHAT_TEST_EVENT_CODE"),
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
