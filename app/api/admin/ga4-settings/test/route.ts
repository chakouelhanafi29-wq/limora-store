import { NextResponse } from "next/server";
import { getGa4Config, normalizeGa4PropertyId, type Ga4Config } from "@/lib/analytics/ga4/config";
import { testGa4DataApiConnection } from "@/lib/analytics/ga4/fetch-dashboard";
import { isAdminUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { propertyId?: string; serviceAccountJson?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    // empty body = use saved config
  }

  const saved = await getGa4Config();
  const config: Ga4Config = {
    measurementId: saved.measurementId,
    propertyId:
      normalizeGa4PropertyId(body.propertyId) ||
      saved.propertyId,
    serviceAccountJson:
      body.serviceAccountJson?.trim() || saved.serviceAccountJson,
    serviceAccountLoadSource: saved.serviceAccountLoadSource,
  };

  if (!config.propertyId) {
    return NextResponse.json({
      ok: false,
      error: "أدخلي GA4 Property ID واحفظي الإعدادات",
    });
  }

  if (!config.serviceAccountJson) {
    return NextResponse.json({
      ok: false,
      error:
        "Service Account JSON مطلوب: Google Cloud → Service Account → JSON key → أضيفيه في الإعدادات واحفظي (مع دور Viewer على GA4 Property)",
    });
  }

  const result = await testGa4DataApiConnection(config);
  return NextResponse.json(result);
}
