import {
  captureAttribution,
  getStoredAttribution,
  type Attribution,
} from "./attribution";

export type AnalyticsEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead";

export type EventPayload = {
  page_path?: string;
  product_name?: string;
  product_slug?: string;
  offer_label?: string;
  value?: number;
  currency?: string;
  order_id?: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (...args: unknown[]) => void;
      page: () => void;
    };
    snaptr?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function getAttribution(): Attribution {
  return (
    getStoredAttribution() ??
    captureAttribution(
      typeof window !== "undefined" ? window.location.pathname : "/",
      typeof window !== "undefined" ? window.location.search : "",
    )
  );
}

function firePixelEvents(name: AnalyticsEventName, payload: EventPayload) {
  if (typeof window === "undefined") return;

  const value = payload.value ?? 0;
  const currency = payload.currency ?? "SAR";
  const contentName = payload.product_name ?? payload.offer_label ?? "LIMORA";

  if (window.fbq) {
    const fbMap: Partial<Record<AnalyticsEventName, string>> = {
      PageView: "PageView",
      ViewContent: "ViewContent",
      AddToCart: "AddToCart",
      InitiateCheckout: "InitiateCheckout",
      Purchase: "Purchase",
      Lead: "Lead",
    };
    const fbEvent = fbMap[name];
    if (fbEvent) {
      if (name === "PageView") {
        window.fbq("track", "PageView");
      } else {
        window.fbq("track", fbEvent, {
          content_name: contentName,
          content_ids: payload.product_slug ? [payload.product_slug] : undefined,
          value,
          currency,
        });
      }
    }
  }

  if (window.ttq) {
    const ttMap: Partial<Record<AnalyticsEventName, string>> = {
      PageView: "Pageview",
      ViewContent: "ViewContent",
      AddToCart: "AddToCart",
      InitiateCheckout: "InitiateCheckout",
      Purchase: "CompletePayment",
      Lead: "SubmitForm",
    };
    const ttEvent = ttMap[name];
    if (ttEvent) {
      if (name === "PageView") {
        window.ttq.page();
      } else {
        window.ttq.track(ttEvent, {
          content_name: contentName,
          content_id: payload.product_slug,
          value,
          currency,
        });
      }
    }
  }

  if (window.snaptr) {
    const snapMap: Partial<Record<AnalyticsEventName, string>> = {
      PageView: "PAGE_VIEW",
      ViewContent: "VIEW_CONTENT",
      AddToCart: "ADD_CART",
      InitiateCheckout: "START_CHECKOUT",
      Purchase: "PURCHASE",
      Lead: "SIGN_UP",
    };
    const snapEvent = snapMap[name];
    if (snapEvent) {
      window.snaptr("track", snapEvent, {
        item_ids: payload.product_slug ? [payload.product_slug] : undefined,
        price: value,
        currency,
      });
    }
  }

  if (window.gtag) {
    if (name === "PageView") {
      window.gtag("event", "page_view", {
        page_path: payload.page_path ?? window.location.pathname,
      });
    } else {
      const gaMap: Partial<Record<AnalyticsEventName, string>> = {
        ViewContent: "view_item",
        AddToCart: "add_to_cart",
        InitiateCheckout: "begin_checkout",
        Purchase: "purchase",
        Lead: "generate_lead",
      };
      const gaEvent = gaMap[name];
      if (gaEvent) {
        window.gtag("event", gaEvent, {
          currency,
          value,
          items: payload.product_name
            ? [{ item_name: payload.product_name, price: value }]
            : undefined,
          transaction_id: payload.order_id,
        });
      }
    }
  }
}

async function persistEvent(
  name: AnalyticsEventName,
  payload: EventPayload,
  attribution: Attribution,
) {
  try {
    await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: name,
        page_path: payload.page_path ?? window.location.pathname,
        product_name: payload.product_name ?? null,
        product_slug: payload.product_slug ?? null,
        offer_label: payload.offer_label ?? null,
        value: payload.value ?? null,
        currency: payload.currency ?? "SAR",
        order_id: payload.order_id ?? null,
        traffic_source: attribution.traffic_source,
        traffic_platform: attribution.traffic_platform,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_content: attribution.utm_content,
        utm_term: attribution.utm_term,
        referrer: attribution.referrer,
        device_type: attribution.device_type,
        session_id: attribution.session_id,
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}

export function trackEvent(name: AnalyticsEventName, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();
  firePixelEvents(name, payload);
  void persistEvent(name, payload, attribution);
}

export function getAttributionForOrder() {
  const attribution = getAttribution();
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
