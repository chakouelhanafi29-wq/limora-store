import {
  comparison,
  guarantee,
  howToUse,
  offers,
  problemSolution,
  product,
  productBenefits,
  productFaqs,
  productIngredients,
  productReviews,
  relatedProducts,
  transformation,
} from "@/app/lib/product-data";
import type { ProductPageConfig, PageSection } from "./types";

function createId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getDefaultProductPageConfig(slug = "glow"): ProductPageConfig {
  if (typeof structuredClone === "function") {
    return buildDefaultConfig(slug);
  }
  return JSON.parse(JSON.stringify(buildDefaultConfig(slug))) as ProductPageConfig;
}

function buildDefaultConfig(slug: string): ProductPageConfig {
  const sections: PageSection[] = [
    {
      id: createId(),
      type: "problem_solution",
      enabled: true,
      order: 0,
      content: structuredClone(problemSolution),
    },
    {
      id: createId(),
      type: "benefits",
      enabled: true,
      order: 1,
      content: structuredClone(productBenefits),
    },
    {
      id: createId(),
      type: "transformation",
      enabled: true,
      order: 2,
      content: structuredClone(transformation),
    },
    {
      id: createId(),
      type: "comparison",
      enabled: true,
      order: 3,
      content: structuredClone(comparison),
    },
    {
      id: createId(),
      type: "reviews",
      enabled: true,
      order: 4,
      content: structuredClone(productReviews),
    },
    {
      id: createId(),
      type: "how_to_use",
      enabled: true,
      order: 5,
      content: structuredClone(howToUse),
    },
    {
      id: createId(),
      type: "ingredients",
      enabled: true,
      order: 6,
      content: structuredClone(productIngredients),
    },
    {
      id: createId(),
      type: "faq",
      enabled: true,
      order: 7,
      content: structuredClone(productFaqs),
    },
    {
      id: createId(),
      type: "guarantee",
      enabled: true,
      order: 8,
      content: structuredClone(guarantee),
    },
    {
      id: createId(),
      type: "related_products",
      enabled: true,
      order: 9,
      content: { label: "YOU MAY ALSO LOVE", title: "منتجات قد تعجبكِ", items: relatedProducts },
    },
  ];

  return {
    slug,
    hero: {
      nameAr: product.name,
      nameEn: product.nameEn,
      subtitle: product.subtitle,
      rating: product.rating,
      reviewCount: product.reviewCount,
      bullets: [...product.bullets],
      urgency: product.urgency,
      images: [...product.images],
      codTrust: [...product.codTrust],
      ctaLabel: "أطلب الآن الدفع عند الاستلام",
    },
    offers: offers.map((offer) => ({
      id: offer.id,
      label: offer.label,
      displayLabel:
        offer.quantity === 1
          ? "عرض قطعة واحدة"
          : offer.quantity === 2
            ? "عرض قطعتين"
            : `عرض ${offer.quantity} قطع`,
      quantity: offer.quantity,
      price: offer.price,
      badge: offer.badge,
      recommended: offer.recommended,
      savingsText: null,
    })),
    orderModal: {
      title: "أكّدي طلبكِ",
      subtitle: "دفع عند الاستلام · شحن مجاني",
      submitLabel: "تأكيد الطلب",
      trustLine: "✦ الدفع عند الاستلام · لا حاجة لبطاقة ائتمان",
    },
    stickyBar: {
      enabled: true,
      messages: [
        "شحن مجاني + الدفع عند الاستلام",
        "ضمان الجودة على جميع منتجات LIMORA",
      ],
    },
    sections,
    theme: {
      accentColor: "#C4A574",
      buttonStyle: "rounded-full",
      heroGradient: "luxury",
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

export function mergeProductPageConfig(
  saved: Partial<ProductPageConfig> | null,
  slug = "glow",
): ProductPageConfig {
  const defaults = getDefaultProductPageConfig(slug);
  if (!saved) return defaults;

  return {
    slug,
    hero: { ...defaults.hero, ...saved.hero },
    offers: saved.offers?.length ? saved.offers : defaults.offers,
    orderModal: { ...defaults.orderModal, ...saved.orderModal },
    stickyBar: { ...defaults.stickyBar, ...saved.stickyBar },
    sections: saved.sections?.length ? saved.sections : defaults.sections,
    theme: { ...defaults.theme, ...saved.theme },
    mobile: { ...defaults.mobile, ...saved.mobile },
  };
}

export function getOrderedSections(
  config: ProductPageConfig,
  mobile = false,
) {
  const enabled = config.sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  if (mobile && config.mobile.sectionOrder?.length) {
    const orderMap = new Map(
      config.mobile.sectionOrder.map((id, index) => [id, index]),
    );
    return [...enabled].sort(
      (a, b) => (orderMap.get(a.id) ?? a.order) - (orderMap.get(b.id) ?? b.order),
    );
  }

  return enabled;
}

export function duplicateSection(section: PageSection): PageSection {
  const clone =
    typeof structuredClone === "function"
      ? structuredClone(section)
      : (JSON.parse(JSON.stringify(section)) as PageSection);
  return {
    ...clone,
    id: createId(),
    order: section.order + 0.5,
  };
}

export function normalizeSectionOrders(sections: PageSection[]) {
  return sections
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: index }));
}
