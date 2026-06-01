import { NextResponse } from "next/server";
import {
  getGa4Config,
  isValidMeasurementId,
  normalizeGa4PropertyId,
} from "@/lib/analytics/ga4/config";
import { getGa4AdminSettingsSnapshot } from "@/lib/analytics/ga4/admin-settings";
import { createClient, isAdminUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { upsertTrackingSecretsForAdmin } from "@/lib/tracking/secrets";

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await getGa4AdminSettingsSnapshot();
  const config = await getGa4Config();

  return NextResponse.json({
    ...snapshot,
    configReady: Boolean(config.propertyId && config.serviceAccountJson),
  });
}

type Ga4SettingsBody = {
  measurementId?: string;
  propertyId?: string;
  ga4_service_account_json?: string;
  clear_ga4_service_account?: boolean;
};

async function saveGa4Settings(body: Ga4SettingsBody) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل", status: 503 as const };
  }

  const measurementId = body.measurementId?.trim() ?? "";
  const propertyId = body.propertyId?.trim() ?? "";

  if (measurementId && !isValidMeasurementId(measurementId)) {
    return {
      error: "Measurement ID يجب أن يبدأ بـ G- (مثال: G-XXXXXXXXXX)",
      status: 400 as const,
    };
  }

  if (propertyId && !normalizeGa4PropertyId(propertyId)) {
    return {
      error: "Property ID يجب أن يكون أرقاماً فقط (من GA4 Property settings)",
      status: 400 as const,
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
          status: 400 as const,
        };
      }
    } catch {
      return { error: "JSON غير صالح", status: 400 as const };
    }
  }

  const supabase = await createClient();
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
    return { error: settingsError.message + hint, status: 500 as const };
  }

  if (body.clear_ga4_service_account) {
    const { clearTrackingSecretForAdmin } = await import("@/lib/tracking/secrets");
    const { error } = await clearTrackingSecretForAdmin("ga4_service_account_json");
    if (error) {
      return { error, status: 500 as const };
    }
  }

  if (body.ga4_service_account_json !== undefined) {
    const { error: secretsError } = await upsertTrackingSecretsForAdmin({
      ga4_service_account_json: body.ga4_service_account_json,
    });
    if (secretsError) {
      return { error: secretsError, status: 500 as const };
    }
  }

  return { error: null, status: 200 as const };
}

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Ga4SettingsBody;
  const result = await saveGa4Settings(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const snapshot = await getGa4AdminSettingsSnapshot();
  return NextResponse.json({ ok: true, ...snapshot });
}
