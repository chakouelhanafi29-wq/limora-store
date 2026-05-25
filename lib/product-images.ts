export const COLLAGEN_GLOW_GALLERY = [
  "/products/collagen-glow/01-before-after-hero.webp",
  "/products/collagen-glow/02-lifestyle-hijabi.webp",
  "/products/collagen-glow/03-benefits-infographic.webp",
  "/products/collagen-glow/04-transformation.webp",
] as const;

export const COLLAGEN_GLOW_PRIMARY_IMAGE = COLLAGEN_GLOW_GALLERY[0];

export type ProductImageRecord = {
  url: string;
  sort_order?: number | null;
  is_primary?: boolean | null;
};

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
