import { getSettings } from "@/lib/supabase/queries";
import { getTrackingSecretsForServer } from "@/lib/tracking/secrets";

export type Ga4Config = {
  measurementId: string | null;
  propertyId: string | null;
  serviceAccountJson: string | null;
};

function env(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

export function normalizeGa4PropertyId(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const digits = value.trim().replace(/^properties\//i, "").replace(/\D/g, "");
  return digits || null;
}

export function isValidMeasurementId(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  return /^G-[A-Z0-9]+$/i.test(value.trim());
}

export function isGa4DataApiReady(config: Ga4Config): boolean {
  return Boolean(config.propertyId && config.serviceAccountJson);
}

export async function getGa4Config(): Promise<Ga4Config> {
  const [settings, secrets] = await Promise.all([
    getSettings(),
    getTrackingSecretsForServer(),
  ]);

  return {
    measurementId:
      settings?.google_analytics_id?.trim() ||
      env("GOOGLE_ANALYTICS_ID") ||
      env("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID") ||
      env("GA4_MEASUREMENT_ID") ||
      null,
    propertyId:
      normalizeGa4PropertyId(settings?.ga4_property_id) ||
      normalizeGa4PropertyId(env("GA4_PROPERTY_ID")),
    serviceAccountJson:
      secrets?.ga4_service_account_json?.trim() ||
      env("GA4_SERVICE_ACCOUNT_JSON") ||
      null,
  };
}
