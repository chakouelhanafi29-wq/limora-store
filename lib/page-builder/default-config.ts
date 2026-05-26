import { buildProductPageConfigFromProduct } from "./product-seed";
import { getStaticProductPageConfig } from "@/lib/products/catalog";
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
  const resolvedSlug = slug === "glow" ? "collagen-glow" : slug;
  let config: ProductPageConfig;
  if (product) {
    config = buildProductPageConfigFromProduct(product, resolvedSlug);
  } else {
    const staticConfig = getStaticProductPageConfig(resolvedSlug);
    if (staticConfig) {
      config = staticConfig;
    } else {
      config = buildProductPageConfigFromProduct(
        createPlaceholderProduct(resolvedSlug),
        resolvedSlug,
      );
    }
  }

  if (typeof structuredClone === "function") {
    return structuredClone(config);
  }
  return JSON.parse(JSON.stringify(config)) as ProductPageConfig;
}

export function mergeProductPageConfig(
  saved: Partial<ProductPageConfig> | null,
  slug = "collagen-glow",
  product?: ProductWithRelations | null,
): ProductPageConfig {
  const resolvedSlug = slug === "glow" ? "collagen-glow" : slug;
  const defaults = getDefaultProductPageConfig(resolvedSlug, product);
  if (!saved) return defaults;

  return {
    slug: resolvedSlug,
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
