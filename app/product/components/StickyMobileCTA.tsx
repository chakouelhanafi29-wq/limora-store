"use client";

import type { Offer } from "../../lib/product-data";

type Props = {
  offer: Offer;
  onOrder: () => void;
  ctaLabel: string;
  visible: boolean;
  codTrust?: string[];
};

export default function StickyMobileCTA({
  offer,
  onOrder,
  ctaLabel,
  visible,
  codTrust = [],
}: Props) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-champagne/15 bg-ivory/95 px-4 pt-3 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between gap-3">
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
            className="shrink-0 rounded-full bg-foreground px-5 py-3.5 text-xs font-medium leading-snug text-ivory shadow-lg shadow-foreground/10 transition hover:bg-champagne sm:text-sm"
          >
            {ctaLabel}
          </button>
        </div>
        {codTrust.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
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
