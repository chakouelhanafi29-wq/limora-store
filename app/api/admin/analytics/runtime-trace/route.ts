import { NextResponse } from "next/server";
import { captureGa4ConfigRuntimeTrace } from "@/lib/analytics/ga4/runtime-trace";
import { isAdminUser } from "@/lib/supabase/server";

/** Mirrors /admin/analytics SSR config load (same cookies, same getGa4Config chain). */
export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runtimeTrace = await captureGa4ConfigRuntimeTrace("analytics");
  return NextResponse.json({ runtimeTrace });
}
