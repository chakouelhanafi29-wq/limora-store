import { NextResponse } from "next/server";

/**
 * Public deployment metadata only (no secrets, no env values).
 * GET /api/deployment-meta
 */
export async function GET() {
  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return NextResponse.json({
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    vercelProjectId: process.env.VERCEL_PROJECT_ID ?? null,
    serviceRoleKey: {
      length: raw.length,
      charCode0: raw.length ? raw.charCodeAt(0) : null,
      startsWithEyJ: raw.startsWith("eyJ"),
      startsWithArabicPlaceholder: raw.startsWith("ذاك"),
      rawFirst20Chars: raw.slice(0, 20),
    },
  });
}
