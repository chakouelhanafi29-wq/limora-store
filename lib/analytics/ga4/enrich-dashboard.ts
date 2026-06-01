import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import type { Order } from "@/lib/types/database";
import { applyGa4ToDashboard } from "./merge-dashboard";
import { fetchGa4DashboardSlice } from "./fetch-dashboard";
import { formatGa4ReportDate } from "./dates";
import { getGa4Config, isGa4DataApiReady } from "./config";

function pipelineError(step: string, detail: string) {
  return `[ga4_pipeline] ${step}: ${detail}`;
}

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
    const missing = !ga4Config.propertyId
      ? "propertyId"
      : "serviceAccountJson";
    dashboard.tracking.ga4.lastError = pipelineError(
      "isGa4DataApiReady",
      `getGa4Config() missing ${missing} — admin visitors require GA4 Data API, not collect/gtag`,
    );
    return dashboard;
  }

  const gaResult = await fetchGa4DashboardSlice(
    ga4Config,
    range.start,
    range.end,
  );

  if (!gaResult.ok) {
    dashboard.tracking.ga4.lastError = pipelineError(
      "fetchGa4DashboardSlice",
      gaResult.error ?? "unknown error",
    );
    return dashboard;
  }

  const { sessions, activeUsers, totalUsers, screenPageViews } =
    gaResult.data.overview;
  const hasTraffic =
    sessions > 0 || activeUsers > 0 || totalUsers > 0 || screenPageViews > 0;

  const merged = applyGa4ToDashboard(dashboard, gaResult.data, orderList);

  if (!hasTraffic) {
    merged.tracking.ga4.connected = false;
    merged.tracking.ga4.lastError = pipelineError(
      "fetchGa4DashboardSlice",
      `0 rows for properties/${ga4Config.propertyId} (${formatGa4ReportDate(range.start)}..${formatGa4ReportDate(range.end)}). Storefront collect uses tid=${ga4Config.measurementId ?? "?"}. Data API reads a different pipeline than collect — both must target the same GA4 property.`,
    );
    return merged;
  }

  return merged;
}
