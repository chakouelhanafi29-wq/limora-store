import type { TrackingEventName } from "./types";

const META_EVENT_MAP: Record<TrackingEventName, string> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Lead: "Lead",
  Purchase: "Purchase",
};

export function mapMetaEventName(name: TrackingEventName): string {
  return META_EVENT_MAP[name];
}

export function mapTikTokEventName(name: TrackingEventName): string {
  const map: Record<TrackingEventName, string> = {
    PageView: "Pageview",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Lead: "SubmitForm",
    Purchase: "CompletePayment",
  };
  return map[name];
}

export function mapSnapchatEventName(name: TrackingEventName): string {
  const map: Record<TrackingEventName, string> = {
    PageView: "PAGE_VIEW",
    ViewContent: "VIEW_CONTENT",
    AddToCart: "ADD_CART",
    InitiateCheckout: "START_CHECKOUT",
    Lead: "SIGN_UP",
    Purchase: "PURCHASE",
  };
  return map[name];
}
