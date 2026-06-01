/** Temporary production diagnostics — search Vercel logs for [analytics-runtime] */

const PREFIX = "[analytics-runtime]";

export function logAnalyticsRuntime(
  step: string,
  payload: Record<string, unknown>,
) {
  try {
    console.log(
      `${PREFIX} ${step} ${JSON.stringify(payload)}`,
    );
  } catch {
    console.log(`${PREFIX} ${step} (serialization failed)`);
  }
}

export function serializeGa4OverviewReport(
  response: {
    rowCount?: number | null;
    rows?: Array<{
      metricValues?: Array<{ value?: string | null }> | null;
    }> | null;
    totals?: Array<{
      metricValues?: Array<{ value?: string | null }> | null;
    }> | null;
  } | null
  | undefined,
) {
  if (!response) return null;
  const row0 = response.rows?.[0]?.metricValues?.map((m) => m.value ?? null) ?? null;
  const total0 =
    response.totals?.[0]?.metricValues?.map((m) => m.value ?? null) ?? null;
  return {
    rowCount: response.rowCount ?? null,
    rowsLength: response.rows?.length ?? 0,
    totalsLength: response.totals?.length ?? 0,
    rows0MetricValues: row0,
    totals0MetricValues: total0,
    metricNames: ["sessions", "activeUsers", "totalUsers", "screenPageViews"],
  };
}
