"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { resolvePurchaseEventId } from "@/lib/tracking/event-id";

type Props = {
  product: string;
  offer: string;
  price: number;
  orderId?: string;
};

export default function ThankYouTracker({
  product,
  offer,
  price,
  orderId,
}: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const purchaseEventId = resolvePurchaseEventId(orderId);

    trackEvent("Purchase", {
      event_id: purchaseEventId,
      product_name: product,
      offer_label: offer,
      value: price,
      currency: "SAR",
      order_id: orderId,
      page_path: "/thank-you",
    });
  }, [product, offer, price, orderId]);

  return null;
}
