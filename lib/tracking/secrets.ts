import { createServiceRoleClient } from "@/lib/supabase/service";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

export function maskTrackingToken(token: string | null | undefined): string | null {
  if (!token?.trim()) return null;
  const trimmed = token.trim();
  if (trimmed.length <= 4) return "••••";
  return `••••${trimmed.slice(-4)}`;
}

export async function getTrackingSecretsForServer(): Promise<TrackingSecretsRow | null> {
  const service = createServiceRoleClient();
  if (service) {
    const { data } = await service
      .from("tracking_secrets")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return (data as TrackingSecretsRow | null) ?? null;
  }

  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tracking_secrets")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as TrackingSecretsRow | null) ?? null;
}

export async function getTrackingSecretsForAdmin(): Promise<TrackingSecretsRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tracking_secrets")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as TrackingSecretsRow | null) ?? null;
}

export async function upsertTrackingSecretsForAdmin(
  update: TrackingSecretsUpdate,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل" };
  }

  const service = createServiceRoleClient();
  const supabase = service ?? (await createClient());
  const existing = service
    ? ((await service
        .from("tracking_secrets")
        .select("*")
        .eq("id", 1)
        .maybeSingle()).data as TrackingSecretsRow | null)
    : await getTrackingSecretsForAdmin();

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
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase غير مُفعّل" };
  }

  const service = createServiceRoleClient();
  const supabase = service ?? (await createClient());
  const { error } = await supabase
    .from("tracking_secrets")
    .update({ [field]: null, updated_at: new Date().toISOString() })
    .eq("id", 1);
  return { error: error?.message ?? null };
}
