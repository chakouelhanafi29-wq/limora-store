import { resolveProductGalleryImages } from "@/lib/product-images";
import type { ProductWithRelations } from "@/lib/types/database";
import {
  buildStaticTemplateConfig,
  createSectionId,
  genericSectionScaffolds,
} from "@/lib/page-builder/section-templates";
import { createDefaultFinalCta } from "@/lib/page-builder/default-final-cta";
import type { BuilderOffer, PageSection, ProductPageConfig } from "./types";

function mapOffersFromProduct(product: ProductWithRelations): BuilderOffer[] {
  if (!product.product_offers?.length) {
    return [
      {
        id: "1",
        label: "قطعة واحدة",
        displayLabel: "عرض قطعة واحدة",
        quantity: 1,
        price: Number(product.price),
        badge: product.badge,
        recommended: true,
        savingsText: null,
      },
    ];
  }

  return product.product_offers.map((offer) => ({
    id: offer.id,
    label: offer.label,
    displayLabel:
      offer.display_label ??
      (offer.quantity === 1
        ? "عرض قطعة واحدة"
        : offer.quantity === 2
          ? "عرض قطعتين"
          : `عرض ${offer.quantity} قطع`),
    quantity: offer.quantity,
    price: Number(offer.price),
    badge: offer.badge,
    recommended: offer.is_recommended,
    savingsText: null,
  }));
}

export function overlayProductDataOnPageConfig(
  config: ProductPageConfig,
  product: ProductWithRelations,
): ProductPageConfig {
  const galleryImages = resolveProductGalleryImages(
    product.product_images,
    config.hero.images,
  );

  return {
    ...config,
    slug: product.slug,
    hero: {
      ...config.hero,
      nameAr: product.name_ar || config.hero.nameAr,
      nameEn: product.name_en || config.hero.nameEn,
      subtitle: product.subtitle ?? config.hero.subtitle,
      bullets: product.bullets?.length ? product.bullets : config.hero.bullets,
      urgency: product.urgency_text ?? config.hero.urgency,
      images: galleryImages.length ? galleryImages : config.hero.images,
    },
    offers: mapOffersFromProduct(product),
    stickyBar: config.stickyBar
      ? {
          ...config.stickyBar,
          messages: config.stickyBar.messages.map((message, index) =>
            index === 0
              ? `${product.name_en} — ${product.subtitle ?? "LIMORA"}`
              : message,
          ),
        }
      : config.stickyBar,
  };
}

export function buildProductPageConfigFromProduct(
  product: ProductWithRelations | null,
  slug: string,
): ProductPageConfig {
  if (!product) {
    return buildStaticTemplateConfig(slug);
  }

  const galleryImages = resolveProductGalleryImages(
    product.product_images,
    [],
  );
  const bullets =
    product.bullets?.length > 0
      ? product.bullets
      : [product.subtitle ?? "منتج LIMORA فاخر"];

  const sections: PageSection[] = genericSectionScaffolds(product).map(
    (section, index) => ({
      ...section,
      id: createSectionId(),
      order: index,
    }),
  );

  return {
    slug,
    hero: {
      nameAr: product.name_ar,
      nameEn: product.name_en,
      subtitle: product.subtitle ?? "",
      emotionalHook: "جمالك يبدأ من الداخل",
      rating: 4.9,
      reviewCount: 1200,
      bullets,
      urgency:
        product.urgency_text ??
        "✨ شحن مجاني + الدفع عند الاستلام داخل السعودية",
      images: galleryImages.length ? galleryImages : [],
      codTrust: ["شحن سريع", "دفع عند الاستلام", "ضمان الجودة", "حلال"],
      ctaLabel: "أطلب الآن الدفع عند الاستلام",
    },
    offers: mapOffersFromProduct(product),
    orderModal: {
      title: "أكّدي طلبكِ",
      subtitle: "دفع عند الاستلام · شحن مجاني",
      submitLabel: "تأكيد الطلب",
      trustLine: "✦ الدفع عند الاستلام · لا حاجة لبطاقة ائتمان",
    },
    stickyBar: {
      enabled: true,
      messages: [
        `${product.name_en} — ${product.subtitle ?? "LIMORA"}`,
        "شحن مجاني + الدفع عند الاستلام",
        "ضمان الجودة",
      ],
    },
    finalCta: createDefaultFinalCta(product.name_ar),
    sections,
    theme: {
      accentColor: "#D4899A",
      buttonStyle: "rounded-full",
      heroGradient: "pink",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
    mobile: {
      ctaSize: "md",
      imageAspect: "square",
      sectionOrder: null,
      spacingScale: 1,
    },
  };
}
