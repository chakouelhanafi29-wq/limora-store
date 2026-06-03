import { getSettings } from "@/lib/supabase/queries";
import {
  getLastGa4ServiceAccountLoadSource,
  getTrackingSecretsForServer,
  type Ga4ServiceAccountLoadSource,
} from "@/lib/tracking/secrets";

export type Ga4Config = {
  measurementId: string | null;
  propertyId: string | null;
  serviceAccountJson: string | null;
  serviceAccountLoadSource: Ga4ServiceAccountLoadSource;
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

function resolveServiceAccountJson(
  secretsJson: string | null | undefined,
): { json: string | null; source: Ga4ServiceAccountLoadSource } {
  const fromDb = secretsJson?.trim();
  if (fromDb) {
    return { json: fromDb, source: getLastGa4ServiceAccountLoadSource() };
  }

  const fromEnv = env("GA4_SERVICE_ACCOUNT_JSON");
  if (fromEnv) {
    return { json: fromEnv, source: "env" };
  }

  return { json: null, source: "none" };
}

function buildGa4Config(
  settings: {
    google_analytics_id?: string | null;
    ga4_property_id?: string | null;
  } | null,
  secrets: Awaited<ReturnType<typeof getTrackingSecretsForServer>>,
): Ga4Config {
  const serviceAccount = resolveServiceAccountJson(
    secrets?.ga4_service_account_json,
  );

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
    serviceAccountJson: serviceAccount.json,
    serviceAccountLoadSource: serviceAccount.source,
  };
}

export function isGa4DataApiReady(config: Ga4Config): boolean {
  return Boolean(config.propertyId && config.serviceAccountJson);
}

/** Service-role probe (scripts / maintenance) — no admin session cookies. */
export async function getGa4ConfigForServerProbe(): Promise<Ga4Config> {
  const { getTrackingSecretsForServer } = await import("@/lib/tracking/secrets");
  const { createServiceRoleClient } = await import("@/lib/supabase/service");
  const service = createServiceRoleClient();

  if (service) {
    const [{ data: settings }, secrets] = await Promise.all([
      service
        .from("settings")
        .select("google_analytics_id,ga4_property_id")
        .eq("id", 1)
        .maybeSingle(),
      getTrackingSecretsForServer(),
    ]);
    return buildGa4Config(settings, secrets);
  }

  return buildGa4Config(null, null);
}

export async function getGa4Config(): Promise<Ga4Config> {
  const [settings, secrets] = await Promise.all([
    getSettings(),
    getTrackingSecretsForServer(),
  ]);

  const config = buildGa4Config(settings, secrets);
  if (isGa4DataApiReady(config)) return config;

  const viaServiceRole = await getGa4ConfigForServerProbe();
  if (isGa4DataApiReady(viaServiceRole)) return viaServiceRole;

  return config;
}
