"use client";

import type { Offer } from "../../lib/product-data";
import {
  buildPrimaryCtaClassName,
  getCtaSizeClass,
} from "@/lib/page-builder/product-page-theme";

type Props = {
  offer: Offer;
  onOrder: () => void;
  ctaLabel: string;
  visible: boolean;
  codTrust?: string[];
  buttonStyle?: "rounded-full" | "rounded-xl";
  ctaSize?: "sm" | "md" | "lg";
};

export default function StickyMobileCTA({
  offer,
  onOrder,
  ctaLabel,
  visible,
  codTrust = [],
  buttonStyle = "rounded-full",
  ctaSize = "md",
}: Props) {
  const sizeClass = getCtaSizeClass(ctaSize);

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
        {codTrust.length > 0 ? (
          <div className="mb-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
            {codTrust.slice(0, 3).map((item) => (
              <span key={item} className="text-[10px] text-muted">
                ✓ {item}
              </span>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onOrder}
          className={buildPrimaryCtaClassName({
            buttonStyle,
            sizeClass: `${sizeClass} min-h-[48px]`,
            attention: true,
          })}
        >
          <span className="relative z-10">{ctaLabel}</span>
          <span className="relative z-10 mr-2 text-champagne-light">
            — {offer.price} ر.س
          </span>
          <span className="absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-15" />
        </button>
      </div>
    </div>
  );
}
