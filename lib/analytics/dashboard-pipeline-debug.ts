import { resolveDateRange, type DatePreset } from "@/lib/analytics/date-range";
import { buildPipelineRuntimeSnapshot } from "@/lib/analytics/ga4/fetch-overview-debug";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function loadAnalyticsDashboardPipelineDebug(
  preset: DatePreset,
  customStart?: string,
  customEnd?: string,
) {
  const range = resolveDateRange(preset, customStart, customEnd);

  let ordersCount = 0;
  let eventsCount = 0;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const [{ count: orderCount }, { count: eventCount }] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString()),
      supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString()),
    ]);
    ordersCount = orderCount ?? 0;
    eventsCount = eventCount ?? 0;
  }

  const ga4Runtime = await buildPipelineRuntimeSnapshot(range.start, range.end);
  const finalDashboard = await getAnalyticsDashboard(
    preset,
    customStart,
    customEnd,
  );

  return {
    range: {
      preset: range.preset,
      label: range.label,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    supabase: {
      ordersCount,
      eventsCount,
      note: "cod.totalOrders comes from orders table. traffic.totalVisitors does not.",
    },
    fetchGa4DashboardSlice: ga4Runtime.fetchGa4DashboardSlice,
    overview: ga4Runtime.overview,
    overview_totalUsers: ga4Runtime.overview?.totalUsers ?? null,
    overview_activeUsers: ga4Runtime.overview?.activeUsers ?? null,
    overview_sessions: ga4Runtime.overview?.sessions ?? null,
    overview_screenPageViews: ga4Runtime.overview?.screenPageViews ?? null,
    computedTotalVisitorsFromOverview:
      ga4Runtime.computedTotalVisitorsFromOverview,
    rawGa4OverviewResponse: ga4Runtime.rawOverview,
    immediatelyBeforeAnalyticsDashboardRender: {
      traffic: {
        totalVisitors: finalDashboard.traffic.totalVisitors,
        sessions: finalDashboard.traffic.sessions,
        uniqueVisitors: finalDashboard.traffic.uniqueVisitors,
      },
      cod: {
        totalOrders: finalDashboard.cod.totalOrders,
        totalRevenue: finalDashboard.cod.totalRevenue,
      },
      tracking_ga4: finalDashboard.tracking.ga4,
    },
    zeroLine: {
      file: "lib/analytics/ga4/merge-dashboard.ts",
      line: 125,
      expression: "totalVisitors: overview.totalUsers || overview.activeUsers",
    },
  };
}
