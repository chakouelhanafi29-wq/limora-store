import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import type { Order } from "@/lib/types/database";
import type { Ga4DashboardSlice } from "./types";

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function fillDailyVisitors(
  start: Date,
  end: Date,
  gaDaily: Ga4DashboardSlice["daily"],
) {
  const map = new Map(
    gaDaily.map((row) => [
      row.date,
      { visitors: row.activeUsers, pageViews: row.screenPageViews },
    ]),
  );
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(23, 59, 59, 999);

  while (cursor <= endDay) {
    const key = cursor.toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, { visitors: 0, pageViews: 0 });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, row]) => ({
      date,
      visitors: row.visitors,
      pageViews: row.pageViews,
    }));
}

function deviceOrdersFromDb(orderList: Order[]) {
  const deviceOrders = new Map<string, number>();
  for (const order of orderList) {
    const device = order.device_type || "unknown";
    deviceOrders.set(device, (deviceOrders.get(device) ?? 0) + 1);
  }
  return deviceOrders;
}

export function applyGa4ToDashboard(
  dashboard: AnalyticsDashboardData,
  ga: Ga4DashboardSlice,
  orderList: Order[],
): AnalyticsDashboardData {
  const { overview } = ga;
  const totalOrders = dashboard.cod.totalOrders;
  const deviceOrders = deviceOrdersFromDb(orderList);

  const mobileSessions =
    ga.devices.find((d) => d.key.toLowerCase() === "mobile")?.count ?? 0;
  const desktopSessions =
    ga.devices.find((d) => d.key.toLowerCase() === "desktop")?.count ?? 0;
  const tabletSessions =
    ga.devices.find((d) => d.key.toLowerCase() === "tablet")?.count ?? 0;

  const mobileOrders = deviceOrders.get("mobile") ?? 0;
  const desktopOrders = deviceOrders.get("desktop") ?? 0;
  const tabletOrders = deviceOrders.get("tablet") ?? 0;

  const conversionByDevice = ga.devices.map((device) => {
    const key = device.key.toLowerCase();
    const orders =
      key === "mobile"
        ? mobileOrders
        : key === "desktop"
          ? desktopOrders
          : key === "tablet"
            ? tabletOrders
            : 0;
    return {
      key,
      label: device.label,
      sessions: device.count,
      orders,
      conversionRate: pct(orders, device.count),
    };
  });

  const mobileVsDesktop = [
    {
      key: "mobile",
      label: "جوال",
      sessions: mobileSessions,
      orders: mobileOrders,
      conversionRate: pct(mobileOrders, mobileSessions),
    },
    {
      key: "desktop",
      label: "كمبيوتر",
      sessions: desktopSessions,
      orders: desktopOrders,
      conversionRate: pct(desktopOrders, desktopSessions),
    },
    ...(tabletSessions > 0
      ? [
          {
            key: "tablet",
            label: "تابلت",
            sessions: tabletSessions,
            orders: tabletOrders,
            conversionRate: pct(tabletOrders, tabletSessions),
          },
        ]
      : []),
  ];

  const start = new Date(dashboard.range.start);
  const end = new Date(dashboard.range.end);

  return {
    ...dashboard,
    traffic: {
      totalVisitors:
        overview.totalUsers ||
        overview.activeUsers ||
        overview.sessions,
      uniqueVisitors:
        overview.activeUsers || overview.totalUsers || overview.sessions,
      sessions: overview.sessions,
      pageViews: overview.screenPageViews,
      topLandingPages: ga.topPages.slice(0, 10),
      trafficByPlatform: ga.trafficSources,
      topCountries: ga.countries.slice(0, 10),
      utmPerformance: dashboard.traffic.utmPerformance,
    },
    conversion: {
      ...dashboard.conversion,
      conversionRate: pct(totalOrders, overview.sessions),
      purchaseRate: pct(
        Math.max(overview.purchases, totalOrders),
        overview.sessions || 1,
      ),
    },
    devices: {
      mobileVsDesktop,
      osBreakdown: dashboard.devices.osBreakdown,
      browserBreakdown: dashboard.devices.browserBreakdown,
      conversionByDevice,
    },
    charts: {
      ordersPerDay: dashboard.charts.ordersPerDay,
      visitorsPerDay: fillDailyVisitors(start, end, ga.daily),
    },
    tracking: {
      ...dashboard.tracking,
      ga4: {
        ...dashboard.tracking.ga4,
        connected: true,
        lastError: null,
      },
    },
  };
}
