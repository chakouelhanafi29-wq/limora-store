import { getSettings } from "@/lib/supabase/queries";
import TrackingScripts from "./TrackingScripts";

export default async function TrackingPixels() {
  const settings = await getSettings();
  const hasTracking = Boolean(
    settings?.facebook_pixel_id ||
      settings?.tiktok_pixel_id ||
      settings?.snapchat_pixel_id ||
      settings?.google_analytics_id,
  );

  if (!hasTracking) return null;

  return (
    <TrackingScripts
      facebookPixelId={settings?.facebook_pixel_id}
      tiktokPixelId={settings?.tiktok_pixel_id}
      snapchatPixelId={settings?.snapchat_pixel_id}
    />
  );
}
