"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Offer } from "../lib/product-data";
import type { ProductPageConfig } from "@/lib/page-builder/types";
import { resolveHeroTrustBadges } from "@/lib/page-builder/hero-trust";
import { createDefaultFinalCta } from "@/lib/page-builder/default-final-cta";
import {
  PAGE_BLOCK_FINAL_CTA,
  PAGE_BLOCK_HERO,
  PAGE_BLOCK_OFFERS,
  getResolvedPageLayoutOrder,
} from "@/lib/page-builder/page-layout";
import { getOfferDisplayLabel } from "@/lib/storefront";
import { trackEvent } from "@/lib/analytics/events";
import {
  builderOffersToOffers,
  heroToStorefrontProduct,
  renderProductSection,
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
  preview?: boolean;
  previewMobile?: boolean;
};

export default function ProductPageClient({
  pageConfig,
  productId,
  preview = false,
  previewMobile = false,
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

  const heroTrustBadges = useMemo(
    () => resolveHeroTrustBadges(pageConfig.hero.codTrust),
    [pageConfig.hero.codTrust],
  );

  const defaultOffer = useMemo(
    () => offers.find((offer) => offer.recommended) ?? offers[0],
    [offers],
  );
  const [selectedOffer, setSelectedOffer] = useState<Offer>(defaultOffer);
  const [modalOpen, setModalOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [viewportMobile, setViewportMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setViewportMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isMobile = previewMobile || viewportMobile;
  const layoutOrder = useMemo(
    () => getResolvedPageLayoutOrder(pageConfig, isMobile),
    [pageConfig, isMobile],
  );

  const handleStickyVisibilityChange = useCallback((show: boolean) => {
    setShowStickyCta(show);
  }, []);

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

  const sectionCta =
    selectedOffer.price > 0
      ? {
          onOrder: openOrder,
          ctaLabel: pageConfig.hero.ctaLabel,
          price: selectedOffer.price,
        }
      : undefined;

  function renderLayoutBlock(blockId: string): ReactNode {
    if (blockId === PAGE_BLOCK_HERO) {
      return (
        <section key={blockId} className={heroGradient}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-12">
            <ProductGallery product={product} aspectClass={aspectClass} />
            <ProductInfo product={product} />
          </div>
        </section>
      );
    }

    if (blockId === PAGE_BLOCK_OFFERS) {
      return (
        <section key={blockId} className={heroGradient}>
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
            <div className="lg:mr-auto lg:max-w-xl lg:justify-self-end">
              <PurchaseZone
                selectedOffer={selectedOffer}
                onSelectOffer={handleSelectOffer}
                onOrder={openOrder}
                onStickyVisibilityChange={
                  preview ? undefined : handleStickyVisibilityChange
                }
                offers={offers}
                ctaLabel={pageConfig.hero.ctaLabel}
                codTrust={heroTrustBadges}
                buttonStyle={pageConfig.theme.buttonStyle}
                ctaSize={pageConfig.mobile.ctaSize}
              />
            </div>
          </div>
        </section>
      );
    }

    if (blockId === PAGE_BLOCK_FINAL_CTA) {
      if (pageConfig.finalCta?.enabled === false) return null;
      return (
        <FinalCTASection
          key={blockId}
          config={
            pageConfig.finalCta ?? createDefaultFinalCta(product.name)
          }
          productName={product.name}
          urgency={product.urgency}
          onOrder={openOrder}
          ctaLabel={pageConfig.hero.ctaLabel}
          price={selectedOffer.price}
          codTrust={heroTrustBadges}
        />
      );
    }

    const section = pageConfig.sections.find((item) => item.id === blockId);
    if (!section?.enabled) return null;

    return renderProductSection(section, pageConfig.theme, sectionCta);
  }

  const renderLayoutBlocks = () => {
    const blocks: ReactNode[] = [];

    for (let index = 0; index < layoutOrder.length; index += 1) {
      const blockId = layoutOrder[index];
      const nextBlockId = layoutOrder[index + 1];

      if (blockId === PAGE_BLOCK_HERO && nextBlockId === PAGE_BLOCK_OFFERS) {
        blocks.push(
          <section key={`${blockId}-${nextBlockId}`} className={heroGradient}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-12">
              <ProductGallery product={product} aspectClass={aspectClass} />
              <div>
                <ProductInfo product={product} />
                <PurchaseZone
                  selectedOffer={selectedOffer}
                  onSelectOffer={handleSelectOffer}
                  onOrder={openOrder}
                  onStickyVisibilityChange={
                    preview ? undefined : handleStickyVisibilityChange
                  }
                  offers={offers}
                  ctaLabel={pageConfig.hero.ctaLabel}
                  codTrust={heroTrustBadges}
                  buttonStyle={pageConfig.theme.buttonStyle}
                  ctaSize={pageConfig.mobile.ctaSize}
                />
              </div>
            </div>
          </section>,
        );
        index += 1;
        continue;
      }

      const rendered = renderLayoutBlock(blockId);
      if (rendered) blocks.push(rendered);
    }

    return blocks;
  };

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

      <main
        className={`product-builder-page ${
          preview
            ? ""
            : showStickyCta
              ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0"
              : "pb-6 md:pb-0"
        }`}
        style={{
          ...(pageConfig.mobile.spacingScale !== 1
            ? { fontSize: `${pageConfig.mobile.spacingScale * 100}%` }
            : {}),
        }}
      >
        {renderLayoutBlocks()}
      </main>

      {!preview && (
        <>
          <StickyMobileCTA
            offer={selectedOffer}
            onOrder={openOrder}
            ctaLabel={pageConfig.hero.ctaLabel}
            visible={showStickyCta}
            codTrust={heroTrustBadges}
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
            codTrust={heroTrustBadges}
          />
        </>
      )}
    </div>
  );
}
