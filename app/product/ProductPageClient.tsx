"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Offer } from "../lib/product-data";
import type { ProductPageConfig } from "@/lib/page-builder/types";
import { getOfferDisplayLabel } from "@/lib/storefront";
import { trackEvent } from "@/lib/analytics/events";
import ConfigurableProductSections, {
  builderOffersToOffers,
  heroToStorefrontProduct,
} from "./components/ConfigurableProductSections";
import OrderModal from "./components/OrderModal";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductStickyBar from "./components/ProductStickyBar";
import PurchaseZone from "./components/PurchaseZone";
import StickyMobileCTA from "./components/StickyMobileCTA";

type Props = {
  pageConfig: ProductPageConfig;
  productId?: string;
  preview?: boolean;
};

export default function ProductPageClient({
  pageConfig,
  productId,
  preview = false,
}: Props) {
  const offers = useMemo(
    () => builderOffersToOffers(pageConfig.offers),
    [pageConfig.offers],
  );
  const product = useMemo(
    () =>
      heroToStorefrontProduct(
        pageConfig.hero,
        pageConfig.slug,
        pageConfig.hero.nameEn,
      ),
    [pageConfig.hero, pageConfig.slug],
  );
  const offerLabels = useMemo(
    () =>
      Object.fromEntries(
        pageConfig.offers.map((o) => [o.id, o.displayLabel || o.label]),
      ),
    [pageConfig.offers],
  );

  const defaultOffer = useMemo(
    () => offers.find((offer) => offer.recommended) ?? offers[0],
    [offers],
  );
  const [selectedOffer, setSelectedOffer] = useState<Offer>(defaultOffer);
  const [modalOpen, setModalOpen] = useState(false);
  const [purchaseVisible, setPurchaseVisible] = useState(true);

  useEffect(() => {
    if (preview) return;
    trackEvent("ViewContent", {
      product_name: product.orderName,
      product_slug: pageConfig.slug,
      value: defaultOffer.price,
      page_path: "/product",
    });
  }, [preview, product.orderName, pageConfig.slug, defaultOffer.price]);

  const handleSelectOffer = useCallback(
    (offer: Offer) => {
      setSelectedOffer(offer);
      if (preview) return;
      trackEvent("AddToCart", {
        product_name: product.orderName,
        product_slug: pageConfig.slug,
        offer_label: getOfferDisplayLabel(offer, offerLabels[offer.id]),
        value: offer.price,
        page_path: "/product",
      });
    },
    [preview, product.orderName, pageConfig.slug, offerLabels],
  );

  const openOrder = useCallback(() => {
    if (!preview) {
      trackEvent("InitiateCheckout", {
        product_name: product.orderName,
        product_slug: pageConfig.slug,
        offer_label: getOfferDisplayLabel(
          selectedOffer,
          offerLabels[selectedOffer.id],
        ),
        value: selectedOffer.price,
        page_path: "/product",
      });
    }
    setModalOpen(true);
  }, [preview, product.orderName, pageConfig.slug, selectedOffer, offerLabels]);

  const handlePurchaseVisibility = useCallback((visible: boolean) => {
    setPurchaseVisible(visible);
  }, []);

  const heroGradient =
    pageConfig.theme.heroGradient === "soft"
      ? "bg-gradient-to-b from-beige/80 to-ivory"
      : pageConfig.theme.heroGradient === "minimal"
        ? "bg-ivory"
        : "luxury-gradient";

  const aspectClass =
    pageConfig.mobile.imageAspect === "portrait"
      ? "aspect-[4/5]"
      : "aspect-square";

  return (
    <div style={{ ["--builder-accent" as string]: pageConfig.theme.accentColor }}>
      <ProductStickyBar
        messages={pageConfig.stickyBar.messages}
        enabled={pageConfig.stickyBar.enabled}
      />

      {!preview && (
        <header className="border-b border-champagne/10 bg-ivory/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <a
              href="/"
              className="font-serif text-2xl font-semibold tracking-[0.15em] text-foreground"
            >
              LIMORA
            </a>
            <a
              href="/"
              className="text-sm text-muted transition hover:text-champagne"
            >
              ← الرئيسية
            </a>
          </div>
        </header>
      )}

      <main className={preview ? "" : "pb-24 md:pb-0"}>
        <section className={heroGradient}>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            <ProductGallery product={product} aspectClass={aspectClass} />
            <div>
              <ProductInfo product={product} />
              <PurchaseZone
                selectedOffer={selectedOffer}
                onSelectOffer={handleSelectOffer}
                onOrder={openOrder}
                onPurchaseVisibilityChange={handlePurchaseVisibility}
                offers={offers}
                ctaLabel={pageConfig.hero.ctaLabel}
                codTrust={pageConfig.hero.codTrust}
                buttonStyle={pageConfig.theme.buttonStyle}
                ctaSize={pageConfig.mobile.ctaSize}
              />
            </div>
          </div>
        </section>

        <ConfigurableProductSections config={pageConfig} />
      </main>

      {!preview && (
        <>
          <StickyMobileCTA
            offer={selectedOffer}
            onOrder={openOrder}
            visible={!purchaseVisible}
            ctaLabel={pageConfig.hero.ctaLabel}
          />
          <OrderModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            offer={selectedOffer}
            product={product}
            productId={productId}
            productSlug={pageConfig.slug}
            offerLabels={offerLabels}
            orderModal={pageConfig.orderModal}
          />
        </>
      )}
    </div>
  );
}
