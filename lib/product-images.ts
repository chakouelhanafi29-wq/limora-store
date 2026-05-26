export const OFFICIAL_PRODUCT_SLUGS = [
  "collagen-glow",
  "hair-revive",
  "detox-cleanse",
] as const;

export type OfficialProductSlug = (typeof OFFICIAL_PRODUCT_SLUGS)[number];

export const COLLAGEN_GLOW_GALLERY = [
  "/products/collagen-glow/hero.webp",
  "/products/collagen-glow/01-before-after-hero.webp",
] as const;

export const HAIR_REVIVE_GALLERY = ["/products/hair-revive/hero.webp"] as const;

export const DETOX_CLEANSE_GALLERY = ["/products/detox-cleanse/hero.webp"] as const;

export const COLLAGEN_GLOW_PRIMARY_IMAGE = COLLAGEN_GLOW_GALLERY[0];
export const HAIR_REVIVE_PRIMARY_IMAGE = HAIR_REVIVE_GALLERY[0];
export const DETOX_CLEANSE_PRIMARY_IMAGE = DETOX_CLEANSE_GALLERY[0];

const GALLERY_BY_SLUG: Record<string, readonly string[]> = {
  "collagen-glow": COLLAGEN_GLOW_GALLERY,
  "hair-revive": HAIR_REVIVE_GALLERY,
  "detox-cleanse": DETOX_CLEANSE_GALLERY,
};

export type ProductImageRecord = {
  url: string;
  sort_order?: number | null;
  is_primary?: boolean | null;
};

export function getProductGalleryBySlug(slug: string): string[] {
  return [...(GALLERY_BY_SLUG[slug] ?? COLLAGEN_GLOW_GALLERY)];
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

export function resolvePrimaryProductImage(
  dbImages: ProductImageRecord[] | undefined | null,
  fallback: string = COLLAGEN_GLOW_PRIMARY_IMAGE,
): string {
  return resolveProductGalleryImages(dbImages, [fallback])[0] ?? fallback;
}
