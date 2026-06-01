import { resolveDateRange, type DatePreset } from "@/lib/analytics/date-range";
import { getGa4ConfigForServerProbe } from "./config";
import { fetchGa4DashboardSlice } from "./fetch-dashboard";
import { enrichDashboardWithGa4 } from "./enrich-dashboard";
import { fetchGa4OverviewRawDebug } from "./fetch-overview-debug";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";

function emptyBaseDashboard(
  preset: DatePreset,
  range: ReturnType<typeof resolveDateRange>,
): AnalyticsDashboardData {
  return {
    range: {
      preset,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      label: range.label,
    },
    traffic: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      sessions: 0,
      pageViews: 0,
      topLandingPages: [],
      topCountries: [],
      trafficByPlatform: [],
      utmPerformance: [],
    },
    conversion: {
      conversionRate: 0,
      productPageConversionRate: 0,
      checkoutOpenRate: 0,
      leadSubmitRate: 0,
      purchaseRate: 0,
      funnel: [],
      dropOff: [],
    },
    cod: { totalOrders: 8, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0, confirmationRate: 0, deliveredRate: 0, cancelledRate: 0, codSuccessRate: 0, totalRevenue: 0 },
    products: [],
    bestSelling: null,
    bestConverting: null,
    devices: {
      mobileVsDesktop: [],
      osBreakdown: [],
      browserBreakdown: [],
      conversionByDevice: [],
    },
    tracking: {
      eventBreakdown: [],
      serverEvents: 0,
      storedEvents: 0,
      deduplicatedEventIds: 0,
      capiStatus: { meta: false, tiktok: false, snapchat: false },
      ga4: {
        configured: false,
        connected: false,
        measurementId: null,
        propertyId: null,
        lastError: null,
      },
      platformSignal: [],
    },
    charts: { ordersPerDay: [], visitorsPerDay: [] },
    recentOrders: [],
  };
}

/** Full runtime probe — same code path as production dashboard GA4 merge. */
export async function probeProductionAnalyticsRuntime(
  preset: DatePreset = "7d",
  customStart?: string,
  customEnd?: string,
) {
  const range = resolveDateRange(preset, customStart, customEnd);
  const config = await getGa4ConfigForServerProbe();
  const gaResult = await fetchGa4DashboardSlice(config, range.start, range.end);
  const rawOverview = config.serviceAccountJson
    ? await fetchGa4OverviewRawDebug(config, range.start, range.end).catch(
        (e: Error) => ({ error: e.message }),
      )
    : { error: "no service account in getGa4Config()" };

  const overview = gaResult.ok ? gaResult.data.overview : null;
  const base = emptyBaseDashboard(preset, range);
  base.traffic.totalVisitors = 0;
  base.cod.totalOrders = 8;

  const afterEnrich = await enrichDashboardWithGa4(base, [], range, config);

  const totalUsers = overview?.totalUsers ?? 0;
  const activeUsers = overview?.activeUsers ?? 0;
  const sessions = overview?.sessions ?? 0;
  const computedVisitors =
    (overview &&
      (overview.totalUsers || overview.activeUsers || overview.sessions)) ??
    null;

  let failingLine: string | null = null;
  if (sessions > 0 && afterEnrich.traffic.totalVisitors === 0) {
    failingLine =
      "lib/analytics/ga4/merge-dashboard.ts:125 OR enrich-dashboard.ts:62 early return before merge";
  } else if (sessions === 0) {
    failingLine =
      "lib/analytics/ga4/enrich-dashboard.ts:62 hasTraffic_false — GA4 Data API returned overview.sessions=0 for date range";
  }

  return {
    range: {
      preset: range.preset,
      label: range.label,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    configUsed: {
      propertyId: config.propertyId,
      hasServiceAccount: Boolean(config.serviceAccountJson),
      measurementId: config.measurementId,
    },
    rawGa4OverviewResponseBeforeTransform: rawOverview,
    fetchGa4DashboardSlice: gaResult,
    overview: overview
      ? {
          totalUsers: overview.totalUsers,
          activeUsers: overview.activeUsers,
          sessions: overview.sessions,
          screenPageViews: overview.screenPageViews,
        }
      : null,
    computed_totalVisitors_from_overview: computedVisitors,
    baseBeforeEnrich: {
      traffic_totalVisitors: 0,
    },
    immediatelyBeforeAnalyticsDashboardRender: {
      traffic: {
        totalVisitors: afterEnrich.traffic.totalVisitors,
        sessions: afterEnrich.traffic.sessions,
        uniqueVisitors: afterEnrich.traffic.uniqueVisitors,
      },
      tracking_ga4: afterEnrich.tracking.ga4,
    },
    diagnosis: {
      overview_sessions_gt_0: sessions > 0,
      traffic_totalVisitors_eq_0: afterEnrich.traffic.totalVisitors === 0,
      failingLine,
    },
  };
}
