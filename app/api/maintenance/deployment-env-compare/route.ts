import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/supabase/server";

function isMaintenanceAuthorized(request: Request): boolean {
  const expected = process.env.LIMORA_MAINTENANCE_SECRET?.trim();
  const provided = request.headers.get("x-limora-maintenance-secret")?.trim();
  return Boolean(expected && provided && provided === expected);
}

/**
 * Compare what this serverless invocation sees vs Vercel system env (no JWT body).
 * GET /api/maintenance/deployment-env-compare
 */
export async function GET(request: Request) {
  const maintenance = isMaintenanceAuthorized(request);
  const adminOk = maintenance ? true : await isAdminUser();
  if (!maintenance && !adminOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const first = raw.charAt(0);

  return NextResponse.json({
    thisInvocation: {
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      vercelUrl: process.env.VERCEL_URL ?? null,
      vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      vercelProjectId: process.env.VERCEL_PROJECT_ID ?? null,
    },
    serviceRoleKeyOnThisDeployment: {
      length: raw.length,
      charCode0: raw.length ? raw.charCodeAt(0) : null,
      firstChar: raw.length ? first : null,
      startsWithEyJ: raw.startsWith("eyJ"),
      startsWithArabicPlaceholder: raw.startsWith("ذاك"),
      rawFirst20Chars: raw.slice(0, 20),
    },
    compareInVercelDashboard: {
      step1: "Deployments → Production → open active deployment → copy deployment ID (dpl_…)",
      step2: "Compare to thisInvocation.deploymentId above — must match if same deployment",
      step3:
        "Settings → Environment Variables → Production → SUPABASE_SERVICE_ROLE_KEY (project)",
      step4:
        "Team Settings → Environment Variables → search same key (shared; project wins on NEW deploys)",
      step5:
        "If UI shows eyJ but startsWithArabicPlaceholder is true, redeploy Production after saving env",
    },
  });
}
