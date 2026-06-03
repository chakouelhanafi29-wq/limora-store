import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  createLatin1GuardFetch,
  findCookieByteStringViolation,
  type ByteStringViolation,
} from "@/lib/http/byte-string";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./env";

export { isSupabaseConfigured };

function isLatin1CookieString(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) return false;
  }
  return true;
}

export type CreateClientOptions = {
  onByteStringViolation?: (violation: ByteStringViolation) => void;
};

export async function createClient(
  options: CreateClientOptions = {},
): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();
  const guardedFetch = createLatin1GuardFetch(
    fetch,
    supabaseKey,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY|NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  return createServerClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: async (input, init) => {
        try {
          return await guardedFetch(input, init);
        } catch (error) {
          const diagnostic = (error as { byteStringDiagnostic?: ByteStringViolation })
            .byteStringDiagnostic;
          if (diagnostic) {
            options.onByteStringViolation?.(diagnostic);
          }
          throw error;
        }
      },
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        const violation = findCookieByteStringViolation(
          cookiesToSet.map(({ name, value }) => ({ name, value })),
        );
        if (violation) {
          options.onByteStringViolation?.(violation);
          return;
        }

        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
            if (!isLatin1CookieString(name) || !isLatin1CookieString(value)) {
              return;
            }
            cookieStore.set(name, value, cookieOptions);
          });
        } catch {
          // Server Component — ignore
        }
      },
    },
  });
}

export async function createAdminClient(options: CreateClientOptions = {}) {
  return createClient(options);
}

export async function isAdminWithClient(supabase: SupabaseClient): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single();

  return Boolean(data);
}

export async function isAdminUser() {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createClient();
  return isAdminWithClient(supabase);
}
