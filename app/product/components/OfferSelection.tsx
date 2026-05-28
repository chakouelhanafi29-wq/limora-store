"use client";

import type { Offer } from "../../lib/product-data";
import {
  PRODUCT_OFFER_TITLE_CLASS,
  PRODUCT_PRICE_CLASS,
} from "@/lib/page-builder/product-page-theme";

type Props = {
  selected: Offer;
  onSelect: (offer: Offer) => void;
  offers: Offer[];
  compact?: boolean;
};

export default function OfferSelection({ selected, onSelect, offers, compact }: Props) {
  const basePrice = offers[0]?.price ?? 199;

  return (
    <section className={compact ? "" : "mt-10"}>
      {!compact && (
        <>
          <h2 className={`mb-2 ${PRODUCT_OFFER_TITLE_CLASS}`}>
            اختاري عرضكِ
          </h2>
          <p className="mb-6 text-sm text-muted">
            كلما زادت الكمية — زاد التوفير
          </p>
        </>
      )}

      <div className="space-y-4">
        {offers.map((offer) => {
          const isSelected = selected.id === offer.id;
          const savings =
            offer.quantity > 1 ? basePrice * offer.quantity - offer.price : 0;

          return (
            <button
              key={offer.id}
              type="button"
              onClick={() => onSelect(offer)}
              className={`relative w-full rounded-2xl border-2 p-5 text-right transition-all duration-300 ${
                isSelected
                  ? "border-champagne bg-champagne/5 shadow-lg shadow-champagne/10 scale-[1.01]"
                  : "border-champagne/15 bg-white hover:border-champagne/40"
              } ${offer.recommended ? "ring-1 ring-champagne/20" : ""}`}
            >
              {offer.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-champagne px-3 py-1 text-xs font-bold text-white">
                  {offer.badge}
                </span>
              )}

              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-champagne bg-champagne"
                      : "border-champagne/30"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-arabic-kufi font-bold text-heading">{offer.label}</p>
                  {savings > 0 && (
                    <p className="mt-1 text-xs font-medium text-champagne">
                      وفّري {savings} ر.س
                    </p>
                  )}
                  {offer.quantity > 1 && (
                    <p className="text-xs text-muted">
                      {Math.round(offer.unitPrice)} ر.س / قطعة
                    </p>
                  )}
                </div>

                <div className="text-left">
                  <p className={`${PRODUCT_PRICE_CLASS} text-2xl`}>
                    {offer.price}
                    <span className="mr-1 text-sm font-normal text-muted">
                      ر.س
                    </span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
