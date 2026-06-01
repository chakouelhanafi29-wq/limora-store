import type { Ga4DashboardSlice } from "./types";

/** Ensure overview metrics reflect daily/channel totals when user metrics are empty. */
export function normalizeGa4Overview(data: Ga4DashboardSlice): Ga4DashboardSlice {
  let { sessions, activeUsers, totalUsers, screenPageViews } = data.overview;

  if (!sessions && !activeUsers && !totalUsers && !screenPageViews && data.daily.length) {
    for (const day of data.daily) {
      sessions += day.sessions;
      activeUsers += day.activeUsers;
      screenPageViews += day.screenPageViews;
    }
    totalUsers = activeUsers;
  }

  if (!sessions && data.trafficSources.length) {
    sessions = data.trafficSources.reduce((sum, row) => sum + row.count, 0);
  }

  return {
    ...data,
    overview: {
      ...data.overview,
      sessions,
      activeUsers,
      totalUsers,
      screenPageViews,
    },
  };
}
