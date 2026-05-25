export type TrafficPlatform =
  | "facebook"
  | "tiktok"
  | "snapchat"
  | "google"
  | "organic"
  | "direct";

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
};

const STORAGE_KEY = "limora_attribution";
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
    ref.includes("instagram.com")
  ) {
    return "facebook";
  }

  if (
    source.includes("tiktok") ||
    medium.includes("tiktok") ||
    ref.includes("tiktok.com")
  ) {
    return "tiktok";
  }

  if (
    source.includes("snapchat") ||
    source.includes("snap") ||
    medium.includes("snapchat") ||
    ref.includes("snapchat.com")
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
    };
  }

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  const params = new URLSearchParams(search);
  const utm_source = params.get("utm_source");
  const utm_medium = params.get("utm_medium");
  const utm_campaign = params.get("utm_campaign");
  const utm_content = params.get("utm_content");
  const utm_term = params.get("utm_term");
  const referrer = document.referrer || null;
  const platform = detectPlatform(utm_source, utm_medium, referrer, params);

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
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getStoredAttribution(): Attribution | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}
