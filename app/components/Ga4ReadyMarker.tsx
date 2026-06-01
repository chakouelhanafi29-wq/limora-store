"use client";

import { useEffect } from "react";
import { markTrackingReady } from "@/lib/analytics/tracking-ready";

/** Marks pixel pipeline ready once GA4 gtag stub exists (after init script runs). */
export default function Ga4ReadyMarker() {
  useEffect(() => {
    if (typeof window.gtag === "function") {
      markTrackingReady();
      return;
    }
    const deadline = Date.now() + 8000;
    const timer = window.setInterval(() => {
      if (typeof window.gtag === "function" || Date.now() > deadline) {
        window.clearInterval(timer);
        markTrackingReady();
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
