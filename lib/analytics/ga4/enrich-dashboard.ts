import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import type { Order } from "@/lib/types/database";
import { applyGa4ToDashboard } from "./merge-dashboard";
import { fetchGa4DashboardSlice } from "./fetch-dashboard";
import { getGa4Config, isGa4DataApiReady } from "./config";

const MISSING_SERVICE_ACCOUNT_AR =
  "أضيفي Service Account JSON في إعدادات GA4 (مع Viewer على Property) لتفعيل الزوار والجلسات في لوحة التحليلات.";

export async function enrichDashboardWithGa4(
  dashboard: AnalyticsDashboardData,
  orderList: Order[],
  range: { start: Date; end: Date },
): Promise<AnalyticsDashboardData> {
  const ga4Config = await getGa4Config();
  const ga4TrackingBase = {
    configured: Boolean(
      ga4Config.measurementId ||
        ga4Config.propertyId ||
        ga4Config.serviceAccountJson,
    ),
    connected: false,
    measurementId: ga4Config.measurementId,
    propertyId: ga4Config.propertyId,
    lastError: null as string | null,
  };

  dashboard.tracking.ga4 = { ...ga4TrackingBase };

  if (!isGa4DataApiReady(ga4Config)) {
    if (ga4Config.propertyId && !ga4Config.serviceAccountJson) {
      dashboard.tracking.ga4.lastError = MISSING_SERVICE_ACCOUNT_AR;
    }
    return dashboard;
  }

  const gaResult = await fetchGa4DashboardSlice(
    ga4Config,
    range.start,
    range.end,
  );

  if (gaResult.ok) {
    return applyGa4ToDashboard(dashboard, gaResult.data, orderList);
  }

  dashboard.tracking.ga4 = {
    ...ga4TrackingBase,
    lastError: gaResult.error ?? "GA4 Data API request failed",
  };
  return dashboard;
}
