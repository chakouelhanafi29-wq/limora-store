"use client";

import { useEffect, useRef, useState } from "react";
import type { Offer } from "../../lib/product-data";
import OfferSelection from "./OfferSelection";

type Props = {
  selectedOffer: Offer;
  onSelectOffer: (offer: Offer) => void;
  onOrder: () => void;
  onPurchaseVisibilityChange: (visible: boolean) => void;
  offers: Offer[];
  ctaLabel: string;
  codTrust: string[];
  buttonStyle?: "rounded-full" | "rounded-xl";
  ctaSize?: "sm" | "md" | "lg";
};

function CompactTrustBadges({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1 text-[11px] text-muted"
        >
          <span className="text-[10px] text-champagne">✓</span>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function PurchaseZone({
  selectedOffer,
  onSelectOffer,
  onOrder,
  onPurchaseVisibilityChange,
  offers,
  ctaLabel,
  codTrust,
  buttonStyle = "rounded-full",
  ctaSize = "md",
}: Props) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const sizeClass =
    ctaSize === "sm"
      ? "py-3 text-sm"
      : ctaSize === "lg"
        ? "py-5 text-lg"
        : "py-4 text-base";

  useEffect(() => {
    const node = zoneRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onPurchaseVisibilityChange(visible);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onPurchaseVisibilityChange]);

  return (
    <div ref={zoneRef} id="purchase-zone" className="mt-10">
      <OfferSelection
        selected={selectedOffer}
        onSelect={onSelectOffer}
        offers={offers}
      />

      <div className="mt-8 hidden md:block">
        <button
          type="button"
          onClick={onOrder}
          className={`group relative w-full overflow-hidden ${buttonStyle} bg-foreground ${sizeClass} font-medium text-ivory transition hover:shadow-xl`}
        >
          <span className="relative z-10">{ctaLabel}</span>
          <span className="relative z-10 mr-2 text-champagne-light">
            — {selectedOffer.price} ر.س
          </span>
          <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
        </button>
        <CompactTrustBadges items={codTrust} />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-champagne/10 bg-ivory/95 px-4 py-3 backdrop-blur-xl transition-all duration-500 ease-out md:hidden ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onOrder}
          className={`w-full ${buttonStyle} bg-foreground py-3.5 text-sm font-medium text-ivory transition hover:bg-champagne`}
        >
          {ctaLabel}
          <span className="mr-1 text-champagne-light">
            — {selectedOffer.price} ر.س
          </span>
        </button>
        <CompactTrustBadges items={codTrust} />
      </div>
    </div>
  );
}
