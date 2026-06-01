export const dynamic = "force-dynamic";

import { getGa4AdminSettingsSnapshot } from "@/lib/analytics/ga4/admin-settings";
import { getSettings } from "@/lib/supabase/queries";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const [settings, ga4Initial] = await Promise.all([
    getSettings(),
    getGa4AdminSettingsSnapshot(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">الإعدادات</h1>
        <p className="mt-1 text-sm text-muted">
          النطاق · SEO · Google Analytics 4 · Meta · TikTok · Snapchat
        </p>
      </div>
      <SettingsForm initialSettings={settings} ga4Initial={ga4Initial} />
    </div>
  );
}
