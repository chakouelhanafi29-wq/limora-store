import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createLatin1GuardFetch } from "@/lib/http/byte-string";
import {
  describeInvalidServiceRoleKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isServiceRoleKeyValid,
} from "./env";

export function isServiceRoleConfigured() {
  return Boolean(getSupabaseUrl() && isServiceRoleKeyValid());
}

export function getServiceRoleConfigurationError(): string | null {
  return describeInvalidServiceRoleKey();
}

export function createServiceRoleClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) return null;

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: createLatin1GuardFetch(
        fetch,
        key,
        "SUPABASE_SERVICE_ROLE_KEY",
      ),
    },
  });
}
