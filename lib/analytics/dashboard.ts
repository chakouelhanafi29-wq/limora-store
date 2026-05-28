import { cache } from "react";
import { resolveDateRange, type DatePreset } from "@/lib/analytics/date-range";
import { getTrackingProviderConfig } from "@/lib/tracking/config";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AnalyticsEvent, Order } from "@/lib/types/database";
import type {
  AnalyticsCountRow,
  AnalyticsDashboardData,
  AnalyticsDropOff,
  AnalyticsFunnelStep,
  AnalyticsProductRow,
} from "@/lib/types/analytics-dashboard";

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  google: "Google",
  organic: "Organic",
  direct: "Direct",
};

const OS_LABELS: Record<string, string> = {
  ios: "iPhone / iOS",
  android: "Android",
  other: "أخرى",
  unknown: "غير محدد",
};

const BROWSER_LABELS: Record<string, string> = {
  safari: "Safari",
  chrome: "Chrome",
  other: "أخرى",
  unknown: "غير محدد",
};

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function emptyDashboard(
  preset: DatePreset,
  label: string,
  start: Date,
  end: Date,
): AnalyticsDashboardData {
  return {
    range: {
      preset,
      start: start.toISOString(),
      end: end.toISOString(),
      label,
    },
    traffic: {
      totalVisitors: 0,
      uniqueVisitors: 0,
      sessions: 0,
      pageViews: 0,
      topLandingPages: [],
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
    cod: {
      totalOrders: 0,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      confirmationRate: 0,
      deliveredRate: 0,
      cancelledRate: 0,
      codSuccessRate: 0,
      totalRevenue: 0,
    },
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
      platformSignal: [],
    },
    charts: {
      ordersPerDay: [],
      visitorsPerDay: [],
    },
    recentOrders: [],
  };
}

function getMetadata(event: AnalyticsEvent) {
  return (event.metadata ?? {}) as Record<string, unknown>;
}

function getOsKey(event: AnalyticsEvent) {
  const meta = getMetadata(event);
  const value = meta.os_family;
  return typeof value === "string" && value ? value : "unknown";
}

function getBrowserKey(event: AnalyticsEvent) {
  const meta = getMetadata(event);
  const value = meta.browser_name;
  return typeof value === "string" && value ? value : "unknown";
}

function countByKey<T>(
  items: T[],
  keyFn: (item: T) => string,
  labelFn: (key: string) => string = (key) => key,
): AnalyticsCountRow[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item) || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, label: labelFn(key), count }))
    .sort((a, b) => b.count - a.count);
}

function buildFunnel(
  sessions: number,
  viewContent: number,
  initiateCheckout: number,
  leads: number,
  purchases: number,
): AnalyticsFunnelStep[] {
  const base = sessions || 1;
  return [
    { step: "PageView", label: "زيارة", count: sessions, rate: 100 },
    {
      step: "ViewContent",
      label: "عرض منتج",
      count: viewContent,
      rate: pct(viewContent, base),
    },
    {
      step: "InitiateCheckout",
      label: "فتح الطلب",
      count: initiateCheckout,
      rate: pct(initiateCheckout, base),
    },
    { step: "Lead", label: "Lead / COD", count: leads, rate: pct(leads, base) },
    {
      step: "Purchase",
      label: "Purchase",
      count: purchases,
      rate: pct(purchases, base),
    },
  ];
}

function buildDropOff(funnel: AnalyticsFunnelStep[]): AnalyticsDropOff[] {
  const rows: AnalyticsDropOff[] = [];
  for (let i = 0; i < funnel.length - 1; i += 1) {
    const from = funnel[i];
    const to = funnel[i + 1];
    rows.push({
      from: from.label,
      to: to.label,
      fromCount: from.count,
      toCount: to.count,
      dropRate: pct(from.count - to.count, from.count || 1),
    });
  }
  return rows;
}

function fillDailySeries(
  start: Date,
  end: Date,
  map: Map<
    string,
    { visitors: Set<string>; pageViews: number; orders: number; revenue: number }
  >,
) {
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = endOfDay(end);

  while (cursor <= endDay) {
    const key = cursor.toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, {
        visitors: new Set(),
        pageViews: 0,
        orders: 0,
        revenue: 0,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
}

async function loadAnalyticsDashboardUncached(
  preset: DatePreset,
  customStart?: string,
  customEnd?: string,
): Promise<AnalyticsDashboardData> {
  const range = resolveDateRange(preset, customStart, customEnd);

  if (!isSupabaseConfigured()) {
    return emptyDashboard(preset, range.label, range.start, range.end);
  }

  const supabase = await createClient();
  const [{ data: events }, { data: orders }, trackingConfig] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", range.start.toISOString())
      .lte("created_at", range.end.toISOString())
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*")
      .gte("created_at", range.start.toISOString())
      .lte("created_at", range.end.toISOString())
      .order("created_at", { ascending: false }),
    getTrackingProviderConfig(),
  ]);

  const eventList = (events as AnalyticsEvent[] | null) ?? [];
  const orderList = (orders as Order[] | null) ?? [];

  if (!eventList.length && !orderList.length) {
    const empty = emptyDashboard(preset, range.label, range.start, range.end);
    empty.tracking.capiStatus = {
      meta: Boolean(trackingConfig.metaPixelId && trackingConfig.metaAccessToken),
      tiktok: Boolean(trackingConfig.tiktokPixelId && trackingConfig.tiktokAccessToken),
      snapchat: Boolean(
        trackingConfig.snapchatPixelId && trackingConfig.snapchatAccessToken,
      ),
    };
    return empty;
  }

  const sessionIds = new Set<string>();
  const pageViewSessions = new Set<string>();
  let pageViews = 0;
  let viewContent = 0;
  let initiateCheckout = 0;
  let leadEvents = 0;
  let purchaseEvents = 0;
  const eventIds = new Set<string>();
  let serverEvents = 0;

  const viewSessions = new Set<string>();
  const checkoutSessions = new Set<string>();
  const leadSessions = new Set<string>();

  for (const event of eventList) {
    if (event.session_id) sessionIds.add(event.session_id);
    const meta = getMetadata(event);
    if (meta.server_side === true) serverEvents += 1;
    if (typeof meta.event_id === "string" && meta.event_id) eventIds.add(meta.event_id);

    switch (event.event_name) {
      case "PageView":
        pageViews += 1;
        if (event.session_id) pageViewSessions.add(event.session_id);
        break;
      case "ViewContent":
        viewContent += 1;
        if (event.session_id) viewSessions.add(event.session_id);
        break;
      case "InitiateCheckout":
        initiateCheckout += 1;
        if (event.session_id) checkoutSessions.add(event.session_id);
        break;
      case "Lead":
        leadEvents += 1;
        if (event.session_id) leadSessions.add(event.session_id);
        break;
      case "Purchase":
        purchaseEvents += 1;
        break;
      default:
        break;
    }
  }

  const sessions = pageViewSessions.size || sessionIds.size || pageViews;
  const uniqueVisitors = sessionIds.size || sessions;
  const totalOrders = orderList.length;
  const purchases = Math.max(purchaseEvents, totalOrders);
  const leads = Math.max(leadEvents, totalOrders);
  const totalRevenue = orderList.reduce(
    (sum, order) => sum + Number(order.total_price),
    0,
  );

  const pending = orderList.filter((o) => o.status === "pending").length;
  const confirmed = orderList.filter((o) => o.status === "confirmed").length;
  const shipped = orderList.filter((o) => o.status === "shipped").length;
  const delivered = orderList.filter((o) => o.status === "delivered").length;
  const cancelled = orderList.filter((o) => o.status === "cancelled").length;
  const fulfilled = confirmed + shipped + delivered;

  const landingMap = new Map<string, number>();
  for (const event of eventList) {
    if (event.event_name !== "PageView") continue;
    const path = event.page_path || "/";
    landingMap.set(path, (landingMap.get(path) ?? 0) + 1);
  }
  const topLandingPages = Array.from(landingMap.entries())
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const platformMap = new Map<string, number>();
  for (const event of eventList) {
    if (event.event_name !== "PageView") continue;
    const key = event.traffic_platform || "direct";
    platformMap.set(key, (platformMap.get(key) ?? 0) + 1);
  }
  for (const order of orderList) {
    const key = order.traffic_platform || "direct";
    platformMap.set(key, (platformMap.get(key) ?? 0) + 1);
  }
  const trafficByPlatform = Array.from(platformMap.entries())
    .map(([key, count]) => ({
      key,
      label: PLATFORM_LABELS[key] ?? key,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const utmMap = new Map<
    string,
    {
      source: string;
      medium: string;
      campaign: string;
      visits: number;
      orders: number;
      revenue: number;
    }
  >();
  for (const event of eventList) {
    if (event.event_name !== "PageView") continue;
    const source = event.utm_source || "(none)";
    const medium = event.utm_medium || "(none)";
    const campaign = event.utm_campaign || "(none)";
    const key = `${source}|${medium}|${campaign}`;
    const row = utmMap.get(key) ?? {
      source,
      medium,
      campaign,
      visits: 0,
      orders: 0,
      revenue: 0,
    };
    row.visits += 1;
    utmMap.set(key, row);
  }
  for (const order of orderList) {
    const source = order.utm_source || "(none)";
    const medium = order.utm_medium || "(none)";
    const campaign = order.utm_campaign || "(none)";
    const key = `${source}|${medium}|${campaign}`;
    const row = utmMap.get(key) ?? {
      source,
      medium,
      campaign,
      visits: 0,
      orders: 0,
      revenue: 0,
    };
    row.orders += 1;
    row.revenue += Number(order.total_price);
    utmMap.set(key, row);
  }
  const utmPerformance = Array.from(utmMap.values())
    .map((row) => ({
      ...row,
      conversionRate: pct(row.orders, row.visits),
    }))
    .sort((a, b) => b.orders - a.orders || b.visits - a.visits)
    .slice(0, 10);

  const productMap = new Map<string, AnalyticsProductRow>();
  for (const event of eventList) {
    const name = event.product_name || event.product_slug;
    if (!name) continue;
    const slug = event.product_slug || name;
    const row =
      productMap.get(slug) ??
      ({
        slug,
        name,
        views: 0,
        leads: 0,
        purchases: 0,
        revenue: 0,
        conversionRate: 0,
      } satisfies AnalyticsProductRow);

    if (event.event_name === "ViewContent") row.views += 1;
    if (event.event_name === "Lead") row.leads += 1;
    if (event.event_name === "Purchase") row.purchases += 1;
    productMap.set(slug, row);
  }
  for (const order of orderList) {
    const slug = order.product_slug || order.product_name;
    const row =
      productMap.get(slug) ??
      ({
        slug,
        name: order.product_name,
        views: 0,
        leads: 0,
        purchases: 0,
        revenue: 0,
        conversionRate: 0,
      } satisfies AnalyticsProductRow);
    row.purchases += 1;
    row.leads = Math.max(row.leads, row.purchases);
    row.revenue += Number(order.total_price);
    productMap.set(slug, row);
  }

  const products = Array.from(productMap.values())
    .map((row) => ({
      ...row,
      conversionRate: pct(row.purchases, row.views || row.leads || 1),
    }))
    .sort((a, b) => b.revenue - a.revenue || b.purchases - a.purchases);

  const bestSelling = products.length
    ? [...products].sort((a, b) => b.purchases - a.purchases)[0]
    : null;
  const bestConverting =
    products.filter((p) => p.views >= 3).sort((a, b) => b.conversionRate - a.conversionRate)[0] ??
    null;

  const funnel = buildFunnel(
    sessions,
    viewSessions.size || viewContent,
    checkoutSessions.size || initiateCheckout,
    leadSessions.size || leads,
    purchases,
  );

  const pageViewEvents = eventList.filter((e) => e.event_name === "PageView");
  const osBreakdown = countByKey(pageViewEvents, getOsKey, (key) => OS_LABELS[key] ?? key);
  const browserBreakdown = countByKey(
    pageViewEvents,
    getBrowserKey,
    (key) => BROWSER_LABELS[key] ?? key,
  );

  const deviceSessions = new Map<string, Set<string>>();
  const deviceOrders = new Map<string, number>();
  for (const event of pageViewEvents) {
    const device = event.device_type || "unknown";
    if (!event.session_id) continue;
    const set = deviceSessions.get(device) ?? new Set<string>();
    set.add(event.session_id);
    deviceSessions.set(device, set);
  }
  for (const order of orderList) {
    const device = order.device_type || "unknown";
    deviceOrders.set(device, (deviceOrders.get(device) ?? 0) + 1);
  }
  const conversionByDevice = Array.from(
    new Set([...deviceSessions.keys(), ...deviceOrders.keys()]),
  ).map((device) => {
    const sessionCount = deviceSessions.get(device)?.size ?? 0;
    const orderCount = deviceOrders.get(device) ?? 0;
    return {
      key: device,
      label:
        device === "mobile"
          ? "جوال"
          : device === "desktop"
            ? "كمبيوتر"
            : device === "tablet"
              ? "تابلت"
              : device,
      sessions: sessionCount,
      orders: orderCount,
      conversionRate: pct(orderCount, sessionCount),
    };
  });

  const mobileSessions = deviceSessions.get("mobile")?.size ?? 0;
  const desktopSessions = deviceSessions.get("desktop")?.size ?? 0;
  const mobileOrders = deviceOrders.get("mobile") ?? 0;
  const desktopOrders = deviceOrders.get("desktop") ?? 0;
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
  ];

  const eventBreakdown = countByKey(eventList, (event) => event.event_name);

  const platformSignalMap = new Map<string, number>();
  for (const event of eventList) {
    if (!["Lead", "Purchase", "ViewContent"].includes(event.event_name)) continue;
    const platform = event.traffic_platform || "direct";
    platformSignalMap.set(platform, (platformSignalMap.get(platform) ?? 0) + 1);
  }
  const platformSignal = Array.from(platformSignalMap.entries())
    .map(([key, count]) => ({
      key,
      label: PLATFORM_LABELS[key] ?? key,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const dayMap = new Map<
    string,
    { visitors: Set<string>; pageViews: number; orders: number; revenue: number }
  >();
  for (const event of eventList) {
    const date = event.created_at.slice(0, 10);
    const row =
      dayMap.get(date) ??
      ({
        visitors: new Set<string>(),
        pageViews: 0,
        orders: 0,
        revenue: 0,
      } as {
        visitors: Set<string>;
        pageViews: number;
        orders: number;
        revenue: number;
      });
    if (event.event_name === "PageView") {
      row.pageViews += 1;
      if (event.session_id) row.visitors.add(event.session_id);
    }
    dayMap.set(date, row);
  }
  for (const order of orderList) {
    const date = order.created_at.slice(0, 10);
    const row =
      dayMap.get(date) ??
      ({
        visitors: new Set<string>(),
        pageViews: 0,
        orders: 0,
        revenue: 0,
      } as {
        visitors: Set<string>;
        pageViews: number;
        orders: number;
        revenue: number;
      });
    row.orders += 1;
    row.revenue += Number(order.total_price);
    dayMap.set(date, row);
  }
  fillDailySeries(range.start, range.end, dayMap);

  const sortedDays = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const ordersPerDay = sortedDays.map(([date, row]) => ({
    date,
    count: row.orders,
    revenue: row.revenue,
  }));
  const visitorsPerDay = sortedDays.map(([date, row]) => ({
    date,
    visitors: row.visitors.size,
    pageViews: row.pageViews,
  }));

  return {
    range: {
      preset,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      label: range.label,
    },
    traffic: {
      totalVisitors: sessions,
      uniqueVisitors,
      sessions,
      pageViews,
      topLandingPages,
      trafficByPlatform,
      utmPerformance,
    },
    conversion: {
      conversionRate: pct(purchases, sessions),
      productPageConversionRate: pct(viewSessions.size || viewContent, sessions),
      checkoutOpenRate: pct(
        checkoutSessions.size || initiateCheckout,
        viewSessions.size || viewContent || 1,
      ),
      leadSubmitRate: pct(leads, checkoutSessions.size || initiateCheckout || 1),
      purchaseRate: pct(purchases, leads || 1),
      funnel,
      dropOff: buildDropOff(funnel),
    },
    cod: {
      totalOrders,
      pending,
      confirmed,
      shipped,
      delivered,
      cancelled,
      confirmationRate: pct(fulfilled, totalOrders),
      deliveredRate: pct(delivered, totalOrders),
      cancelledRate: pct(cancelled, totalOrders),
      codSuccessRate: pct(delivered, fulfilled || 1),
      totalRevenue,
    },
    products: products.slice(0, 10),
    bestSelling,
    bestConverting,
    devices: {
      mobileVsDesktop,
      osBreakdown,
      browserBreakdown,
      conversionByDevice,
    },
    tracking: {
      eventBreakdown,
      serverEvents,
      storedEvents: eventList.length,
      deduplicatedEventIds: eventIds.size,
      capiStatus: {
        meta: Boolean(trackingConfig.metaPixelId && trackingConfig.metaAccessToken),
        tiktok: Boolean(trackingConfig.tiktokPixelId && trackingConfig.tiktokAccessToken),
        snapchat: Boolean(
          trackingConfig.snapchatPixelId && trackingConfig.snapchatAccessToken,
        ),
      },
      platformSignal,
    },
    charts: {
      ordersPerDay,
      visitorsPerDay,
    },
    recentOrders: orderList.slice(0, 6),
  };
}

export const getAnalyticsDashboard = cache(
  async (preset: DatePreset, customStart?: string, customEnd?: string) =>
    loadAnalyticsDashboardUncached(preset, customStart, customEnd),
);

/** Backward-compatible summary for legacy callers */
export async function getAnalyticsStats(days = 30) {
  const preset: DatePreset = days <= 7 ? "7d" : "30d";
  const data = await getAnalyticsDashboard(preset);
  return {
    totalVisitors: data.traffic.totalVisitors,
    totalPageViews: data.traffic.pageViews,
    totalConversions: data.cod.totalOrders,
    conversionRate: Math.round(data.conversion.conversionRate),
    totalRevenue: data.cod.totalRevenue,
    trafficByPlatform: data.traffic.trafficByPlatform.map((row) => ({
      platform: row.key,
      label: row.label,
      count: row.count,
    })),
    topProducts: data.products.map((p) => ({
      name: p.name,
      views: p.views,
      orders: p.purchases,
    })),
    ordersPerDay: data.charts.ordersPerDay,
    deviceBreakdown: data.devices.conversionByDevice.map((d) => ({
      device: d.key,
      count: d.sessions,
    })),
    eventBreakdown: data.tracking.eventBreakdown.map((e) => ({
      event: e.key,
      count: e.count,
    })),
  };
}
