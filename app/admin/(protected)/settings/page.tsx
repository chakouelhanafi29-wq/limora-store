export const dynamic = "force-dynamic";

import { getSettings } from "@/lib/supabase/queries";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">الإعدادات</h1>
        <p className="mt-1 text-sm text-muted">
          النطاق · SEO · Meta · TikTok · Snapchat CAPI · Google Analytics
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
