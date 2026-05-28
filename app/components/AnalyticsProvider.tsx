"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/analytics/attribution";
import { trackEvent } from "@/lib/analytics/events";
import { whenTrackingReady } from "@/lib/analytics/tracking-ready";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const lastPath = useRef("");

  useEffect(() => {
    const search = searchParams.toString();
    const fullPath = search ? `${pathname}?${search}` : pathname;

    if (!initialized.current) {
      captureAttribution(pathname, search ? `?${search}` : "");
      initialized.current = true;
    }

    if (lastPath.current === fullPath) return;
    lastPath.current = fullPath;

    whenTrackingReady(() => {
      trackEvent("PageView", { page_path: fullPath });
    });
  }, [pathname, searchParams]);

  return null;
}
