import { NextResponse } from "next/server";
import { getSettings } from "@/lib/supabase/queries";
import { createClient, isAdminUser, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getTrackingSecretsForAdmin,
  maskTrackingToken,
  upsertTrackingSecretsForAdmin,
} from "@/lib/tracking/secrets";
import { validatePixelId } from "@/lib/tracking/test-connection";

function providerStatus(
  pixelId: string | null | undefined,
  token: string | null | undefined,
) {
  const hasPixel = Boolean(pixelId?.trim());
  const hasToken = Boolean(token?.trim());
  return {
    pixelConfigured: hasPixel,
    tokenConfigured: hasToken,
    capiConfigured: hasPixel && hasToken,
    tokenPreview: maskTrackingToken(token),
  };
}

export async function GET() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [settings, secrets] = await Promise.all([
    getSettings(),
    getTrackingSecretsForAdmin(),
  ]);

  return NextResponse.json({
    pixels: {
      facebook_pixel_id: settings?.facebook_pixel_id ?? "",
      tiktok_pixel_id: settings?.tiktok_pixel_id ?? "",
      snapchat_pixel_id: settings?.snapchat_pixel_id ?? "",
    },
    testEventCodes: {
      meta: secrets?.meta_test_event_code ?? "",
      tiktok: secrets?.tiktok_test_event_code ?? "",
      snapchat: secrets?.snapchat_test_event_code ?? "",
    },
    status: {
      meta: providerStatus(
        settings?.facebook_pixel_id,
        secrets?.meta_capi_access_token,
      ),
      tiktok: providerStatus(
        settings?.tiktok_pixel_id,
        secrets?.tiktok_events_access_token,
      ),
      snapchat: providerStatus(
        settings?.snapchat_pixel_id,
        secrets?.snapchat_capi_access_token,
      ),
    },
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  });
}

type TrackingSettingsBody = {
  facebook_pixel_id?: string;
  tiktok_pixel_id?: string;
  snapchat_pixel_id?: string;
  meta_capi_access_token?: string;
  meta_test_event_code?: string;
  tiktok_events_access_token?: string;
  tiktok_test_event_code?: string;
  snapchat_capi_access_token?: string;
  snapchat_test_event_code?: string;
  clear_meta_token?: boolean;
  clear_tiktok_token?: boolean;
  clear_snapchat_token?: boolean;
};

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase غير مُفعّل" }, { status: 503 });
  }

  const body = (await request.json()) as TrackingSettingsBody;

  const pixelUpdates = {
    facebook_pixel_id: body.facebook_pixel_id?.trim() || null,
    tiktok_pixel_id: body.tiktok_pixel_id?.trim() || null,
    snapchat_pixel_id: body.snapchat_pixel_id?.trim() || null,
  };

  const validationErrors: string[] = [];
  if (pixelUpdates.facebook_pixel_id) {
    const error = validatePixelId("meta", pixelUpdates.facebook_pixel_id);
    if (error) validationErrors.push(error);
  }
  if (pixelUpdates.tiktok_pixel_id) {
    const error = validatePixelId("tiktok", pixelUpdates.tiktok_pixel_id);
    if (error) validationErrors.push(error);
  }
  if (pixelUpdates.snapchat_pixel_id) {
    const error = validatePixelId("snapchat", pixelUpdates.snapchat_pixel_id);
    if (error) validationErrors.push(error);
  }

  if (validationErrors.length) {
    return NextResponse.json({ error: validationErrors.join(" · ") }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: settingsError } = await supabase
    .from("settings")
    .update(pixelUpdates)
    .eq("id", 1);

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  if (body.clear_meta_token) {
    const { clearTrackingSecretForAdmin } = await import("@/lib/tracking/secrets");
    const { error } = await clearTrackingSecretForAdmin("meta_capi_access_token");
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  if (body.clear_tiktok_token) {
    const { clearTrackingSecretForAdmin } = await import("@/lib/tracking/secrets");
    const { error } = await clearTrackingSecretForAdmin("tiktok_events_access_token");
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  if (body.clear_snapchat_token) {
    const { clearTrackingSecretForAdmin } = await import("@/lib/tracking/secrets");
    const { error } = await clearTrackingSecretForAdmin("snapchat_capi_access_token");
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  const { error: secretsError } = await upsertTrackingSecretsForAdmin({
    meta_capi_access_token: body.meta_capi_access_token,
    meta_test_event_code: body.meta_test_event_code,
    tiktok_events_access_token: body.tiktok_events_access_token,
    tiktok_test_event_code: body.tiktok_test_event_code,
    snapchat_capi_access_token: body.snapchat_capi_access_token,
    snapchat_test_event_code: body.snapchat_test_event_code,
  });

  if (secretsError) {
    return NextResponse.json({ error: secretsError }, { status: 500 });
  }

  return GET();
}
