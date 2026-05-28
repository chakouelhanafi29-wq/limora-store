import type { DatePreset } from "@/lib/analytics/date-range";
import type { Order } from "@/lib/types/database";

export type AnalyticsCountRow = {
  key: string;
  label: string;
  count: number;
};

export type AnalyticsFunnelStep = {
  step: string;
  label: string;
  count: number;
  rate: number;
};

export type AnalyticsDropOff = {
  from: string;
  to: string;
  fromCount: number;
  toCount: number;
  dropRate: number;
};

export type AnalyticsProductRow = {
  slug: string;
  name: string;
  views: number;
  leads: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
};

export type AnalyticsUtmRow = {
  source: string;
  medium: string;
  campaign: string;
  visits: number;
  orders: number;
  revenue: number;
  conversionRate: number;
};

export type AnalyticsDeviceConversion = {
  key: string;
  label: string;
  sessions: number;
  orders: number;
  conversionRate: number;
};

export type AnalyticsDashboardData = {
  range: {
    preset: DatePreset;
    start: string;
    end: string;
    label: string;
  };
  traffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    sessions: number;
    pageViews: number;
    topLandingPages: AnalyticsCountRow[];
    trafficByPlatform: AnalyticsCountRow[];
    utmPerformance: AnalyticsUtmRow[];
  };
  conversion: {
    conversionRate: number;
    productPageConversionRate: number;
    checkoutOpenRate: number;
    leadSubmitRate: number;
    purchaseRate: number;
    funnel: AnalyticsFunnelStep[];
    dropOff: AnalyticsDropOff[];
  };
  cod: {
    totalOrders: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    confirmationRate: number;
    deliveredRate: number;
    cancelledRate: number;
    codSuccessRate: number;
    totalRevenue: number;
  };
  products: AnalyticsProductRow[];
  bestSelling: AnalyticsProductRow | null;
  bestConverting: AnalyticsProductRow | null;
  devices: {
    mobileVsDesktop: AnalyticsDeviceConversion[];
    osBreakdown: AnalyticsCountRow[];
    browserBreakdown: AnalyticsCountRow[];
    conversionByDevice: AnalyticsDeviceConversion[];
  };
  tracking: {
    eventBreakdown: AnalyticsCountRow[];
    serverEvents: number;
    storedEvents: number;
    deduplicatedEventIds: number;
    capiStatus: {
      meta: boolean;
      tiktok: boolean;
      snapchat: boolean;
    };
    platformSignal: AnalyticsCountRow[];
  };
  charts: {
    ordersPerDay: { date: string; count: number; revenue: number }[];
    visitorsPerDay: { date: string; visitors: number; pageViews: number }[];
  };
  recentOrders: Order[];
};
