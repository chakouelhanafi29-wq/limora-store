import { NextResponse } from "next/server";
import {
  dispatchServerTrackingEventNonBlocking,
  getServerRequestContext,
} from "@/lib/tracking";
import { persistTrackingEvent } from "@/lib/tracking/persist";
import type { ServerTrackingPayload, TrackingEventName } from "@/lib/tracking/types";

const ALLOWED_EVENTS: TrackingEventName[] = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Lead",
  "Purchase",
];

function isTrackingEventName(value: string): value is TrackingEventName {
  return ALLOWED_EVENTS.includes(value as TrackingEventName);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ServerTrackingPayload>;

    if (!body.event_name || !isTrackingEventName(body.event_name)) {
      return NextResponse.json({ error: "Invalid event_name" }, { status: 400 });
    }

    if (!body.event_id?.trim()) {
      return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
    }

    const payload: ServerTrackingPayload = {
      event_name: body.event_name,
      event_id: body.event_id.trim(),
      event_time: body.event_time ?? Math.floor(Date.now() / 1000),
      event_source_url: body.event_source_url ?? null,
      page_path: body.page_path ?? null,
      product_name: body.product_name ?? null,
      product_slug: body.product_slug ?? null,
      offer_label: body.offer_label ?? null,
      value: body.value ?? null,
      currency: body.currency ?? "SAR",
      order_id: body.order_id ?? null,
      user: body.user ?? undefined,
      click_ids: body.click_ids ?? undefined,
      attribution: body.attribution ?? undefined,
    };

    const requestContext = getServerRequestContext(request);

    await persistTrackingEvent(payload);
    dispatchServerTrackingEventNonBlocking(payload, requestContext);

    return NextResponse.json({
      success: true,
      event_id: payload.event_id,
      server_side: true,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
