import {
  about,
  announcements,
  emotionalMessage,
  faqs,
  finalCta,
  footer,
  hero,
  limoraBundle,
  navLinks,
  realResults,
  testimonials,
  whyLimora,
} from "@/app/lib/data";
import { COLLAGEN_GLOW_PRIMARY_IMAGE } from "@/lib/product-images";
import type { HomePageConfig, HomeSection } from "./types";
import {
  homePageConfigNeedsManagedSync,
  syncManagedHomeSections,
} from "./sync-managed-sections";

function createId() {
  return `home-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getDefaultHomePageConfig(slug = "home"): HomePageConfig {
  const sections: HomeSection[] = [
    {
      id: createId(),
      type: "announcement_bar",
      enabled: true,
      order: 0,
      content: { messages: clone(announcements) },
    },
    {
      id: createId(),
      type: "hero",
      enabled: true,
      order: 1,
      content: {
        ...clone(hero),
        image: COLLAGEN_GLOW_PRIMARY_IMAGE,
      },
    },
    {
      id: createId(),
      type: "brand_story",
      enabled: true,
      order: 2,
      content: clone(emotionalMessage),
    },
    {
      id: createId(),
      type: "products",
      enabled: true,
      order: 3,
      content: {
        label: "FEATURED COLLECTION",
        title: "مختارات LIMORA الفاخرة",
        subtitle:
          "Collagen Glow · Hair Revive · Detox Cleanse — ثلاث تركيبات… ثلاثة تحولات.",
        useDynamicProducts: true,
      },
    },
    {
      id: createId(),
      type: "before_after",
      enabled: true,
      order: 4,
      content: clone(realResults),
    },
    {
      id: createId(),
      type: "benefits",
      enabled: true,
      order: 5,
      content: clone(whyLimora),
    },
    {
      id: createId(),
      type: "reviews",
      enabled: true,
      order: 6,
      content: {
        ...clone(testimonials),
        useDynamicReviews: true,
      },
    },
    {
      id: createId(),
      type: "promo_banner",
      enabled: true,
      order: 7,
      content: {
        ...clone(limoraBundle),
        backgroundColor: "linear-gradient(135deg, #2a201e, #3d2e2a)",
      },
    },
    {
      id: createId(),
      type: "faq",
      enabled: true,
      order: 8,
      content: clone(faqs),
    },
    {
      id: createId(),
      type: "promo_banner",
      enabled: true,
      order: 9,
      content: clone(finalCta),
    },
    {
      id: createId(),
      type: "footer",
      enabled: true,
      order: 10,
      content: {
        brandName: "LIMORA",
        ...clone(footer),
      },
    },
  ];

  return {
    slug,
    navbar: {
      brandName: "LIMORA",
      ctaLabel: "اطلبي الآن",
      ctaHref: "/product/collagen-glow",
      links: clone(navLinks),
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
      spacingScale: 1,
      fontScale: 1,
      sectionOrder: null,
    },
  };
}

export function mergeHomePageConfig(
  saved: Partial<HomePageConfig> | null,
  slug = "home",
): HomePageConfig {
  const defaults = getDefaultHomePageConfig(slug);
  if (!saved) return defaults;

  const merged: HomePageConfig = {
    slug,
    navbar: { ...defaults.navbar, ...saved.navbar },
    sections: saved.sections?.length ? saved.sections : defaults.sections,
    theme: { ...defaults.theme, ...saved.theme },
    mobile: { ...defaults.mobile, ...saved.mobile },
  };

  return syncManagedHomeSections(merged, defaults);
}

export { homePageConfigNeedsManagedSync, syncManagedHomeSections };

export function getOrderedHomeSections(
  config: HomePageConfig,
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

export function duplicateHomeSection(section: HomeSection): HomeSection {
  const cloneSection = clone(section);
  return { ...cloneSection, id: createId(), order: section.order + 0.5 };
}

export function normalizeHomeSectionOrders(sections: HomeSection[]) {
  return sections
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({ ...section, order: index }));
}

export function createBlankHomeSection(
  type: HomeSection["type"],
): HomeSection {
  const defaults = getDefaultHomePageConfig();
  const template = defaults.sections.find((s) => s.type === type);
  return {
    id: createId(),
    type,
    enabled: true,
    order: 99,
    content: template ? clone(template.content) : { title: "عنوان جديد" },
  };
}
