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
      traffic_platform,
      traffic_source,
      device_type,
      utm_source,
      utm_medium,
      utm_campaign,
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
    const orderPayload = {
      p_customer_name: customer_name.trim(),
      p_phone: normalizedPhone,
      p_city: COD_PENDING_CITY,
      p_product_id: product_id || null,
      p_product_name: product_name,
      p_product_slug: product_slug || null,
      p_offer_id: offer_id || null,
      p_offer_label: offer_label,
      p_offer_quantity: offer_quantity || 1,
      p_total_price: total_price,
      p_notes: notes,
    };

    // Preferred: SECURITY DEFINER RPC (works with strict RLS — no public SELECT needed)
    const { data: rpcId, error: rpcError } = await supabase.rpc(
      "create_storefront_order",
      orderPayload,
    );

    if (!rpcError && rpcId) {
      return NextResponse.json({ success: true, id: rpcId });
    }

    // Fallback: insert without RETURNING (anon users cannot SELECT inserted rows)
    const { error: insertError } = await supabase.from("orders").insert({
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
    });

    if (insertError) {
      const detail = rpcError?.message ?? insertError.message;
      return NextResponse.json({ error: detail }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: `order-${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
