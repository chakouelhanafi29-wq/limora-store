import { resolveLegacyProductSlug } from "@/lib/products/legacy-slug-redirects";

export const OFFICIAL_PRODUCT_SLUGS = [
  "collagen-glow",
  "hair-revive",
  "feminine-balance",
] as const;

export type OfficialProductSlug = (typeof OFFICIAL_PRODUCT_SLUGS)[number];

export const COLLAGEN_GLOW_GALLERY = [
  "/products/collagen-glow/hero.webp",
  "/products/collagen-glow/01-before-after-hero.webp",
] as const;

export const HAIR_REVIVE_GALLERY = ["/products/hair-revive/hero.webp"] as const;

export const FEMININE_BALANCE_GALLERY = ["/products/feminine-balance/hero.webp"] as const;

export const COLLAGEN_GLOW_PRIMARY_IMAGE = COLLAGEN_GLOW_GALLERY[0];
export const HAIR_REVIVE_PRIMARY_IMAGE = HAIR_REVIVE_GALLERY[0];
export const FEMININE_BALANCE_PRIMARY_IMAGE = FEMININE_BALANCE_GALLERY[0];

const GALLERY_BY_SLUG: Record<string, readonly string[]> = {
  "collagen-glow": COLLAGEN_GLOW_GALLERY,
  "hair-revive": HAIR_REVIVE_GALLERY,
  "feminine-balance": FEMININE_BALANCE_GALLERY,
};

export type ProductImageRecord = {
  url: string;
  sort_order?: number | null;
  is_primary?: boolean | null;
};

export function getProductGalleryBySlug(slug: string): string[] {
  const resolved = resolveLegacyProductSlug(slug);
  return [...(GALLERY_BY_SLUG[resolved] ?? COLLAGEN_GLOW_GALLERY)];
}

export function getPrimaryImageBySlug(slug: string): string {
  return getProductGalleryBySlug(slug)[0] ?? COLLAGEN_GLOW_PRIMARY_IMAGE;
}

export function sortProductImages<T extends ProductImageRecord>(images: T[]): T[] {
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

export function resolveProductGalleryImages(
  dbImages: ProductImageRecord[] | undefined | null,
  fallbackImages: string[] = [...COLLAGEN_GLOW_GALLERY],
): string[] {
  if (!dbImages?.length) return fallbackImages;

  const urls = sortProductImages(dbImages)
    .map((image) => image.url)
    .filter(Boolean);

  return urls.length ? urls : fallbackImages;
}

/** Product Builder hero gallery always wins when present. */
export function resolveBuilderGalleryImages(
  builderImages: string[] | undefined | null,
  dbImages?: ProductImageRecord[] | null,
  slug?: string,
): string[] {
  if (builderImages?.length) return builderImages;

  return resolveProductGalleryImages(
    dbImages,
    slug ? getProductGalleryBySlug(slug) : [...COLLAGEN_GLOW_GALLERY],
  );
}

export function resolvePrimaryProductImage(
  dbImages: ProductImageRecord[] | undefined | null,
  fallback: string = COLLAGEN_GLOW_PRIMARY_IMAGE,
): string {
  return resolveProductGalleryImages(dbImages, [fallback])[0] ?? fallback;
}

export function resolveBuilderPrimaryImage(
  builderImages: string[] | undefined | null,
  dbImages?: ProductImageRecord[] | null,
  slug?: string,
): string {
  if (builderImages?.length) return builderImages[0];

  return resolvePrimaryProductImage(
    dbImages,
    slug ? getPrimaryImageBySlug(slug) : COLLAGEN_GLOW_PRIMARY_IMAGE,
  );
}

export function isOfficialProductSlugValue(slug: string): slug is OfficialProductSlug {
  return OFFICIAL_PRODUCT_SLUGS.includes(slug as OfficialProductSlug);
}
