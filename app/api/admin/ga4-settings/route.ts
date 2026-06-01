import { NextResponse } from "next/server";
import {
  getGa4Config,
  isValidMeasurementId,
  normalizeGa4PropertyId,
} from "@/lib/analytics/ga4/config";
import { getGa4AdminSettingsSnapshot } from "@/lib/analytics/ga4/admin-settings";
import {
  createClient,
  isAdminUser,
  isAdminWithClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { ByteStringViolation } from "@/lib/http/byte-string";
import {
  formatByteStringEnvError,
  scanAdminSaveEnvKeysForByteString,
  violationFromErrorMessage,
} from "@/lib/http/byte-string";
import { getSupabaseAnonKey } from "@/lib/supabase/env";
import { upsertTrackingSecretsForAdmin } from "@/lib/tracking/secrets";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getGa4AdminSettingsSnapshot();
  const config = await getGa4Config();
  const { probeGa4ServiceAccountStorage } = await import("@/lib/tracking/secrets");
  const storageProbe = await probeGa4ServiceAccountStorage();

  return NextResponse.json({
    ...snapshot,
    serviceAccountJsonLoaded: Boolean(config.serviceAccountJson),
    serviceAccountLoadSource: config.serviceAccountLoadSource,
    configReady: Boolean(config.propertyId && config.serviceAccountJson),
    pipeline: {
      measurementId: config.measurementId,
      propertyId: config.propertyId,
      hasServiceAccount: Boolean(config.serviceAccountJson),
      dataApiReady: Boolean(config.propertyId && config.serviceAccountJson),
    },
    storageProbe,
  });
}

type Ga4SettingsBody = {
  measurementId?: string;
  propertyId?: string;
  ga4_service_account_json?: string;
  clear_ga4_service_account?: boolean;
};

type SaveGa4Result = {
  error: string | null;
  status: 200 | 400 | 500 | 503;
  step?: string;
  byteStringDiagnostic?: ByteStringViolation;
  runtimeKeys?: ReturnType<typeof runtimeKeyProbe>;
};

function runtimeKeyProbe() {
  function meta(raw: string | undefined) {
    const value = raw?.trim() ?? "";
    return {
      length: value.length,
      char0: value.length ? value.charCodeAt(0) : null,
      prefix: value.slice(0, 4),
    };
  }

  return {
    publishable: meta(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    anon: meta(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRole: meta(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resolvedAnonKey: meta(getSupabaseAnonKey()),
  };
}

function logPostFailure(payload: Record<string, unknown>) {
  console.error("[ga4-settings POST]", JSON.stringify(payload));
}

async function saveGa4Settings(
  body: Ga4SettingsBody,
  supabase: SupabaseClient,
  byteStringDiagnosticRef?: { current?: ByteStringViolation },
): Promise<SaveGa4Result> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل", status: 503 };
  }

  const envViolations = scanAdminSaveEnvKeysForByteString();
  if (envViolations.length > 0) {
    const runtimeKeys = runtimeKeyProbe();
    const violation = envViolations[0];
    logPostFailure({ step: "env_scan", byteStringDiagnostic: violation, runtimeKeys });
    return {
      error: formatByteStringEnvError(violation),
      status: 500,
      step: "env_scan",
      byteStringDiagnostic: violation,
      runtimeKeys,
    };
  }

  const measurementId = body.measurementId?.trim() ?? "";
  const propertyId = body.propertyId?.trim() ?? "";

  if (measurementId && !isValidMeasurementId(measurementId)) {
    return {
      error: "Measurement ID يجب أن يبدأ بـ G- (مثال: G-XXXXXXXXXX)",
      status: 400,
    };
  }

  if (propertyId && !normalizeGa4PropertyId(propertyId)) {
    return {
      error: "Property ID يجب أن يكون أرقاماً فقط (من GA4 Property settings)",
      status: 400,
    };
  }

  if (body.ga4_service_account_json?.trim()) {
    try {
      const parsed = JSON.parse(body.ga4_service_account_json) as {
        client_email?: string;
        private_key?: string;
      };
      if (!parsed.client_email || !parsed.private_key) {
        return {
          error: "JSON غير صالح — يجب أن يحتوي client_email و private_key",
          status: 400,
        };
      }
    } catch {
      return { error: "JSON غير صالح", status: 400 };
    }
  }

  const byteStringDiagnostic = byteStringDiagnosticRef?.current;

  const settingsResult = await updateSettings(
    supabase,
    measurementId,
    propertyId,
  );
  if (settingsResult.error) {
    return {
      ...settingsResult,
      byteStringDiagnostic:
        settingsResult.byteStringDiagnostic ?? byteStringDiagnostic,
      runtimeKeys: runtimeKeyProbe(),
    };
  }

  if (body.clear_ga4_service_account) {
    const { clearTrackingSecretForAdmin } = await import("@/lib/tracking/secrets");
    const { error } = await clearTrackingSecretForAdmin(
      "ga4_service_account_json",
      supabase,
    );
    if (error) {
      return {
        error,
        status: 500,
        step: "clear_ga4_service_account",
        byteStringDiagnostic:
          violationFromErrorMessage(error) ?? byteStringDiagnostic,
        runtimeKeys: runtimeKeyProbe(),
      };
    }
  }

  if (body.ga4_service_account_json !== undefined) {
    const { error: secretsError } = await upsertTrackingSecretsForAdmin(
      { ga4_service_account_json: body.ga4_service_account_json },
      supabase,
    );
    if (secretsError) {
      return {
        error: secretsError,
        status: 500,
        step: "upsert_tracking_secrets",
        byteStringDiagnostic:
          violationFromErrorMessage(secretsError) ?? byteStringDiagnostic,
        runtimeKeys: runtimeKeyProbe(),
      };
    }
  }

  return { error: null, status: 200 };
}

async function updateSettings(
  supabase: SupabaseClient,
  measurementId: string,
  propertyId: string,
): Promise<SaveGa4Result> {
  const { error: settingsError } = await supabase
    .from("settings")
    .update({
      google_analytics_id: measurementId || null,
      ga4_property_id: propertyId || null,
    })
    .eq("id", 1);

  if (settingsError) {
    const hint = settingsError.message.includes("ga4_property_id")
      ? " — شغّلي supabase/ga4-analytics-migration.sql"
      : "";
    return {
      error: settingsError.message + hint,
      status: 500,
      step: "update_settings",
      byteStringDiagnostic:
        violationFromErrorMessage(settingsError.message) ?? undefined,
    };
  }

  return { error: null, status: 200 };
}

export async function POST(request: Request) {
  let body: Ga4SettingsBody;
  try {
    body = (await request.json()) as Ga4SettingsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const diagnosticRef: { current?: ByteStringViolation } = {};
  const supabase = await createClient({
    onByteStringViolation: (violation) => {
      diagnosticRef.current = violation;
    },
  });

  if (!(await isAdminWithClient(supabase))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let result: SaveGa4Result;
  try {
    result = await saveGa4Settings(body, supabase, diagnosticRef);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const diagnostic =
      (error as { byteStringDiagnostic?: ByteStringViolation })
        .byteStringDiagnostic ?? violationFromErrorMessage(message);
    return NextResponse.json(
      {
        error: message,
        step: "uncaught",
        byteStringDiagnostic: diagnostic,
      },
      { status: 500 },
    );
  }

  if (result.error) {
    const payload = {
      error: result.error,
      step: result.step,
      byteStringDiagnostic: result.byteStringDiagnostic,
      runtimeKeys: result.runtimeKeys ?? runtimeKeyProbe(),
    };
    logPostFailure(payload);
    return NextResponse.json(payload, { status: result.status });
  }

  const snapshot = await getGa4AdminSettingsSnapshot();
  return NextResponse.json({ ok: true, ...snapshot });
}
