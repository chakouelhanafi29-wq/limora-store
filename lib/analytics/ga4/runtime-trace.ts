import { getGa4Config, type Ga4Config } from "./config";
import { isAdminUser, createClient } from "@/lib/supabase/server";
import {
  getLastServiceRoleReadError,
  getTrackingSecretsForServer,
  type TrackingSecretsRow,
} from "@/lib/tracking/secrets";
import { logAnalyticsRuntime } from "./runtime-log";
import {
  describeInvalidServiceRoleKey,
  isServiceRoleKeyConfigured,
  isServiceRoleKeyValid,
} from "@/lib/supabase/env";

export type Ga4ConfigRuntimeTrace = {
  requestContext: "ga4-settings" | "analytics";
  userId: string | null;
  sessionStatus: "authenticated" | "unauthenticated" | "error";
  sessionError: string | null;
  isAdminUser: boolean;
  serviceRoleKeyPresent: boolean;
  serviceRoleKeyValid: boolean;
  serviceRoleKeyInvalidReason: string | null;
  serviceRoleReadError: string | null;
  getTrackingSecretsForServer: {
    rowFound: boolean;
    ga4_service_account_json_exists: boolean;
    ga4_json_length: number;
  };
  getGa4Config: {
    serviceAccountJson_exists: boolean;
    serviceAccountJson_length: number;
    serviceAccountLoadSource: string;
    propertyId: string | null;
    measurementId: string | null;
  };
};

export async function captureGa4ConfigRuntimeTrace(
  requestContext: Ga4ConfigRuntimeTrace["requestContext"],
  loaded?: {
    config: Ga4Config;
    secrets: TrackingSecretsRow | null;
  },
): Promise<Ga4ConfigRuntimeTrace> {
  let userId: string | null = null;
  let sessionStatus: Ga4ConfigRuntimeTrace["sessionStatus"] = "unauthenticated";
  let sessionError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      sessionStatus = "error";
      sessionError = error.message;
    } else if (data.user) {
      sessionStatus = "authenticated";
      userId = data.user.id;
    }
  } catch (error) {
    sessionStatus = "error";
    sessionError = error instanceof Error ? error.message : String(error);
  }

  const adminOk = await isAdminUser();
  const secrets = loaded?.secrets ?? (await getTrackingSecretsForServer());
  const config = loaded?.config ?? (await getGa4Config());
  const ga4Raw = secrets?.ga4_service_account_json ?? null;

  const trace: Ga4ConfigRuntimeTrace = {
    requestContext,
    userId,
    sessionStatus,
    sessionError,
    isAdminUser: adminOk,
    serviceRoleKeyPresent: isServiceRoleKeyConfigured(),
    serviceRoleKeyValid: isServiceRoleKeyValid(),
    serviceRoleKeyInvalidReason: describeInvalidServiceRoleKey(),
    serviceRoleReadError: getLastServiceRoleReadError(),
    getTrackingSecretsForServer: {
      rowFound: Boolean(secrets),
      ga4_service_account_json_exists: Boolean(ga4Raw?.trim()),
      ga4_json_length: ga4Raw?.trim().length ?? 0,
    },
    getGa4Config: {
      serviceAccountJson_exists: Boolean(config.serviceAccountJson?.trim()),
      serviceAccountJson_length: config.serviceAccountJson?.trim().length ?? 0,
      serviceAccountLoadSource: config.serviceAccountLoadSource,
      propertyId: config.propertyId,
      measurementId: config.measurementId,
    },
  };

  logAnalyticsRuntime(`ga4.runtimeTrace.${requestContext}`, trace);
  return trace;
}

/** Log the exact getGa4Config() instance used by enrichDashboardWithGa4. */
export async function traceEnrichGa4Config(config: Ga4Config) {
  const secrets = await getTrackingSecretsForServer();
  return captureGa4ConfigRuntimeTrace("analytics", { config, secrets });
}
