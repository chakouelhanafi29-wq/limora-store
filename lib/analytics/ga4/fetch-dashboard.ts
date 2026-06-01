import { protos } from "@google-analytics/data";
import type { protos as Protos } from "@google-analytics/data";
import { createGa4DataClient, ga4PropertyPath } from "./client";
import { labelChannel, labelCountry, labelDevice } from "./labels";
import type { Ga4Config } from "./config";
import { isGa4DataApiReady } from "./config";
import { formatGa4ReportDate } from "./dates";
import { normalizeGa4Overview } from "./normalize-overview";
import type { AnalyticsCountRow } from "@/lib/types/analytics-dashboard";
import type { Ga4DashboardSlice, Ga4FetchResult } from "./types";

type IRow = Protos.google.analytics.data.v1beta.IRow;
type IRunReportResponse = Protos.google.analytics.data.v1beta.IRunReportResponse;

/** Dimensionless metric reports return values in `totals`, not `rows`. */
function firstMetricRow(report: IRunReportResponse | null | undefined): IRow | undefined {
  if (!report) return undefined;
  return report.rows?.[0] ?? report.totals?.[0];
}

function metricValue(row: IRow, index: number): number {
  const raw = row.metricValues?.[index]?.value;
  const n = Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function dimensionValue(row: IRow, index: number): string {
  return row.dimensionValues?.[index]?.value?.trim() ?? "";
}

function rowsToCountMap(
  rows: IRow[],
  dimensionIndex: number,
  metricIndex: number,
  labelFn: (key: string) => string,
): AnalyticsCountRow[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = dimensionValue(row, dimensionIndex) || "(not set)";
    map.set(key, (map.get(key) ?? 0) + metricValue(row, metricIndex));
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, label: labelFn(key), count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchGa4DashboardSlice(
  config: Ga4Config,
  start: Date,
  end: Date,
): Promise<Ga4FetchResult> {
  if (!isGa4DataApiReady(config)) {
    return { ok: false, error: "GA4 Data API not configured" };
  }

  try {
    const client = createGa4DataClient(config.serviceAccountJson!);
    const property = ga4PropertyPath(config.propertyId!);
    const dateRanges = [
      { startDate: formatGa4ReportDate(start), endDate: formatGa4ReportDate(end) },
    ];

    const [
      overviewReport,
      dailyReport,
      channelReport,
      deviceReport,
      countryReport,
      pageReport,
      purchaseReport,
    ] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
        ],
        metricAggregations: [
          protos.google.analytics.data.v1beta.MetricAggregation.TOTAL,
        ],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 12,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "countryId" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "purchase" },
          },
        },
      }),
    ]);

    const overviewResponse = overviewReport[0];
    const overviewRow = firstMetricRow(overviewResponse);
    const purchases =
      purchaseReport[0].rows?.reduce(
        (sum, row) => sum + metricValue(row, 0),
        0,
      ) ?? 0;

    const daily = (dailyReport[0].rows ?? []).map((row) => {
      const rawDate = dimensionValue(row, 0);
      const date =
        rawDate.length === 8
          ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
          : rawDate;
      return {
        date,
        sessions: metricValue(row, 0),
        activeUsers: metricValue(row, 1),
        screenPageViews: metricValue(row, 2),
      };
    });

    const trafficSources = rowsToCountMap(
      channelReport[0].rows ?? [],
      0,
      0,
      labelChannel,
    );

    let data: Ga4DashboardSlice = {
      overview: {
        sessions: overviewRow ? metricValue(overviewRow, 0) : 0,
        activeUsers: overviewRow ? metricValue(overviewRow, 1) : 0,
        totalUsers: overviewRow ? metricValue(overviewRow, 2) : 0,
        screenPageViews: overviewRow ? metricValue(overviewRow, 3) : 0,
        purchases,
      },
      daily,
      trafficSources,
      devices: rowsToCountMap(
        deviceReport[0].rows ?? [],
        0,
        0,
        labelDevice,
      ),
      countries: rowsToCountMap(
        countryReport[0].rows ?? [],
        0,
        0,
        labelCountry,
      ),
      topPages: rowsToCountMap(
        pageReport[0].rows ?? [],
        0,
        0,
        (key) => key,
      ),
    };

    data = normalizeGa4Overview(data);

    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "GA4 Data API request failed";
    return { ok: false, error: message };
  }
}

/** Quick connectivity test (last 7 days). */
export async function testGa4DataApiConnection(
  config: Ga4Config,
): Promise<{ ok: boolean; error?: string; sessions?: number }> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const result = await fetchGa4DashboardSlice(config, start, end);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, sessions: result.data.overview.sessions };
}
