"use client";

import type { Offer } from "../../lib/product-data";

type Props = {
  offer: Offer;
  onOrder: () => void;
  ctaLabel: string;
  codTrust?: string[];
};

export default function StickyMobileCTA({
  offer,
  onOrder,
  ctaLabel,
  codTrust = [],
}: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-champagne/15 bg-ivory/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto max-w-lg">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="min-w-0 shrink">
            <p className="truncate text-[11px] text-muted">{offer.label}</p>
            <p className="font-serif text-lg font-semibold text-foreground">
              {offer.price}{" "}
              <span className="text-xs font-normal text-muted">ر.س</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onOrder}
            className="shrink-0 rounded-full bg-foreground px-5 py-3 text-xs font-medium leading-snug text-ivory transition hover:bg-champagne sm:text-sm"
          >
            {ctaLabel}
          </button>
        </div>
        {codTrust.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5">
            {codTrust.slice(0, 3).map((item) => (
              <span key={item} className="text-[10px] text-muted">
                ✓ {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
