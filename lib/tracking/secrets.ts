import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  describeInvalidServiceRoleKey,
  isServiceRoleKeyConfigured,
  isServiceRoleKeyValid,
} from "@/lib/supabase/env";

export type TrackingSecretsRow = {
  id: number;
  meta_capi_access_token: string | null;
  meta_test_event_code: string | null;
  tiktok_events_access_token: string | null;
  tiktok_test_event_code: string | null;
  snapchat_capi_access_token: string | null;
  snapchat_test_event_code: string | null;
  ga4_service_account_json: string | null;
  updated_at: string;
};

export type TrackingSecretsUpdate = {
  meta_capi_access_token?: string | null;
  meta_test_event_code?: string | null;
  tiktok_events_access_token?: string | null;
  tiktok_test_event_code?: string | null;
  snapchat_capi_access_token?: string | null;
  snapchat_test_event_code?: string | null;
  ga4_service_account_json?: string | null;
};

export type Ga4ServiceAccountLoadSource =
  | "service_role_db"
  | "admin_session_db"
  | "env"
  | "none";

const TRACKING_SECRETS_COLUMNS =
  "id, meta_capi_access_token, meta_test_event_code, tiktok_events_access_token, tiktok_test_event_code, snapchat_capi_access_token, snapchat_test_event_code, ga4_service_account_json, updated_at";

let lastGa4LoadSource: Ga4ServiceAccountLoadSource = "none";
let lastServiceRoleReadError: string | null = null;

export function getLastGa4ServiceAccountLoadSource(): Ga4ServiceAccountLoadSource {
  return lastGa4LoadSource;
}

export function getLastServiceRoleReadError(): string | null {
  return lastServiceRoleReadError;
}

export function maskTrackingToken(token: string | null | undefined): string | null {
  if (!token?.trim()) return null;
  const trimmed = token.trim();
  if (trimmed.length <= 4) return "****";
  return `****${trimmed.slice(-4)}`;
}

function pickSecret(
  service: TrackingSecretsRow | null,
  admin: TrackingSecretsRow | null,
  key: keyof TrackingSecretsRow,
): string | null {
  const serviceValue = service?.[key];
  const adminValue = admin?.[key];
  if (typeof serviceValue === "string" && serviceValue.trim()) return serviceValue.trim();
  if (typeof adminValue === "string" && adminValue.trim()) return adminValue.trim();
  return null;
}

function mergeTrackingSecrets(
  service: TrackingSecretsRow | null,
  admin: TrackingSecretsRow | null,
): TrackingSecretsRow | null {
  if (!service && !admin) return null;

  const ga4FromService = service?.ga4_service_account_json?.trim() ?? "";
  const ga4FromAdmin = admin?.ga4_service_account_json?.trim() ?? "";

  if (ga4FromService) {
    lastGa4LoadSource = "service_role_db";
  } else if (ga4FromAdmin) {
    lastGa4LoadSource = "admin_session_db";
  }

  return {
    id: 1,
    meta_capi_access_token: pickSecret(service, admin, "meta_capi_access_token"),
    meta_test_event_code: pickSecret(service, admin, "meta_test_event_code"),
    tiktok_events_access_token: pickSecret(service, admin, "tiktok_events_access_token"),
    tiktok_test_event_code: pickSecret(service, admin, "tiktok_test_event_code"),
    snapchat_capi_access_token: pickSecret(service, admin, "snapchat_capi_access_token"),
    snapchat_test_event_code: pickSecret(service, admin, "snapchat_test_event_code"),
    ga4_service_account_json: ga4FromService || ga4FromAdmin || null,
    updated_at:
      service?.updated_at ??
      admin?.updated_at ??
      new Date().toISOString(),
  };
}

async function readTrackingSecretsViaServiceRole(): Promise<TrackingSecretsRow | null> {
  const invalidKeyMessage = describeInvalidServiceRoleKey();
  if (invalidKeyMessage) {
    lastServiceRoleReadError = invalidKeyMessage;
    return null;
  }

  const service = createServiceRoleClient();
  if (!service) {
    lastServiceRoleReadError = "service role client unavailable";
    return null;
  }

  const { data, error } = await service
    .from("tracking_secrets")
    .select(TRACKING_SECRETS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    lastServiceRoleReadError = error?.message ?? "tracking_secrets row not found via service role";
    return null;
  }

  lastServiceRoleReadError = null;
  return data as TrackingSecretsRow;
}

async function readTrackingSecretsViaAdminSession(
  supabaseClient?: SupabaseClient,
): Promise<TrackingSecretsRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = supabaseClient ?? (await createClient());
  const { data, error } = await supabase
    .from("tracking_secrets")
    .select(TRACKING_SECRETS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as TrackingSecretsRow;
}

/** Server reads: service role + authenticated admin session (merged). */
export async function getTrackingSecretsForServer(): Promise<TrackingSecretsRow | null> {
  lastGa4LoadSource = "none";

  const [serviceRow, adminRow] = await Promise.all([
    readTrackingSecretsViaServiceRole(),
    readTrackingSecretsViaAdminSession(),
  ]);

  return mergeTrackingSecrets(serviceRow, adminRow);
}

/** Admin UI reads (authenticated admin RLS). */
export async function getTrackingSecretsForAdmin(
  supabaseClient?: SupabaseClient,
): Promise<TrackingSecretsRow | null> {
  return readTrackingSecretsViaAdminSession(supabaseClient);
}

export async function upsertTrackingSecretsForAdmin(
  update: TrackingSecretsUpdate,
  supabaseClient?: SupabaseClient,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل" };
  }

  const supabase = supabaseClient ?? (await createClient());
  const existing = await readTrackingSecretsViaAdminSession(supabase);

  const payload: TrackingSecretsUpdate & { updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (update.meta_test_event_code !== undefined) {
    payload.meta_test_event_code = update.meta_test_event_code || null;
  }
  if (update.tiktok_test_event_code !== undefined) {
    payload.tiktok_test_event_code = update.tiktok_test_event_code || null;
  }
  if (update.snapchat_test_event_code !== undefined) {
    payload.snapchat_test_event_code = update.snapchat_test_event_code || null;
  }

  if (update.meta_capi_access_token?.trim()) {
    payload.meta_capi_access_token = update.meta_capi_access_token.trim();
  } else if (existing?.meta_capi_access_token) {
    payload.meta_capi_access_token = existing.meta_capi_access_token;
  }

  if (update.tiktok_events_access_token?.trim()) {
    payload.tiktok_events_access_token = update.tiktok_events_access_token.trim();
  } else if (existing?.tiktok_events_access_token) {
    payload.tiktok_events_access_token = existing.tiktok_events_access_token;
  }

  if (update.snapchat_capi_access_token?.trim()) {
    payload.snapchat_capi_access_token = update.snapchat_capi_access_token.trim();
  } else if (existing?.snapchat_capi_access_token) {
    payload.snapchat_capi_access_token = existing.snapchat_capi_access_token;
  }

  if (update.ga4_service_account_json?.trim()) {
    payload.ga4_service_account_json = update.ga4_service_account_json.trim();
  } else if (existing?.ga4_service_account_json) {
    payload.ga4_service_account_json = existing.ga4_service_account_json;
  }

  if (existing) {
    const { error } = await supabase
      .from("tracking_secrets")
      .update(payload)
      .eq("id", 1);
    return { error: error?.message ?? null };
  }

  const { error } = await supabase.from("tracking_secrets").insert({
    id: 1,
    ...payload,
  });
  return { error: error?.message ?? null };
}

export async function clearTrackingSecretForAdmin(
  field:
    | "meta_capi_access_token"
    | "tiktok_events_access_token"
    | "snapchat_capi_access_token"
    | "ga4_service_account_json",
  supabaseClient?: SupabaseClient,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل" };
  }

  const supabase = supabaseClient ?? (await createClient());
  const { error } = await supabase
    .from("tracking_secrets")
    .update({ [field]: null, updated_at: new Date().toISOString() })
    .eq("id", 1);
  return { error: error?.message ?? null };
}

export async function probeGa4ServiceAccountStorage(): Promise<{
  serviceRoleConfigured: boolean;
  serviceRoleKeyPresent: boolean;
  serviceRoleKeyValid: boolean;
  serviceRoleKeyInvalidReason: string | null;
  serviceRoleReadError: string | null;
  serviceRoleRowFound: boolean;
  serviceRoleHasGa4: boolean;
  adminSessionRowFound: boolean;
  adminSessionHasGa4: boolean;
  envHasGa4: boolean;
}> {
  const [serviceRow, adminRow] = await Promise.all([
    readTrackingSecretsViaServiceRole(),
    readTrackingSecretsViaAdminSession(),
  ]);

  return {
    serviceRoleConfigured: isServiceRoleKeyValid(),
    serviceRoleKeyPresent: isServiceRoleKeyConfigured(),
    serviceRoleKeyValid: isServiceRoleKeyValid(),
    serviceRoleKeyInvalidReason: describeInvalidServiceRoleKey(),
    serviceRoleReadError: getLastServiceRoleReadError(),
    serviceRoleRowFound: Boolean(serviceRow),
    serviceRoleHasGa4: Boolean(serviceRow?.ga4_service_account_json?.trim()),
    adminSessionRowFound: Boolean(adminRow),
    adminSessionHasGa4: Boolean(adminRow?.ga4_service_account_json?.trim()),
    envHasGa4: Boolean(process.env.GA4_SERVICE_ACCOUNT_JSON?.trim()),
  };
}
