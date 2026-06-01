import { getGa4Config, isGa4DataApiReady, normalizeGa4PropertyId } from "./config";
import { getSettings } from "@/lib/supabase/queries";
import { getTrackingSecretsForAdmin } from "@/lib/tracking/secrets";

export type Ga4AdminSettingsSnapshot = {
  measurementId: string;
  propertyId: string;
  measurementConfigured: boolean;
  dataApiConfigured: boolean;
  serviceAccountConfigured: boolean;
  serviceAccountPreview: string | null;
  serviceRoleConfigured: boolean;
  migrationHint: string | null;
};

function previewServiceAccount(json: string | null | undefined): string | null {
  if (!json?.trim()) return null;
  try {
    const parsed = JSON.parse(json) as { client_email?: string };
    const email = parsed.client_email ?? "service-account";
    return `${email}`;
  } catch {
    return "(json saved)";
  }
}

export async function getGa4AdminSettingsSnapshot(): Promise<Ga4AdminSettingsSnapshot> {
  const [settings, secrets, config] = await Promise.all([
    getSettings(),
    getTrackingSecretsForAdmin(),
    getGa4Config(),
  ]);

  const measurementId = settings?.google_analytics_id?.trim() ?? "";
  const propertyId = settings?.ga4_property_id?.trim() ?? "";
  const sa = secrets?.ga4_service_account_json;

  const serviceRoleConfigured = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );

  let migrationHint: string | null = null;
  if (settings && !("ga4_property_id" in settings)) {
    migrationHint = "شغّلي supabase/ga4-analytics-migration.sql في SQL Editor";
  }

  return {
    measurementId,
    propertyId,
    measurementConfigured: Boolean(measurementId),
    dataApiConfigured: isGa4DataApiReady({
      measurementId: measurementId || null,
      propertyId: normalizeGa4PropertyId(propertyId),
      serviceAccountJson: sa ?? config.serviceAccountJson,
    }),
    serviceAccountConfigured: Boolean(sa?.trim()),
    serviceAccountPreview: previewServiceAccount(sa),
    serviceRoleConfigured,
    migrationHint,
  };
}
