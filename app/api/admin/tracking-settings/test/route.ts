import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/supabase/server";
import {
  sendTrackingTestEvent,
  type TrackingProviderName,
} from "@/lib/tracking/test-connection";

function isProvider(value: string): value is TrackingProviderName {
  return value === "meta" || value === "tiktok" || value === "snapchat";
}

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { provider?: string };
  if (!body.provider || !isProvider(body.provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const result = await sendTrackingTestEvent(body.provider);

  return NextResponse.json({
    provider: body.provider,
    ok: result.ok,
    status: result.status,
    error: result.error ?? null,
    ready: result.ready,
  });
}
