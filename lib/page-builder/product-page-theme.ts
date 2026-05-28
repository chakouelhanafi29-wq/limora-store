import type { ProductPageTheme } from "./types";

/** Unified page surface — hero, offers, and all sections share this background. */
export function getProductPageSurfaceClass(theme: ProductPageTheme): string {
  if (theme.sectionBackground === "beige") return "bg-beige/50";
  if (theme.sectionBackground === "white") return "bg-white";
  return "bg-ivory";
}

export const PRODUCT_SECTION_TITLE_CLASS =
  "font-serif text-3xl font-semibold text-foreground sm:text-4xl";

export const PRODUCT_SECTION_SUBTITLE_CLASS = "text-muted";

export const PRODUCT_PAGE_TITLE_CLASS =
  "font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl";

export const PRODUCT_CARD_TITLE_CLASS =
  "font-arabic-kufi text-heading font-bold text-sm sm:text-base";

export const PRODUCT_CARD_TITLE_LG_CLASS =
  "font-arabic-kufi text-heading font-bold text-lg sm:text-xl";

export const PRODUCT_CARD_TITLE_XL_CLASS =
  "font-arabic-kufi text-heading font-bold text-xl sm:text-2xl";

export const PRODUCT_CARD_TITLE_2XL_CLASS =
  "font-arabic-kufi text-heading font-bold text-2xl sm:text-3xl";

export const PRODUCT_OFFER_TITLE_CLASS =
  "font-serif text-2xl font-semibold text-foreground";

export const PRODUCT_PRICE_CLASS = "font-arabic-kufi text-heading font-bold";

export const PRODUCT_CTA_BUTTON_BASE =
  "group relative overflow-hidden bg-heading font-arabic-kufi font-bold text-ivory transition hover:shadow-xl hover:brightness-110";
