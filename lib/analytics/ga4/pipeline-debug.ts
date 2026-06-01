import { resolveDateRange, type DatePreset } from "@/lib/analytics/date-range";
import { loadAnalyticsDashboardPipelineDebug } from "@/lib/analytics/dashboard-pipeline-debug";

export async function getGa4PipelineDebug(
  preset: DatePreset = "7d",
  customStart?: string,
  customEnd?: string,
) {
  return loadAnalyticsDashboardPipelineDebug(preset, customStart, customEnd);
}
