import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "./env";

export { isSupabaseConfigured };

let client: SupabaseClient | null = null;

export function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
  }

  return client;
}
