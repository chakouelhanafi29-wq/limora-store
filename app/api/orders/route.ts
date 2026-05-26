import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidSaudiPhone, normalizeSaudiPhone } from "@/lib/validation/saudi-phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      city,
      district,
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

    if (!customer_name || !phone || !city || !product_name || !offer_label || !total_price) {
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
    const notes = district?.trim()
      ? `الحي: ${district.trim()}`
      : null;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        fallback: true,
        id: "local-" + Date.now(),
      });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name,
        phone: normalizedPhone,
        city,
        notes,
        product_id: product_id || null,
        product_name,
        product_slug: product_slug || null,
        offer_id: offer_id || null,
        offer_label,
        offer_quantity: offer_quantity || 1,
        total_price,
        status: "pending",
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
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
