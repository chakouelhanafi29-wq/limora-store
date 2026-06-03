import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/supabase/server";

function isAuthorized(request: Request): boolean {
  const expected = process.env.LIMORA_MAINTENANCE_SECRET?.trim();
  const provided = request.headers.get("x-limora-maintenance-secret")?.trim();
  if (expected && provided && provided === expected) return true;
  return false;
}

/**
 * Temporary: raw process.env.SUPABASE_SERVICE_ROLE_KEY as Node sees it on this deployment.
 * GET /api/maintenance/service-role-env-probe
 * Auth: x-limora-maintenance-secret OR admin session (isAdminUser)
 */
export async function GET(request: Request) {
  const maintenanceOk = isAuthorized(request);
  const adminOk = maintenanceOk ? true : await isAdminUser();
  if (!maintenanceOk && !adminOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    rawFirst20Chars: raw?.slice(0, 20) ?? null,
    charCode0: raw?.charCodeAt(0) ?? null,
    length: raw?.length ?? null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
