/** Supabase JWT keys (anon / service_role) must be ASCII JWTs for fetch Headers. */
export function isValidSupabaseJwtKey(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  const key = value.trim();
  if (!/^[\x21-\x7E]+$/.test(key)) return false;
  return key.startsWith("eyJ");
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export function getSupabaseServiceRoleKeyRaw() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

/** Returns key only when it is a valid ASCII JWT; invalid env values are ignored. */
export function getSupabaseServiceRoleKey() {
  const key = getSupabaseServiceRoleKeyRaw();
  return isValidSupabaseJwtKey(key) ? key : "";
}

export function describeInvalidServiceRoleKey(): string | null {
  const raw = getSupabaseServiceRoleKeyRaw();
  if (!raw) return null;
  if (isValidSupabaseJwtKey(raw)) return null;
  const code = raw.charCodeAt(0);
  if (code > 255) {
    return `SUPABASE_SERVICE_ROLE_KEY must be the Supabase service_role JWT (starts with eyJ). Current value starts with Unicode U+${code.toString(16).toUpperCase()} ("${raw[0]}"), not a valid API key.`;
  }
  return "SUPABASE_SERVICE_ROLE_KEY must be the Supabase service_role JWT (ASCII, starts with eyJ).";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function isServiceRoleKeyConfigured() {
  return Boolean(getSupabaseServiceRoleKeyRaw());
}

export function isServiceRoleKeyValid() {
  return Boolean(getSupabaseServiceRoleKey());
}
