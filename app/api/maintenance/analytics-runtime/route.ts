import { NextResponse } from "next/server";
import { loadAnalyticsDashboardPipelineDebug } from "@/lib/analytics/dashboard-pipeline-debug";

/**
 * Production GA4 runtime probe (requires LIMORA_MAINTENANCE_SECRET on Vercel).
 * GET /api/maintenance/analytics-runtime?preset=30d
 * Header: x-limora-maintenance-secret
 */
export async function GET(request: Request) {
  const secret = process.env.LIMORA_MAINTENANCE_SECRET?.trim();
  const provided = request.headers.get("x-limora-maintenance-secret")?.trim();

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preset = (searchParams.get("preset") ?? "30d") as
    | "today"
    | "yesterday"
    | "7d"
    | "30d"
    | "month"
    | "custom";
  const start = searchParams.get("start") ?? undefined;
  const end = searchParams.get("end") ?? undefined;

  const debug = await loadAnalyticsDashboardPipelineDebug(preset, start, end);
  return NextResponse.json(debug);
}
