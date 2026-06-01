import { NextResponse } from "next/server";
import {
  scanEnvKeysForByteString,
  type ByteStringViolation,
} from "@/lib/http/byte-string";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKeyRaw,
  isServiceRoleKeyValid,
} from "@/lib/supabase/env";

function keyMeta(raw: string, label: string) {
  if (!raw) {
    return { label, present: false, length: 0, char0: null, prefix: "" };
  }
  return {
    label,
    present: true,
    length: raw.length,
    char0: raw.charCodeAt(0),
    prefix: raw.slice(0, 6),
  };
}

/**
 * Production ByteString probe (requires LIMORA_MAINTENANCE_SECRET on Vercel).
 * GET /api/maintenance/ga4-post-probe
 * Header: x-limora-maintenance-secret
 */
export async function GET(request: Request) {
  const secret = process.env.LIMORA_MAINTENANCE_SECRET?.trim();
  const provided = request.headers.get("x-limora-maintenance-secret")?.trim();

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const serviceRaw = getSupabaseServiceRoleKeyRaw();
  const violations: ByteStringViolation[] = scanEnvKeysForByteString();

  return NextResponse.json({
    envKeys: {
      publishable: keyMeta(publishable, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
      anon: keyMeta(anon, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      serviceRole: keyMeta(serviceRaw, "SUPABASE_SERVICE_ROLE_KEY"),
      resolvedAnonKey: keyMeta(getSupabaseAnonKey(), "getSupabaseAnonKey()"),
      serviceRoleKeyValid: isServiceRoleKeyValid(),
    },
    byteStringViolations: violations,
    postSavePath: {
      settingsUpdate: "createClient() admin session only",
      secretsUpsert: "upsertTrackingSecretsForAdmin(..., supabase) — same client, no service role write",
      fetchApiKeyHeader:
        "node_modules/@supabase/supabase-js/src/lib/fetch.ts:47 headers.set('apikey', supabaseKey)",
    },
    deployMarker: "ga4-post-byte-string-guard-v2",
  });
}
