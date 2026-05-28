"use client";

import type { TrackingClickIds } from "@/lib/tracking/types";

export function readBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const pattern = new RegExp(
    `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
  );
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

export function buildFbcFromFbclid(fbclid: string | null): string | null {
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export function getUrlClickIds(search = ""): TrackingClickIds {
  const params = new URLSearchParams(search);
  return {
    fbclid: params.get("fbclid"),
    ttclid: params.get("ttclid"),
    gclid: params.get("gclid"),
    sc_click_id: params.get("ScCid") ?? params.get("sc_cid"),
  };
}

export function getBrowserClickIds(search = ""): TrackingClickIds {
  const fromUrl = getUrlClickIds(search);
  const fbp = readBrowserCookie("_fbp");
  let fbc = readBrowserCookie("_fbc");

  if (!fbc && fromUrl.fbclid) {
    fbc = buildFbcFromFbclid(fromUrl.fbclid);
  }

  return {
    fbp,
    fbc,
    fbclid: fromUrl.fbclid,
    ttclid: fromUrl.ttclid,
    gclid: fromUrl.gclid,
    sc_click_id: fromUrl.sc_click_id,
  };
}

export function getTrackingContextFromBrowser(pagePath?: string) {
  if (typeof window === "undefined") return null;

  const search = window.location.search;
  const click_ids = getBrowserClickIds(search);

  return {
    page_path: pagePath ?? window.location.pathname,
    event_source_url: `${window.location.pathname}${search}`,
    click_ids,
  };
}
