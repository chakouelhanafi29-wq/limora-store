import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import type { Order } from "@/lib/types/database";
import { applyGa4ToDashboard } from "./merge-dashboard";
import { fetchGa4DashboardSlice } from "./fetch-dashboard";
import { formatGa4ReportDate } from "./dates";
import { getGa4Config, isGa4DataApiReady, type Ga4Config } from "./config";
import { logAnalyticsRuntime } from "./runtime-log";
import { traceEnrichGa4Config } from "./runtime-trace";

function pipelineError(step: string, detail: string) {
  return `[ga4_pipeline] ${step}: ${detail}`;
}

export async function enrichDashboardWithGa4(
  dashboard: AnalyticsDashboardData,
  orderList: Order[],
  range: { start: Date; end: Date },
  ga4ConfigOverride?: Ga4Config,
): Promise<AnalyticsDashboardData> {
  const ga4Config = ga4ConfigOverride ?? (await getGa4Config());
  await traceEnrichGa4Config(ga4Config);
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

  logAnalyticsRuntime("enrichDashboardWithGa4.baseBeforeGa4", {
    traffic_totalVisitors: dashboard.traffic.totalVisitors,
    traffic_sessions: dashboard.traffic.sessions,
    cod_totalOrders: dashboard.cod.totalOrders,
    propertyId: ga4Config.propertyId,
    dateStart: formatGa4ReportDate(range.start),
    dateEnd: formatGa4ReportDate(range.end),
  });

  if (!isGa4DataApiReady(ga4Config)) {
    const missing = !ga4Config.propertyId
      ? "propertyId"
      : "serviceAccountJson";
    dashboard.tracking.ga4.lastError = pipelineError(
      "isGa4DataApiReady",
      `getGa4Config() missing ${missing} — admin visitors require GA4 Data API, not collect/gtag`,
    );
    logAnalyticsRuntime("enrichDashboardWithGa4.earlyExit", {
      reason: "isGa4DataApiReady_false",
      missing,
      traffic_totalVisitors: dashboard.traffic.totalVisitors,
    });
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
    logAnalyticsRuntime("enrichDashboardWithGa4.earlyExit", {
      reason: "fetchGa4DashboardSlice_failed",
      error: gaResult.error,
      traffic_totalVisitors: dashboard.traffic.totalVisitors,
    });
    return dashboard;
  }

  dashboard.tracking.ga4.connected = true;
  dashboard.tracking.ga4.lastError = null;

  const gaData = gaResult.data;
  const { sessions, activeUsers, totalUsers, screenPageViews } = gaData.overview;

  logAnalyticsRuntime("enrichDashboardWithGa4.afterFetch", {
    overview: {
      totalUsers,
      activeUsers,
      sessions,
      screenPageViews,
    },
    traffic_totalVisitors_beforeMerge: dashboard.traffic.totalVisitors,
  });

  const merged = applyGa4ToDashboard(dashboard, gaData, orderList);
  logAnalyticsRuntime("enrichDashboardWithGa4.afterMerge", {
    traffic_totalVisitors: merged.traffic.totalVisitors,
    traffic_sessions: merged.traffic.sessions,
  });
  return merged;
}
