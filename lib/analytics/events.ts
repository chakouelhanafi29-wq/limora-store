import {
  attributionToTrackingPayload,
  captureAttribution,
  clickIdsFromAttribution,
  getStoredAttribution,
  type Attribution,
} from "./attribution";
import { createTrackingEventId } from "@/lib/tracking/event-id";

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
  /** Shared with server CAPI for deduplication — pass explicitly for Lead/Purchase. */
  event_id?: string;
  /** Hashed server-side when sent to CAPI providers. */
  phone?: string;
  customer_name?: string;
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

function firePixelEvents(
  name: AnalyticsEventName,
  payload: EventPayload,
  eventId: string,
) {
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
        window.fbq("track", "PageView", {}, { eventID: eventId });
      } else {
        window.fbq(
          "track",
          fbEvent,
          {
            content_name: contentName,
            content_ids: payload.product_slug ? [payload.product_slug] : undefined,
            value,
            currency,
          },
          { eventID: eventId },
        );
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
        window.ttq.track(
          ttEvent,
          {
            content_name: contentName,
            content_id: payload.product_slug,
            value,
            currency,
          },
          { event_id: eventId },
        );
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
        uuid_c1: eventId,
        client_dedup_id: eventId,
        item_ids: payload.product_slug ? [payload.product_slug] : undefined,
        price: value,
        currency,
        transaction_id: payload.order_id,
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
          transaction_id: payload.order_id ?? eventId,
        });
      }
    }
  }
}

async function persistAndDispatchServerEvent(
  name: AnalyticsEventName,
  payload: EventPayload,
  attribution: Attribution,
  eventId: string,
) {
  try {
    await fetch("/api/tracking/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_name: name,
        event_id: eventId,
        page_path: payload.page_path ?? window.location.pathname,
        event_source_url: `${window.location.pathname}${window.location.search}`,
        product_name: payload.product_name ?? null,
        product_slug: payload.product_slug ?? null,
        offer_label: payload.offer_label ?? null,
        value: payload.value ?? null,
        currency: payload.currency ?? "SAR",
        order_id: payload.order_id ?? null,
        user: {
          phone: payload.phone ?? null,
          firstName: payload.customer_name ?? null,
        },
        click_ids: clickIdsFromAttribution(attribution),
        attribution: attributionToTrackingPayload(attribution),
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  payload: EventPayload = {},
  options?: { server?: boolean },
) {
  if (typeof window === "undefined") return;

  const attribution = getAttribution();
  const eventId = payload.event_id ?? createTrackingEventId(name.toLowerCase());

  firePixelEvents(name, payload, eventId);
  if (options?.server !== false) {
    void persistAndDispatchServerEvent(name, payload, attribution, eventId);
  }

  return eventId;
}

export function getAttributionForOrder() {
  const attribution = getAttribution();
  return {
    ...attributionToTrackingPayload(attribution),
    click_ids: clickIdsFromAttribution(attribution),
    first_touch_platform: attribution.first_touch_platform,
  };
}

export function createLeadEventId() {
  return createTrackingEventId("lead");
}
