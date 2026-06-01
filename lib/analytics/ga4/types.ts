import type { AnalyticsCountRow } from "@/lib/types/analytics-dashboard";

export type Ga4Overview = {
  sessions: number;
  activeUsers: number;
  totalUsers: number;
  screenPageViews: number;
  purchases: number;
};

export type Ga4DailyRow = {
  date: string;
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
};

export type Ga4DashboardSlice = {
  overview: Ga4Overview;
  daily: Ga4DailyRow[];
  trafficSources: AnalyticsCountRow[];
  devices: AnalyticsCountRow[];
  countries: AnalyticsCountRow[];
  topPages: AnalyticsCountRow[];
};

export type Ga4FetchResult =
  | { ok: true; data: Ga4DashboardSlice }
  | { ok: false; error: string };
