import { NextResponse } from "next/server";
import { getGa4PipelineDebug } from "@/lib/analytics/ga4/pipeline-debug";
import { parseDatePreset } from "@/lib/analytics/date-range";
import { isAdminUser } from "@/lib/supabase/server";

function isRuntimeDebugTokenAuthorized(request: Request): boolean {
  const expected = process.env.ANALYTICS_RUNTIME_DEBUG_TOKEN?.trim();
  if (!expected) return false;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  return Boolean(token && token === expected);
}

export async function GET(request: Request) {
  const tokenOk = isRuntimeDebugTokenAuthorized(request);
  if (!tokenOk && !(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preset = parseDatePreset(searchParams.get("preset") ?? "7d");
  const start = searchParams.get("start") ?? undefined;
  const end = searchParams.get("end") ?? undefined;

  const debug = await getGa4PipelineDebug(preset, start, end);
  return NextResponse.json(debug);
}
