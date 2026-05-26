"use client";

import { useEffect, useRef } from "react";
import type { Offer } from "../../lib/product-data";
import OfferSelection from "./OfferSelection";
import { HeroTrustBadge } from "./TrustBadgeItem";

type Props = {
  selectedOffer: Offer;
  onSelectOffer: (offer: Offer) => void;
  onOrder: () => void;
  onStickyVisibilityChange?: (showSticky: boolean) => void;
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
        <HeroTrustBadge key={item} label={item} compact />
      ))}
    </div>
  );
}

function OrderButton({
  onOrder,
  ctaLabel,
  price,
  buttonStyle,
  sizeClass,
}: {
  onOrder: () => void;
  ctaLabel: string;
  price: number;
  buttonStyle: "rounded-full" | "rounded-xl";
  sizeClass: string;
}) {
  const btnRadius = buttonStyle === "rounded-xl" ? "rounded-xl" : "rounded-full";

  return (
    <button
      type="button"
      onClick={onOrder}
      className={`group relative w-full overflow-hidden ${btnRadius} bg-foreground ${sizeClass} font-medium text-ivory transition hover:shadow-xl`}
    >
      <span className="relative z-10">{ctaLabel}</span>
      <span className="relative z-10 mr-2 text-champagne-light">
        — {price} ر.س
      </span>
      <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
    </button>
  );
}

export default function PurchaseZone({
  selectedOffer,
  onSelectOffer,
  onOrder,
  onStickyVisibilityChange,
  offers,
  ctaLabel,
  codTrust,
  buttonStyle = "rounded-full",
  ctaSize = "md",
}: Props) {
  const zoneRef = useRef<HTMLDivElement>(null);

  const sizeClass =
    ctaSize === "sm"
      ? "py-3 text-sm"
      : ctaSize === "lg"
        ? "py-5 text-lg"
        : "py-4 text-base";

  useEffect(() => {
    const node = zoneRef.current;
    if (!node || !onStickyVisibilityChange) return;

    const updateSticky = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        onStickyVisibilityChange(false);
        return;
      }
      const scrolledPast = entry.boundingClientRect.top < 0;
      onStickyVisibilityChange(scrolledPast);
    };

    const observer = new IntersectionObserver(
      ([entry]) => updateSticky(entry),
      { threshold: 0, rootMargin: "0px 0px -1px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onStickyVisibilityChange]);

  return (
    <div ref={zoneRef} id="purchase-zone" className="mt-6 scroll-mt-24">
      <OfferSelection
        selected={selectedOffer}
        onSelect={onSelectOffer}
        offers={offers}
      />

      <div className="mt-8 md:hidden">
        <OrderButton
          onOrder={onOrder}
          ctaLabel={ctaLabel}
          price={selectedOffer.price}
          buttonStyle={buttonStyle}
          sizeClass={sizeClass}
        />
        <CompactTrustBadges items={codTrust} />
      </div>

      <div className="mt-8 hidden md:block">
        <OrderButton
          onOrder={onOrder}
          ctaLabel={ctaLabel}
          price={selectedOffer.price}
          buttonStyle={buttonStyle}
          sizeClass={sizeClass}
        />
        <CompactTrustBadges items={codTrust} />
      </div>
    </div>
  );
}
