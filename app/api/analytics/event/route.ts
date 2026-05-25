import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.event_name) {
      return NextResponse.json({ error: "Missing event_name" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, fallback: true });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: body.event_name,
      page_path: body.page_path ?? null,
      product_name: body.product_name ?? null,
      product_slug: body.product_slug ?? null,
      offer_label: body.offer_label ?? null,
      value: body.value ?? null,
      currency: body.currency ?? "SAR",
      order_id: body.order_id ?? null,
      traffic_source: body.traffic_source ?? null,
      traffic_platform: body.traffic_platform ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_content: body.utm_content ?? null,
      utm_term: body.utm_term ?? null,
      referrer: body.referrer ?? null,
      device_type: body.device_type ?? null,
      session_id: body.session_id ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
