import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidSaudiPhone, normalizeSaudiPhone } from "@/lib/validation/saudi-phone";

/** City is required in DB; collected on confirmation call for COD. */
const COD_PENDING_CITY = "يتم التأكيد هاتفياً";

function buildAttributionNotes(fields: {
  traffic_platform?: string | null;
  traffic_source?: string | null;
  device_type?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  landing_page?: string | null;
  session_id?: string | null;
}): string | null {
  const parts: string[] = [];
  if (fields.traffic_platform) parts.push(`platform:${fields.traffic_platform}`);
  if (fields.traffic_source) parts.push(`source:${fields.traffic_source}`);
  if (fields.device_type) parts.push(`device:${fields.device_type}`);
  if (fields.utm_source) parts.push(`utm:${fields.utm_source}/${fields.utm_medium ?? ""}`);
  if (fields.utm_campaign) parts.push(`campaign:${fields.utm_campaign}`);
  if (fields.landing_page) parts.push(`landing:${fields.landing_page}`);
  if (fields.session_id) parts.push(`session:${fields.session_id.slice(0, 12)}`);
  return parts.length ? `[attribution] ${parts.join(" · ")}` : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      product_id,
      product_name,
      product_slug,
      offer_id,
      offer_label,
      offer_quantity,
      total_price,
      traffic_source,
      traffic_platform,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      device_type,
      landing_page,
      session_id,
    } = body;

    if (!customer_name?.trim() || !phone || !product_name || !offer_label || !total_price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!isValidSaudiPhone(phone)) {
      return NextResponse.json(
        { error: "رقم الجوال غير صحيح — استخدمي 05XXXXXXXX" },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizeSaudiPhone(phone)!;
    const notes = buildAttributionNotes({
      traffic_platform,
      traffic_source,
      device_type,
      utm_source,
      utm_medium,
      utm_campaign,
      landing_page,
      session_id,
    });

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        fallback: true,
        id: "local-" + Date.now(),
      });
    }

    const supabase = await createClient();

    // Core columns only — avoids failures when analytics columns are not migrated yet.
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customer_name.trim(),
        phone: normalizedPhone,
        city: COD_PENDING_CITY,
        product_id: product_id || null,
        product_name,
        product_slug: product_slug || null,
        offer_id: offer_id || null,
        offer_label,
        offer_quantity: offer_quantity || 1,
        total_price,
        status: "pending",
        notes,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Best-effort analytics update when optional columns exist (ignored if migration not run).
    void supabase
      .from("orders")
      .update({
        traffic_source: traffic_source || null,
        traffic_platform: traffic_platform || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        referrer: referrer || null,
        device_type: device_type || null,
        landing_page: landing_page || null,
        session_id: session_id || null,
      })
      .eq("id", data.id);

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
