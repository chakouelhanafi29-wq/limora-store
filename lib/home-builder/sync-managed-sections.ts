import {
  emotionalMessage,
  finalCta,
  limoraBundle,
  realResults,
  testimonials,
} from "@/app/lib/data";
import { HOME_TRANSFORMATION_IMAGES } from "@/lib/home-images";
import { COLLAGEN_GLOW_PRIMARY_IMAGE } from "@/lib/product-images";
import { normalizeReviewImage } from "@/lib/review-images";
import { isValidImageSrc } from "./image-utils";
import type { HomePageConfig, HomeSection } from "./types";

/** Bump when managed homepage section content changes in code. */
export const HOME_MANAGED_CONTENT_REVISION = 5;

export const HOME_BEFORE_AFTER_CONTENT_REVISION = 3;

/** Bump when featured products section UI/content defaults change in code. */
export const HOME_PRODUCTS_CONTENT_REVISION = 2;

const EXPECTED_TRANSFORMATION_IMAGES = [
  HOME_TRANSFORMATION_IMAGES.collagenGlow,
  HOME_TRANSFORMATION_IMAGES.hairRevive,
  HOME_TRANSFORMATION_IMAGES.feminineBalance,
] as const;

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function getFaqOrder(sections: HomeSection[]): number | null {
  const faq = sections.find((section) => section.type === "faq");
  return faq?.order ?? null;
}

function getBeforeAfterSection(sections: HomeSection[]) {
  return sections.find((section) => section.type === "before_after") ?? null;
}

function getDefaultBeforeAfterContent() {
  return {
    ...clone(realResults),
    contentRevision: HOME_BEFORE_AFTER_CONTENT_REVISION,
  };
}

function transformationImages(content: Record<string, unknown>): string[] {
  const items = content.transformations;
  if (!Array.isArray(items)) return [];
  return items
    .map((item) =>
      item && typeof item === "object" && "image" in item
        ? String((item as { image: unknown }).image)
        : "",
    )
    .filter(Boolean);
}

export function beforeAfterSectionNeedsSync(section: HomeSection | null): boolean {
  if (!section || section.type !== "before_after") return true;

  const content = section.content as Record<string, unknown>;
  const revision = Number(content.contentRevision ?? 1);
  if (revision < HOME_BEFORE_AFTER_CONTENT_REVISION) return true;

  const images = transformationImages(content);
  if (images.length !== EXPECTED_TRANSFORMATION_IMAGES.length) return true;

  return EXPECTED_TRANSFORMATION_IMAGES.some(
    (expected, index) => images[index] !== expected,
  );
}

function syncBeforeAfterSection(section: HomeSection): HomeSection {
  return {
    ...section,
    content: getDefaultBeforeAfterContent(),
  };
}

function syncBrandStorySection(section: HomeSection): HomeSection {
  const content = section.content as Record<string, unknown>;
  const defaultContent = clone(emotionalMessage);
  const resolvedImage = isValidImageSrc(content.image)
    ? content.image
    : defaultContent.image || COLLAGEN_GLOW_PRIMARY_IMAGE;

  return {
    ...section,
    content: {
      ...defaultContent,
      ...content,
      image: resolvedImage,
      paragraphs:
        Array.isArray(content.paragraphs) && content.paragraphs.length
          ? content.paragraphs
          : defaultContent.paragraphs,
    },
  };
}

function syncReviewsSection(section: HomeSection): HomeSection {
  const content = section.content as Record<string, unknown>;
  const items = content.items;

  if (!Array.isArray(items)) {
    return {
      ...section,
      content: {
        ...clone(testimonials),
        ...content,
        contentRevision: HOME_MANAGED_CONTENT_REVISION,
        useDynamicReviews: content.useDynamicReviews ?? true,
      },
    };
  }

  return {
    ...section,
    content: {
      ...content,
      contentRevision: HOME_MANAGED_CONTENT_REVISION,
      items: items.map((item) => {
        if (!item || typeof item !== "object") return item;
        const review = item as Record<string, unknown>;
        const name = String(review.name ?? "");
        return {
          ...review,
          image: normalizeReviewImage(name, String(review.image ?? "")),
        };
      }),
    },
  };
}

function syncPromoBannerSection(section: HomeSection): HomeSection {
  const content = section.content as Record<string, unknown>;
  const title = String(content.title ?? "");
  const isBundle = title.includes("مجموعة LIMORA");

  if (isBundle) {
    const products = (clone(limoraBundle).products ?? []).filter((product) =>
      isValidImageSrc(product.image),
    );

    return {
      ...section,
      content: {
        ...clone(limoraBundle),
        ...content,
        backgroundColor:
          String(content.backgroundColor ?? "") ||
          "linear-gradient(135deg, #2a201e, #3d2e2a)",
        products,
      },
    };
  }

  const nextContent: Record<string, unknown> = {
    ...clone(finalCta),
    ...content,
  };
  delete nextContent.products;
  delete nextContent.priceNote;
  delete nextContent.image;

  return {
    ...section,
    content: nextContent,
  };
}

function removeDuplicateBrandStorySections(sections: HomeSection[]): HomeSection[] {
  const brandStories = sections.filter((section) => section.type === "brand_story");
  if (brandStories.length <= 1) return sections;

  const primary = [...brandStories].sort((a, b) => a.order - b.order)[0];
  return sections.filter(
    (section) => section.type !== "brand_story" || section.id === primary.id,
  );
}

/** Legacy saved configs kept an old about/brand_story block after FAQ. */
function removeBrandStoryAfterFaq(sections: HomeSection[]): HomeSection[] {
  const faqOrder = getFaqOrder(sections);
  if (faqOrder == null) return sections;

  return sections.filter(
    (section) =>
      section.type !== "brand_story" || section.order < faqOrder,
  );
}

function syncProductsSection(section: HomeSection): HomeSection {
  const content = section.content as Record<string, unknown>;
  const revision = Number(content.contentRevision ?? 1);

  if (revision >= HOME_PRODUCTS_CONTENT_REVISION) {
    return {
      ...section,
      content: {
        ...content,
        useDynamicProducts: content.useDynamicProducts ?? true,
      },
    };
  }

  return {
    ...section,
    content: {
      ...content,
      contentRevision: HOME_PRODUCTS_CONTENT_REVISION,
      useDynamicProducts: content.useDynamicProducts ?? true,
    },
  };
}

function ensureProductsSection(
  sections: HomeSection[],
  defaults: HomePageConfig,
): HomeSection[] {
  if (sections.some((section) => section.type === "products")) {
    return sections;
  }

  const fallback = defaults.sections.find((section) => section.type === "products");
  return fallback ? [...sections, clone(fallback)] : sections;
}

function sanitizeSection(section: HomeSection): HomeSection {
  switch (section.type) {
    case "before_after":
      return beforeAfterSectionNeedsSync(section)
        ? syncBeforeAfterSection(section)
        : section;
    case "products":
      return syncProductsSection(section);
    case "brand_story":
      return syncBrandStorySection(section);
    case "reviews":
      return syncReviewsSection(section);
    case "promo_banner":
      return syncPromoBannerSection(section);
    default:
      return section;
  }
}

export function syncManagedHomeSections(
  config: HomePageConfig,
  defaults: HomePageConfig,
): HomePageConfig {
  const defaultBeforeAfter = getBeforeAfterSection(defaults.sections);

  let sections = config.sections
    .filter((section) => section.enabled !== false)
    .map(sanitizeSection);

  sections = removeDuplicateBrandStorySections(sections);
  sections = removeBrandStoryAfterFaq(sections);
  sections = ensureProductsSection(sections, defaults);

  if (defaultBeforeAfter && !sections.some((section) => section.type === "before_after")) {
    sections.push({
      ...defaultBeforeAfter,
      content: getDefaultBeforeAfterContent(),
    });
  }

  return {
    ...config,
    sections: sections
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({ ...section, order: index })),
  };
}

export function homePageConfigNeedsManagedSync(
  saved: HomePageConfig,
  synced: HomePageConfig,
): boolean {
  return JSON.stringify(saved.sections) !== JSON.stringify(synced.sections);
}

export { isValidImageSrc };
