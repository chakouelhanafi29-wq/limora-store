import type { PageSection, ProductPageConfig, SectionType } from "./types";
import { SECTION_LABELS } from "./types";

export const PAGE_BLOCK_HERO = "__block:hero__";
export const PAGE_BLOCK_OFFERS = "__block:offers__";
export const PAGE_BLOCK_FINAL_CTA = "__block:final_cta__";

export const PAGE_SYSTEM_BLOCKS = [
  PAGE_BLOCK_HERO,
  PAGE_BLOCK_OFFERS,
  PAGE_BLOCK_FINAL_CTA,
] as const;

export type PageSystemBlockId = (typeof PAGE_SYSTEM_BLOCKS)[number];

export const PAGE_BLOCK_LABELS: Record<PageSystemBlockId, string> = {
  [PAGE_BLOCK_HERO]: "Hero — معرض + معلومات",
  [PAGE_BLOCK_OFFERS]: "العروض — منطقة الشراء",
  [PAGE_BLOCK_FINAL_CTA]: "CTA نهائي",
};

export function isPageSystemBlock(id: string): id is PageSystemBlockId {
  return PAGE_SYSTEM_BLOCKS.includes(id as PageSystemBlockId);
}

export function buildDefaultPageLayoutOrder(config: ProductPageConfig): string[] {
  const sectionIds = [...config.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => section.id);

  return [PAGE_BLOCK_HERO, PAGE_BLOCK_OFFERS, ...sectionIds, PAGE_BLOCK_FINAL_CTA];
}

export function reconcilePageLayoutOrder(
  order: string[],
  config: ProductPageConfig,
): string[] {
  const sectionIds = new Set(config.sections.map((section) => section.id));
  const result = order.filter(
    (id) => isPageSystemBlock(id) || sectionIds.has(id),
  );

  const missingSections = config.sections
    .filter((section) => !result.includes(section.id))
    .sort((a, b) => a.order - b.order)
    .map((section) => section.id);

  if (missingSections.length) {
    const finalIndex = result.indexOf(PAGE_BLOCK_FINAL_CTA);
    if (finalIndex >= 0) {
      result.splice(finalIndex, 0, ...missingSections);
    } else {
      result.push(...missingSections);
    }
  }

  if (!result.includes(PAGE_BLOCK_HERO)) {
    result.unshift(PAGE_BLOCK_HERO);
  }
  if (!result.includes(PAGE_BLOCK_OFFERS)) {
    const heroIndex = result.indexOf(PAGE_BLOCK_HERO);
    result.splice(heroIndex + 1, 0, PAGE_BLOCK_OFFERS);
  }
  if (!result.includes(PAGE_BLOCK_FINAL_CTA)) {
    result.push(PAGE_BLOCK_FINAL_CTA);
  }

  return result;
}

export function getResolvedPageLayoutOrder(
  config: ProductPageConfig,
  mobile = false,
): string[] {
  const base = reconcilePageLayoutOrder(
    config.pageLayoutOrder ?? buildDefaultPageLayoutOrder(config),
    config,
  );

  if (!mobile || !config.mobile.sectionOrder?.length) {
    return base;
  }

  return applyMobileSectionOrder(base, config.mobile.sectionOrder);
}

function applyMobileSectionOrder(
  layout: string[],
  mobileSectionOrder: string[],
): string[] {
  const mobileOrderMap = new Map(
    mobileSectionOrder.map((id, index) => [id, index]),
  );
  const sectionEntries = layout
    .map((id, index) => ({ id, index }))
    .filter(({ id }) => !isPageSystemBlock(id));

  const sortedSections = [...sectionEntries].sort(
    (a, b) =>
      (mobileOrderMap.get(a.id) ?? a.index) -
      (mobileOrderMap.get(b.id) ?? b.index),
  );

  let sectionCursor = 0;
  return layout.map((id) => {
    if (isPageSystemBlock(id)) return id;
    const next = sortedSections[sectionCursor];
    sectionCursor += 1;
    return next?.id ?? id;
  });
}

export function syncSectionOrdersFromLayout(
  sections: PageSection[],
  layoutOrder: string[],
): PageSection[] {
  const orderedSectionIds = layoutOrder.filter((id) => !isPageSystemBlock(id));
  const orderMap = new Map(
    orderedSectionIds.map((id, index) => [id, index]),
  );

  return sections
    .map((section) => {
      const order = orderMap.get(section.id);
      return order === undefined ? section : { ...section, order };
    })
    .sort((a, b) => a.order - b.order);
}

export function reorderPageLayout(
  layoutOrder: string[],
  activeId: string,
  overId: string,
): string[] | null {
  const fromIndex = layoutOrder.indexOf(activeId);
  const toIndex = layoutOrder.indexOf(overId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;

  const next = [...layoutOrder];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function movePageLayoutBlock(
  layoutOrder: string[],
  blockId: string,
  direction: "up" | "down",
): string[] | null {
  const index = layoutOrder.indexOf(blockId);
  if (index < 0) return null;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= layoutOrder.length) return null;

  const next = [...layoutOrder];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export function appendSectionToPageLayout(
  layoutOrder: string[],
  sectionId: string,
): string[] {
  if (layoutOrder.includes(sectionId)) return layoutOrder;

  const next = [...layoutOrder];
  const finalIndex = next.indexOf(PAGE_BLOCK_FINAL_CTA);
  if (finalIndex >= 0) {
    next.splice(finalIndex, 0, sectionId);
    return next;
  }

  return [...next, sectionId];
}

export function removeSectionFromPageLayout(
  layoutOrder: string[],
  sectionId: string,
): string[] {
  return layoutOrder.filter((id) => id !== sectionId);
}

export function getPageBlockLabel(
  blockId: string,
  config: ProductPageConfig,
): string {
  if (isPageSystemBlock(blockId)) {
    return PAGE_BLOCK_LABELS[blockId];
  }

  const section = config.sections.find((item) => item.id === blockId);
  if (!section) return blockId;

  const layoutIndex =
    getResolvedPageLayoutOrder(config).indexOf(blockId) + 1;
  return `${layoutIndex}. ${SECTION_LABELS[section.type as SectionType]}`;
}
