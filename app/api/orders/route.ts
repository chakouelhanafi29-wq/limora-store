import { NextResponse } from "next/server";
import {
  dispatchServerTrackingEventNonBlocking,
  getServerRequestContext,
} from "@/lib/tracking";
import { createTrackingEventId } from "@/lib/tracking/event-id";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { isValidSaudiPhone, normalizeSaudiPhone } from "@/lib/validation/saudi-phone";
import type { ServerTrackingPayload } from "@/lib/tracking/types";

/** City fallback when not collected in older clients. */
const COD_PENDING_CITY = "يتم التأكيد هاتفياً";

function buildAttributionNotes(fields: Record<string, string | null | undefined>) {
  const parts: string[] = [];
  if (fields.traffic_platform) parts.push(`platform:${fields.traffic_platform}`);
  if (fields.traffic_source) parts.push(`source:${fields.traffic_source}`);
  if (fields.device_type) parts.push(`device:${fields.device_type}`);
  if (fields.utm_source) {
    parts.push(`utm:${fields.utm_source}/${fields.utm_medium ?? ""}`);
  }
  if (fields.utm_campaign) parts.push(`campaign:${fields.utm_campaign}`);
  if (fields.landing_page) parts.push(`landing:${fields.landing_page}`);
  if (fields.session_id) parts.push(`session:${fields.session_id.slice(0, 12)}`);
  if (fields.event_id) parts.push(`event:${fields.event_id.slice(0, 12)}`);
  return parts.length ? `[attribution] ${parts.join(" · ")}` : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      city,
      product_id,
      product_name,
      product_slug,
      offer_id,
      offer_label,
      offer_quantity,
      total_price,
      event_id,
      click_ids,
      traffic_platform,
      traffic_source,
      device_type,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
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
    const orderCity =
      typeof city === "string" && city.trim() ? city.trim() : COD_PENDING_CITY;
    const leadEventId =
      typeof event_id === "string" && event_id.trim()
        ? event_id.trim()
        : createTrackingEventId("lead");

    const notes = buildAttributionNotes({
      traffic_platform,
      traffic_source,
      device_type,
      utm_source,
      utm_medium,
      utm_campaign,
      landing_page,
      session_id,
      event_id: leadEventId,
    });

    const attributionColumns = {
      traffic_source: traffic_source ?? null,
      traffic_platform: traffic_platform ?? null,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      utm_content: utm_content ?? null,
      utm_term: utm_term ?? null,
      referrer: referrer ?? null,
      device_type: device_type ?? null,
      landing_page: landing_page ?? null,
      session_id: session_id ?? null,
    };

    const requestContext = getServerRequestContext(request);
    const trackingPayload: ServerTrackingPayload = {
      event_name: "Lead",
      event_id: leadEventId,
      page_path: product_slug ? `/product/${product_slug}` : null,
      product_name,
      product_slug: product_slug ?? null,
      offer_label,
      value: Number(total_price),
      currency: "SAR",
      user: {
        phone: normalizedPhone,
        firstName: String(customer_name).trim(),
      },
      click_ids: click_ids ?? undefined,
      attribution: attributionColumns,
    };

    if (!isSupabaseConfigured()) {
      dispatchServerTrackingEventNonBlocking(trackingPayload, requestContext);
      return NextResponse.json({
        success: true,
        fallback: true,
        id: "local-" + Date.now(),
        event_id: leadEventId,
      });
    }

    const supabase = await createClient();
    const orderPayload = {
      p_customer_name: customer_name.trim(),
      p_phone: normalizedPhone,
      p_city: orderCity,
      p_product_id: product_id || null,
      p_product_name: product_name,
      p_product_slug: product_slug || null,
      p_offer_id: offer_id || null,
      p_offer_label: offer_label,
      p_offer_quantity: offer_quantity || 1,
      p_total_price: total_price,
      p_notes: notes,
    };

    const { data: rpcId, error: rpcError } = await supabase.rpc(
      "create_storefront_order",
      orderPayload,
    );

    let orderId: string | null = rpcId ? String(rpcId) : null;

    if (rpcError || !rpcId) {
      const { error: insertError } = await supabase.from("orders").insert({
        customer_name: customer_name.trim(),
        phone: normalizedPhone,
        city: orderCity,
        product_id: product_id || null,
        product_name,
        product_slug: product_slug || null,
        offer_id: offer_id || null,
        offer_label,
        offer_quantity: offer_quantity || 1,
        total_price,
        status: "pending",
        notes,
        ...attributionColumns,
      });

      if (insertError) {
        const detail = rpcError?.message ?? insertError.message;
        return NextResponse.json({ error: detail }, { status: 500 });
      }

      orderId = `order-${Date.now()}`;
    }

    trackingPayload.order_id = orderId;
    dispatchServerTrackingEventNonBlocking(trackingPayload, requestContext);

    return NextResponse.json({
      success: true,
      id: orderId,
      event_id: leadEventId,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
