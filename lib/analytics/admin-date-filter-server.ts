import { cookies } from "next/headers";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import {
  DATE_FILTER_COOKIE,
  DEFAULT_DATE_FILTER,
  parseDateFilterCookie,
} from "@/lib/analytics/admin-date-filter";
import { logAnalyticsRuntime } from "@/lib/analytics/ga4/runtime-log";

export async function getAdminAnalyticsInitialData() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DATE_FILTER_COOKIE)?.value;
  const filter = raw
    ? parseDateFilterCookie(decodeURIComponent(raw))
    : DEFAULT_DATE_FILTER;

  const data = await getAnalyticsDashboard(
    filter.preset,
    filter.preset === "custom" ? filter.customStart : undefined,
    filter.preset === "custom" ? filter.customEnd : undefined,
  );

  logAnalyticsRuntime("AnalyticsDashboard.beforeRender", {
    preset: filter.preset,
    traffic: {
      totalVisitors: data.traffic.totalVisitors,
      sessions: data.traffic.sessions,
      uniqueVisitors: data.traffic.uniqueVisitors,
    },
    cod: {
      totalOrders: data.cod.totalOrders,
      totalRevenue: data.cod.totalRevenue,
    },
    ga4: data.tracking.ga4,
  });

  return data;
}
