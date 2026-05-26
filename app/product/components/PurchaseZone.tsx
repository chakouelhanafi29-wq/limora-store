"use client";

import type { Offer } from "../../lib/product-data";
import OfferSelection from "./OfferSelection";

type Props = {
  selectedOffer: Offer;
  onSelectOffer: (offer: Offer) => void;
  onOrder: () => void;
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
  offers,
  ctaLabel,
  codTrust,
  buttonStyle = "rounded-full",
  ctaSize = "md",
}: Props) {
  const sizeClass =
    ctaSize === "sm"
      ? "py-3 text-sm"
      : ctaSize === "lg"
        ? "py-5 text-lg"
        : "py-4 text-base";

  const btnRadius = buttonStyle === "rounded-xl" ? "rounded-xl" : "rounded-full";

  return (
    <div id="purchase-zone" className="mt-6">
      <OfferSelection
        selected={selectedOffer}
        onSelect={onSelectOffer}
        offers={offers}
      />

      <div className="mt-8 hidden md:block">
        <button
          type="button"
          onClick={onOrder}
          className={`group relative w-full overflow-hidden ${btnRadius} bg-foreground ${sizeClass} font-medium text-ivory transition hover:shadow-xl`}
        >
          <span className="relative z-10">{ctaLabel}</span>
          <span className="relative z-10 mr-2 text-champagne-light">
            — {selectedOffer.price} ر.س
          </span>
          <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
        </button>
        <CompactTrustBadges items={codTrust} />
      </div>
    </div>
  );
}
