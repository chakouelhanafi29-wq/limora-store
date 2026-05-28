import { createDefaultFinalCta } from "./default-final-cta";
import {
  buildDefaultPageLayoutOrder,
  getResolvedPageLayoutOrder,
  isPageSystemBlock,
  reconcilePageLayoutOrder,
} from "./page-layout";
import { buildProductPageConfigFromProduct, overlayProductDataOnPageConfig } from "./product-seed";
import { getStaticProductPageConfig, resolveProductSlug } from "@/lib/products/catalog";
import type { ProductWithRelations } from "@/lib/types/database";
import type { PageSection, ProductPageConfig } from "./types";

export { createSectionId } from "./section-templates";

function createId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createPlaceholderProduct(slug: string): ProductWithRelations {
  return {
    id: "",
    slug,
    name_ar: "منتج جديد",
    name_en: "New Product",
    subtitle: "",
    description: "",
    price: 199,
    original_price: null,
    badge: null,
    is_featured: false,
    is_active: true,
    sort_order: 0,
    bullets: [],
    urgency_text: null,
    created_at: "",
    updated_at: "",
    product_images: [],
    product_offers: [],
  };
}

export function getDefaultProductPageConfig(
  slug = "collagen-glow",
  product?: ProductWithRelations | null,
): ProductPageConfig {
  const resolvedSlug = resolveProductSlug(slug);
  const staticConfig = getStaticProductPageConfig(resolvedSlug);

  let config: ProductPageConfig;
  if (staticConfig) {
    config = staticConfig;
    if (product) {
      config = overlayProductDataOnPageConfig(config, product);
    }
  } else if (product) {
    config = buildProductPageConfigFromProduct(product, resolvedSlug);
  } else {
    config = buildProductPageConfigFromProduct(
      createPlaceholderProduct(resolvedSlug),
      resolvedSlug,
    );
  }

  if (typeof structuredClone === "function") {
    const cloned = structuredClone(config);
    if (!cloned.finalCta) {
      cloned.finalCta = createDefaultFinalCta(cloned.hero.nameAr);
    }
    return cloned;
  }
  const cloned = JSON.parse(JSON.stringify(config)) as ProductPageConfig;
  if (!cloned.finalCta) {
    cloned.finalCta = createDefaultFinalCta(cloned.hero.nameAr);
  }
  return cloned;
}

type MergeProductPageConfigOptions = {
  /** Saved row from Supabase — use builder content as primary source. */
  authoritative?: boolean;
};

export function mergeProductPageConfig(
  saved: Partial<ProductPageConfig> | null,
  slug = "collagen-glow",
  product?: ProductWithRelations | null,
  options?: MergeProductPageConfigOptions,
): ProductPageConfig {
  const resolvedSlug = resolveProductSlug(slug);
  const defaults = getDefaultProductPageConfig(resolvedSlug, product);
  if (!saved) return defaults;

  const authoritative = options?.authoritative ?? false;

  if (authoritative) {
    return {
      slug: resolvedSlug,
      hero: {
        ...defaults.hero,
        ...saved.hero,
        images: Array.isArray(saved.hero?.images)
          ? saved.hero.images.length
            ? saved.hero.images
            : defaults.hero.images
          : defaults.hero.images,
        bullets: saved.hero?.bullets?.length
          ? saved.hero.bullets
          : defaults.hero.bullets,
      },
      offers: Array.isArray(saved.offers)
        ? saved.offers.length
          ? saved.offers
          : defaults.offers
        : defaults.offers,
      orderModal: saved.orderModal
        ? { ...defaults.orderModal, ...saved.orderModal }
        : defaults.orderModal,
      stickyBar: saved.stickyBar
        ? { ...defaults.stickyBar, ...saved.stickyBar }
        : defaults.stickyBar,
      finalCta: saved.finalCta
        ? { ...defaults.finalCta, ...saved.finalCta }
        : defaults.finalCta,
      sections: Array.isArray(saved.sections)
        ? saved.sections.length
          ? saved.sections
          : defaults.sections
        : defaults.sections,
      pageLayoutOrder: Array.isArray(saved.pageLayoutOrder)
        ? saved.pageLayoutOrder.length
          ? reconcilePageLayoutOrder(saved.pageLayoutOrder, {
              ...defaults,
              ...saved,
              sections: Array.isArray(saved.sections)
                ? saved.sections.length
                  ? saved.sections
                  : defaults.sections
                : defaults.sections,
            } as ProductPageConfig)
          : defaults.pageLayoutOrder ?? buildDefaultPageLayoutOrder(defaults)
        : defaults.pageLayoutOrder ?? buildDefaultPageLayoutOrder(defaults),
      theme: saved.theme ? { ...defaults.theme, ...saved.theme } : defaults.theme,
      mobile: saved.mobile ? { ...defaults.mobile, ...saved.mobile } : defaults.mobile,
    };
  }

  return {
    slug: resolvedSlug,
    hero: { ...defaults.hero, ...saved.hero },
    offers: saved.offers?.length ? saved.offers : defaults.offers,
    orderModal: { ...defaults.orderModal, ...saved.orderModal },
    stickyBar: { ...defaults.stickyBar, ...saved.stickyBar },
    finalCta: saved.finalCta
      ? { ...defaults.finalCta, ...saved.finalCta }
      : defaults.finalCta,
    sections: saved.sections?.length ? saved.sections : defaults.sections,
    pageLayoutOrder:
      Array.isArray(saved.pageLayoutOrder) && saved.pageLayoutOrder.length
        ? reconcilePageLayoutOrder(saved.pageLayoutOrder, {
            ...defaults,
            ...saved,
            sections: saved.sections?.length ? saved.sections : defaults.sections,
          } as ProductPageConfig)
        : buildDefaultPageLayoutOrder({
            ...defaults,
            sections: saved.sections?.length ? saved.sections : defaults.sections,
          }),
    theme: { ...defaults.theme, ...saved.theme },
    mobile: { ...defaults.mobile, ...saved.mobile },
  };
}

export function getOrderedSections(
  config: ProductPageConfig,
  mobile = false,
) {
  const layout = getResolvedPageLayoutOrder(config, mobile);
  const orderMap = new Map(
    layout
      .filter((id) => !isPageSystemBlock(id))
      .map((id, index) => [id, index]),
  );

  return config.sections
    .filter((section) => section.enabled)
    .sort(
      (a, b) =>
        (orderMap.get(a.id) ?? a.order) - (orderMap.get(b.id) ?? b.order),
    );
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
