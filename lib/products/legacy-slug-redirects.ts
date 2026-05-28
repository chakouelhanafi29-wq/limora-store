/** Legacy product URLs that must redirect — not official store products. */
export const LEGACY_PRODUCT_SLUG_REDIRECTS: Record<string, string> = {
  glow: "collagen-glow",
  "detox-cleanse": "feminine-balance",
};

export function resolveLegacyProductSlug(slug: string): string {
  return LEGACY_PRODUCT_SLUG_REDIRECTS[slug] ?? slug;
}

export function getLegacyProductRedirectPath(slug: string): string | null {
  const target = LEGACY_PRODUCT_SLUG_REDIRECTS[slug];
  return target ? `/product/${target}` : null;
}

export function isLegacyProductSlug(slug: string): boolean {
  return slug in LEGACY_PRODUCT_SLUG_REDIRECTS;
}
