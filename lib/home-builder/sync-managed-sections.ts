import { realResults } from "@/app/lib/data";
import { HOME_TRANSFORMATION_IMAGES } from "@/lib/home-images";
import type { HomePageConfig, HomeSection } from "./types";

/** Bump when managed homepage section content changes in code. */
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

export function syncManagedHomeSections(
  config: HomePageConfig,
  defaults: HomePageConfig,
): HomePageConfig {
  const defaultSection = getBeforeAfterSection(defaults.sections);
  if (!defaultSection) return config;

  let changed = false;
  const sections = config.sections.map((section) => {
    if (section.type !== "before_after") return section;
    if (!beforeAfterSectionNeedsSync(section)) return section;

    changed = true;
    return {
      ...section,
      content: getDefaultBeforeAfterContent(),
    };
  });

  if (!sections.some((section) => section.type === "before_after")) {
    changed = true;
    sections.push({
      ...defaultSection,
      content: getDefaultBeforeAfterContent(),
    });
  }

  if (!changed) return config;

  return {
    ...config,
    sections: sections.sort((a, b) => a.order - b.order),
  };
}

export function homePageConfigNeedsManagedSync(
  saved: HomePageConfig,
  synced: HomePageConfig,
): boolean {
  const savedSection = getBeforeAfterSection(saved.sections);
  const syncedSection = getBeforeAfterSection(synced.sections);
  if (!savedSection || !syncedSection) return true;

  return (
    JSON.stringify(savedSection.content) !== JSON.stringify(syncedSection.content)
  );
}
