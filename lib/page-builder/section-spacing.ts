import type { ProductPageTheme } from "./types";

/** Shared vertical rhythm for product page sections. */
export function getSectionPaddingClass(theme: ProductPageTheme) {
  if (theme.sectionSpacing === "compact") return "py-7 sm:py-9";
  if (theme.sectionSpacing === "spacious") return "py-14 sm:py-16";
  return "py-10 sm:py-12";
}

export function getSectionHeaderMarginClass() {
  return "mb-7 sm:mb-8";
}

export function getSectionLabelMarginClass() {
  return "mb-2";
}

export function getSectionGridGapClass() {
  return "gap-4 sm:gap-5";
}
