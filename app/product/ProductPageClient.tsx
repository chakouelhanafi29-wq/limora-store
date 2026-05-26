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
import FinalCTASection from "./components/FinalCTASection";
import OrderModal from "./components/OrderModal";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductStickyBar from "./components/ProductStickyBar";
import PurchaseZone from "./components/PurchaseZone";
import StickyMobileCTA from "./components/StickyMobileCTA";

type Props = {
  pageConfig: ProductPageConfig;
  productId?: string;
  galleryImages?: string[];
  preview?: boolean;
};

export default function ProductPageClient({
  pageConfig,
  productId,
  galleryImages,
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
        galleryImages,
      ),
    [pageConfig.hero, pageConfig.slug, galleryImages],
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

  useEffect(() => {
    if (preview) return;
    trackEvent("ViewContent", {
      product_name: product.orderName,
      product_slug: pageConfig.slug,
      value: defaultOffer.price,
      page_path: `/product/${pageConfig.slug}`,
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
        page_path: `/product/${pageConfig.slug}`,
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
        page_path: `/product/${pageConfig.slug}`,
      });
    }
    setModalOpen(true);
  }, [preview, product.orderName, pageConfig.slug, selectedOffer, offerLabels]);

  const heroGradient =
    pageConfig.theme.heroGradient === "pink"
      ? "luxury-pink-gradient"
      : pageConfig.theme.heroGradient === "soft"
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
        <header className="border-b border-rose-200/40 bg-[#fff9fb]/90 backdrop-blur-xl">
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

      <main className={preview ? "" : "pb-28 md:pb-0"}>
        <section className={heroGradient}>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-16">
            <ProductGallery product={product} aspectClass={aspectClass} />
            <div>
              <ProductInfo
                product={product}
                codTrust={pageConfig.hero.codTrust}
              />
              <PurchaseZone
                selectedOffer={selectedOffer}
                onSelectOffer={handleSelectOffer}
                onOrder={openOrder}
                offers={offers}
                ctaLabel={pageConfig.hero.ctaLabel}
                codTrust={pageConfig.hero.codTrust}
                buttonStyle={pageConfig.theme.buttonStyle}
                ctaSize={pageConfig.mobile.ctaSize}
              />
            </div>
          </div>
        </section>

        <ConfigurableProductSections
          config={pageConfig}
          onOrder={preview ? undefined : openOrder}
          ctaLabel={pageConfig.hero.ctaLabel}
          selectedPrice={selectedOffer.price}
        />

        {!preview && (
          <FinalCTASection
            productName={product.name}
            urgency={product.urgency}
            onOrder={openOrder}
            ctaLabel={pageConfig.hero.ctaLabel}
            price={selectedOffer.price}
            codTrust={pageConfig.hero.codTrust}
          />
        )}
      </main>

      {!preview && (
        <>
          <StickyMobileCTA
            offer={selectedOffer}
            onOrder={openOrder}
            ctaLabel={pageConfig.hero.ctaLabel}
            codTrust={pageConfig.hero.codTrust}
          />
          <OrderModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            offer={selectedOffer}
            offers={offers}
            onSelectOffer={handleSelectOffer}
            product={product}
            productId={productId}
            productSlug={pageConfig.slug}
            offerLabels={offerLabels}
            orderModal={pageConfig.orderModal}
            codTrust={pageConfig.hero.codTrust}
          />
        </>
      )}
    </div>
  );
}
