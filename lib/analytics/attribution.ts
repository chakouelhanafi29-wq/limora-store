export type TrafficPlatform =
  | "facebook"
  | "tiktok"
  | "snapchat"
  | "google"
  | "organic"
  | "direct";

export type ClickIds = {
  fbclid: string | null;
  gclid: string | null;
  ttclid: string | null;
  sc_click_id: string | null;
  fbp: string | null;
  fbc: string | null;
};

export type Attribution = {
  traffic_source: string;
  traffic_platform: TrafficPlatform;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  device_type: "mobile" | "tablet" | "desktop";
  landing_page: string;
  session_id: string;
  first_touch_platform: TrafficPlatform;
  click_ids: ClickIds;
};

const STORAGE_KEY = "limora_attribution";
const FIRST_TOUCH_KEY = "limora_first_touch";
const SESSION_KEY = "limora_session_id";

const PLATFORM_LABELS: Record<TrafficPlatform, string> = {
  facebook: "Facebook Ads",
  tiktok: "TikTok Ads",
  snapchat: "Snapchat Ads",
  google: "Google Ads",
  organic: "Organic",
  direct: "Direct",
};

export function getPlatformLabel(platform: TrafficPlatform) {
  return PLATFORM_LABELS[platform];
}

function detectDeviceType(): Attribution["device_type"] {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}

function detectPlatform(
  utmSource: string | null,
  utmMedium: string | null,
  referrer: string | null,
  searchParams: URLSearchParams,
): TrafficPlatform {
  const source = (utmSource ?? "").toLowerCase();
  const medium = (utmMedium ?? "").toLowerCase();
  const ref = (referrer ?? "").toLowerCase();

  if (
    source.includes("facebook") ||
    source.includes("fb") ||
    source.includes("meta") ||
    source.includes("instagram") ||
    medium.includes("facebook") ||
    ref.includes("facebook.com") ||
    ref.includes("instagram.com") ||
    searchParams.has("fbclid")
  ) {
    return "facebook";
  }

  if (
    source.includes("tiktok") ||
    medium.includes("tiktok") ||
    ref.includes("tiktok.com") ||
    searchParams.has("ttclid")
  ) {
    return "tiktok";
  }

  if (
    source.includes("snapchat") ||
    source.includes("snap") ||
    medium.includes("snapchat") ||
    ref.includes("snapchat.com") ||
    searchParams.has("ScCid") ||
    searchParams.has("sc_cid")
  ) {
    return "snapchat";
  }

  if (
    source.includes("google") ||
    medium.includes("cpc") ||
    medium.includes("ppc") ||
    searchParams.has("gclid") ||
    ref.includes("google.")
  ) {
    return "google";
  }

  if (
    ref.includes("bing.com") ||
    ref.includes("yahoo.") ||
    ref.includes("duckduckgo.com")
  ) {
    return "organic";
  }

  if (!utmSource && !referrer) return "direct";
  if (referrer && !utmSource) return "organic";
  return "direct";
}

function getSessionId() {
  if (typeof sessionStorage === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const pattern = new RegExp(
    `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
  );
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}

function buildFbc(fbclid: string | null): string | null {
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

function extractClickIds(searchParams: URLSearchParams): ClickIds {
  const fbclid = searchParams.get("fbclid");
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc && fbclid) fbc = buildFbc(fbclid);

  return {
    fbclid,
    gclid: searchParams.get("gclid"),
    ttclid: searchParams.get("ttclid"),
    sc_click_id: searchParams.get("ScCid") ?? searchParams.get("sc_cid"),
    fbp,
    fbc,
  };
}

function hasFreshPaidParams(searchParams: URLSearchParams): boolean {
  return Boolean(
    searchParams.get("utm_source") ||
      searchParams.get("fbclid") ||
      searchParams.get("ttclid") ||
      searchParams.get("gclid") ||
      searchParams.get("ScCid") ||
      searchParams.get("sc_cid"),
  );
}

function refreshClickIds(attribution: Attribution, searchParams: URLSearchParams): Attribution {
  const latest = extractClickIds(searchParams);
  return {
    ...attribution,
    click_ids: {
      ...attribution.click_ids,
      fbp: latest.fbp ?? attribution.click_ids.fbp,
      fbc: latest.fbc ?? attribution.click_ids.fbc,
      fbclid: latest.fbclid ?? attribution.click_ids.fbclid,
      ttclid: latest.ttclid ?? attribution.click_ids.ttclid,
      gclid: latest.gclid ?? attribution.click_ids.gclid,
      sc_click_id: latest.sc_click_id ?? attribution.click_ids.sc_click_id,
    },
  };
}

export function captureAttribution(
  pathname = "/",
  search = "",
): Attribution {
  if (typeof window === "undefined") {
    return {
      traffic_source: "Direct",
      traffic_platform: "direct",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      referrer: null,
      device_type: "desktop",
      landing_page: pathname,
      session_id: "server",
      first_touch_platform: "direct",
      click_ids: {
        fbclid: null,
        gclid: null,
        ttclid: null,
        sc_click_id: null,
        fbp: null,
        fbc: null,
      },
    };
  }

  const params = new URLSearchParams(search);
  const existing = getStoredAttribution();

  if (existing && !hasFreshPaidParams(params)) {
    return refreshClickIds(existing, params);
  }

  const utm_source = params.get("utm_source");
  const utm_medium = params.get("utm_medium");
  const utm_campaign = params.get("utm_campaign");
  const utm_content = params.get("utm_content");
  const utm_term = params.get("utm_term");
  const referrer = document.referrer || null;
  const platform = detectPlatform(utm_source, utm_medium, referrer, params);
  const click_ids = extractClickIds(params);

  let first_touch_platform = platform;
  const storedFirstTouch = sessionStorage.getItem(FIRST_TOUCH_KEY);
  if (storedFirstTouch) {
    try {
      first_touch_platform = JSON.parse(storedFirstTouch) as TrafficPlatform;
    } catch {
      sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(platform));
    }
  } else {
    sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(platform));
  }

  const attribution: Attribution = {
    traffic_source: getPlatformLabel(platform),
    traffic_platform: platform,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer,
    device_type: detectDeviceType(),
    landing_page: pathname + search,
    session_id: getSessionId(),
    first_touch_platform,
    click_ids,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getStoredAttribution(): Attribution | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed.click_ids) {
      parsed.click_ids = {
        fbclid: null,
        gclid: null,
        ttclid: null,
        sc_click_id: null,
        fbp: null,
        fbc: null,
      };
    }
    return parsed;
  } catch {
    return null;
  }
}

export function attributionToTrackingPayload(attribution: Attribution) {
  return {
    traffic_source: attribution.traffic_source,
    traffic_platform: attribution.traffic_platform,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    referrer: attribution.referrer,
    device_type: attribution.device_type,
    landing_page: attribution.landing_page,
    session_id: attribution.session_id,
  };
}

export function clickIdsFromAttribution(attribution: Attribution) {
  return { ...attribution.click_ids };
}
