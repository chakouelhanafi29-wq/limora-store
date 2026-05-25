"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/events";

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
  useEffect(() => {
    trackEvent("Purchase", {
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
