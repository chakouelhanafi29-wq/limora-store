import type { Ga4DashboardSlice } from "./types";

function sumDaily(data: Ga4DashboardSlice["daily"]) {
  let sessions = 0;
  let activeUsers = 0;
  let screenPageViews = 0;
  for (const day of data) {
    sessions += day.sessions;
    activeUsers += day.activeUsers;
    screenPageViews += day.screenPageViews;
  }
  return { sessions, activeUsers, screenPageViews };
}

/** Fill overview from daily/channel/device rows when the dimensionless row is empty. */
export function normalizeGa4Overview(data: Ga4DashboardSlice): Ga4DashboardSlice {
  let { sessions, activeUsers, totalUsers, screenPageViews } = data.overview;

  if (data.daily.length) {
    const daily = sumDaily(data.daily);
    if (!sessions && daily.sessions) sessions = daily.sessions;
    if (!activeUsers && daily.activeUsers) activeUsers = daily.activeUsers;
    if (!screenPageViews && daily.screenPageViews) {
      screenPageViews = daily.screenPageViews;
    }
    if (!totalUsers && daily.activeUsers) totalUsers = daily.activeUsers;
  }

  if (!sessions && data.trafficSources.length) {
    sessions = data.trafficSources.reduce((sum, row) => sum + row.count, 0);
  }

  if (!sessions && data.devices.length) {
    sessions = data.devices.reduce((sum, row) => sum + row.count, 0);
  }

  if (!activeUsers && totalUsers) activeUsers = totalUsers;
  if (!totalUsers && activeUsers) totalUsers = activeUsers;

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
