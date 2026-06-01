import { resolveDateRange, type DatePreset } from "@/lib/analytics/date-range";
import { probeProductionAnalyticsRuntime } from "@/lib/analytics/ga4/production-runtime-probe";
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

  const runtimeProbe = await probeProductionAnalyticsRuntime(
    preset,
    customStart,
    customEnd,
  );
  const finalDashboard = await getAnalyticsDashboard(
    preset,
    customStart,
    customEnd,
  );

  const o = runtimeProbe.overview;

  return {
    ...runtimeProbe,
    supabase: {
      ordersCount,
      eventsCount,
    },
    liveDashboardLoader: {
      traffic: {
        totalVisitors: finalDashboard.traffic.totalVisitors,
        sessions: finalDashboard.traffic.sessions,
      },
      cod: {
        totalOrders: finalDashboard.cod.totalOrders,
        totalRevenue: finalDashboard.cod.totalRevenue,
      },
      tracking_ga4: finalDashboard.tracking.ga4,
    },
    summary: {
      overview_totalUsers: o?.totalUsers ?? null,
      overview_activeUsers: o?.activeUsers ?? null,
      overview_sessions: o?.sessions ?? null,
      traffic_totalVisitors:
        finalDashboard.traffic.totalVisitors,
    },
  };
}
