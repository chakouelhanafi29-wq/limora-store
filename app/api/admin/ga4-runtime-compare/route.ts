import { NextResponse } from "next/server";
import { captureGa4ConfigRuntimeTrace } from "@/lib/analytics/ga4/runtime-trace";
import { getGa4Config } from "@/lib/analytics/ga4/config";
import { getTrackingSecretsForServer } from "@/lib/tracking/secrets";
import { isAdminUser } from "@/lib/supabase/server";

/**
 * Side-by-side runtime trace (one authenticated request, same cookies).
 * GET /api/admin/ga4-runtime-compare
 */
export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secrets = await getTrackingSecretsForServer();
  const config = await getGa4Config();

  const ga4Settings = await captureGa4ConfigRuntimeTrace("ga4-settings", {
    config,
    secrets,
  });

  const analytics = await captureGa4ConfigRuntimeTrace("analytics", {
    config,
    secrets,
  });

  const changed: string[] = [];
  if (
    ga4Settings.getGa4Config.serviceAccountJson_exists !==
    analytics.getGa4Config.serviceAccountJson_exists
  ) {
    changed.push("getGa4Config.serviceAccountJson_exists");
  }
  if (
    ga4Settings.getTrackingSecretsForServer.ga4_service_account_json_exists !==
    analytics.getTrackingSecretsForServer.ga4_service_account_json_exists
  ) {
    changed.push("getTrackingSecretsForServer.ga4_service_account_json_exists");
  }
  if (ga4Settings.isAdminUser !== analytics.isAdminUser) {
    changed.push("isAdminUser");
  }
  if (ga4Settings.userId !== analytics.userId) {
    changed.push("userId");
  }

  return NextResponse.json({
    ga4Settings,
    analytics,
    variableThatChanged: changed.length ? changed : null,
    note:
      "Both traces use the same getGa4Config() result in one request. For /admin/analytics HTML load, see ga4.runtimeTrace.analytics in Vercel logs (enrichDashboardWithGa4).",
  });
}
