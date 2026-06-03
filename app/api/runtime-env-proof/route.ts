import { NextResponse } from "next/server";

/**
 * Temporary runtime proof for SUPABASE_SERVICE_ROLE_KEY vs Vercel dashboard.
 * GET /api/runtime-env-proof
 * Remove after env mismatch is resolved.
 */
export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return NextResponse.json({
    "SUPABASE_SERVICE_ROLE_KEY.length": key.length,
    "SUPABASE_SERVICE_ROLE_KEY.slice(0,20)": key.slice(0, 20),
    VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  });
}
