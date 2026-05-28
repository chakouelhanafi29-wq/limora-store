import { NextResponse } from "next/server";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import { parseDatePreset } from "@/lib/analytics/date-range";
import { isAdminUser } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preset = parseDatePreset(searchParams.get("preset"));
  const start = searchParams.get("start") ?? undefined;
  const end = searchParams.get("end") ?? undefined;

  const data = await getAnalyticsDashboard(preset, start, end);
  return NextResponse.json(data);
}
