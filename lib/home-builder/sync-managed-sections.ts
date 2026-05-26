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
import type { HomePageConfig, HomeSection } from "./types";

/** Bump when managed homepage section content changes in code. */
export const HOME_MANAGED_CONTENT_REVISION = 3;

export const HOME_BEFORE_AFTER_CONTENT_REVISION = 2;

const EXPECTED_TRANSFORMATION_IMAGES = [
  HOME_TRANSFORMATION_IMAGES.collagenGlow,
  HOME_TRANSFORMATION_IMAGES.hairRevive,
  HOME_TRANSFORMATION_IMAGES.detoxCleanse,
] as const;

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function isValidImageSrc(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
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

  return {
    ...section,
    content: {
      ...defaultContent,
      ...content,
      image: isValidImageSrc(content.image)
        ? content.image
        : defaultContent.image || COLLAGEN_GLOW_PRIMARY_IMAGE,
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
    return {
      ...section,
      content: {
        ...clone(limoraBundle),
        ...content,
        backgroundColor:
          String(content.backgroundColor ?? "") ||
          "linear-gradient(135deg, #2a201e, #3d2e2a)",
        products: (clone(limoraBundle).products ?? []).filter((product) =>
          isValidImageSrc(product.image),
        ),
      },
    };
  }

  const nextContent = {
    ...clone(finalCta),
    ...content,
  };
  delete (nextContent as Record<string, unknown>).products;
  delete (nextContent as Record<string, unknown>).priceNote;

  return {
    ...section,
    content: nextContent,
  };
}

function removeOrphanBrandStorySections(sections: HomeSection[]): HomeSection[] {
  const brandStories = sections.filter((section) => section.type === "brand_story");
  if (brandStories.length <= 1) return sections;

  const primary = [...brandStories].sort((a, b) => a.order - b.order)[0];
  return sections.filter(
    (section) => section.type !== "brand_story" || section.id === primary.id,
  );
}

function sanitizeSection(section: HomeSection): HomeSection {
  switch (section.type) {
    case "before_after":
      return beforeAfterSectionNeedsSync(section)
        ? syncBeforeAfterSection(section)
        : section;
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

  let sections = removeOrphanBrandStorySections(config.sections).map(sanitizeSection);

  if (defaultBeforeAfter && !sections.some((section) => section.type === "before_after")) {
    sections.push({
      ...defaultBeforeAfter,
      content: getDefaultBeforeAfterContent(),
    });
  }

  return {
    ...config,
    sections: sections.sort((a, b) => a.order - b.order),
  };
}

export function homePageConfigNeedsManagedSync(
  saved: HomePageConfig,
  synced: HomePageConfig,
): boolean {
  return JSON.stringify(saved.sections) !== JSON.stringify(synced.sections);
}
