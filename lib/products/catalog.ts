import { resolveLegacyProductSlug } from "@/lib/products/legacy-slug-redirects";
import {
  OFFICIAL_PRODUCT_SLUGS,
  type OfficialProductSlug,
} from "@/lib/product-images";
import { buildStaticTemplateConfig as buildCollagenTemplate } from "@/lib/page-builder/section-templates";
import { feminineBalanceConfig } from "@/lib/products/feminine-balance-config";
import { hairReviveConfig } from "@/lib/products/hair-revive-config";
import type { ProductPageConfig } from "@/lib/page-builder/types";

export { OFFICIAL_PRODUCT_SLUGS, type OfficialProductSlug };

export function isOfficialProductSlug(slug: string): slug is OfficialProductSlug {
  return OFFICIAL_PRODUCT_SLUGS.includes(slug as OfficialProductSlug);
}

export function getStaticProductPageConfig(slug: string): ProductPageConfig | null {
  if (slug === "collagen-glow" || slug === "glow") {
    return buildCollagenTemplate("collagen-glow");
  }
  if (slug === "hair-revive") return hairReviveConfig();
  if (slug === "feminine-balance") return feminineBalanceConfig();
  return null;
}

export function resolveProductSlug(slug: string): string {
  return resolveLegacyProductSlug(slug);
}
