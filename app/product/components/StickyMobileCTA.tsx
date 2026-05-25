"use client";

import type { Offer } from "../../lib/product-data";

type Props = {
  offer: Offer;
  onOrder: () => void;
  visible: boolean;
  ctaLabel: string;
};

export default function StickyMobileCTA({
  offer,
  onOrder,
  visible,
  ctaLabel,
}: Props) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-champagne/10 bg-ivory/95 p-4 backdrop-blur-xl transition-all duration-500 ease-out md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="shrink-0">
          <p className="text-[11px] text-muted">{offer.label}</p>
          <p className="font-serif text-lg font-semibold text-foreground">
            {offer.price} <span className="text-xs text-muted">ر.س</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onOrder}
          className="flex-1 rounded-full bg-foreground py-3 text-xs font-medium leading-snug text-ivory transition hover:bg-champagne sm:text-sm"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
