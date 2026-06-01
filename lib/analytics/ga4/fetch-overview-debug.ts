import { protos } from "@google-analytics/data";
import type { protos as Protos } from "@google-analytics/data";
import { createGa4DataClient, ga4PropertyPath } from "./client";
import type { Ga4Config } from "./config";
import { formatGa4ReportDate } from "./dates";
import { fetchGa4DashboardSlice } from "./fetch-dashboard";

type IRow = Protos.google.analytics.data.v1beta.IRow;
type IRunReportResponse = Protos.google.analytics.data.v1beta.IRunReportResponse;

function metricValues(row: IRow | undefined) {
  return row?.metricValues?.map((m) => m.value ?? null) ?? null;
}

export async function fetchGa4OverviewRawDebug(
  config: Ga4Config,
  start: Date,
  end: Date,
) {
  const client = createGa4DataClient(config.serviceAccountJson!);
  const property = ga4PropertyPath(config.propertyId!);
  const dateRanges = [
    { startDate: formatGa4ReportDate(start), endDate: formatGa4ReportDate(end) },
  ];

  const overviewReport = await client.runReport({
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
  });

  const response = overviewReport[0];

  return {
    property,
    dateRanges,
    rowCount: response.rowCount ?? null,
    rowsLength: response.rows?.length ?? 0,
    totalsLength: response.totals?.length ?? 0,
    rows0MetricValues: metricValues(response.rows?.[0]),
    totals0MetricValues: metricValues(response.totals?.[0]),
  };
}

export async function buildPipelineRuntimeSnapshot(
  start: Date,
  end: Date,
) {
  const { getGa4Config } = await import("./config");
  const config = await getGa4Config();
  const gaResult = await fetchGa4DashboardSlice(config, start, end);
  const rawOverview = config.serviceAccountJson
    ? await fetchGa4OverviewRawDebug(config, start, end).catch(
        (e: Error) => ({ error: e.message }),
      )
    : { error: "no service account" };

  const overview = gaResult.ok ? gaResult.data.overview : null;
  const computedTotalVisitors = overview
    ? overview.totalUsers || overview.activeUsers
    : null;

  return {
    fetchGa4DashboardSlice: gaResult,
    overview,
    computedTotalVisitorsFromOverview: computedTotalVisitors,
    rawOverview,
  };
}
