import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveProductSlug } from "@/lib/products/catalog";
import type { ProductPageConfig } from "./types";

type UpsertResult = {
  ok: boolean;
  error?: string;
  usedProductId: boolean;
};

function isMissingProductIdColumn(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("product_id") &&
    (lower.includes("schema cache") ||
      lower.includes("could not find") ||
      lower.includes("column"))
  );
}

export async function upsertProductPageConfigRow(
  supabase: SupabaseClient,
  slug: string,
  config: ProductPageConfig,
  productId?: string,
): Promise<UpsertResult> {
  const resolvedSlug = resolveProductSlug(slug);
  const payload: Record<string, unknown> = {
    slug: resolvedSlug,
    config: { ...config, slug: resolvedSlug },
  };

  if (productId) {
    payload.product_id = productId;
  }

  const first = await supabase
    .from("product_page_configs")
    .upsert(payload, { onConflict: "slug" });

  if (!first.error) {
    return { ok: true, usedProductId: Boolean(productId) };
  }

  if (productId && isMissingProductIdColumn(first.error.message)) {
    const { product_id: _removed, ...withoutProductId } = payload;
    const retry = await supabase
      .from("product_page_configs")
      .upsert(withoutProductId, { onConflict: "slug" });

    if (!retry.error) {
      return {
        ok: true,
        usedProductId: false,
        error:
          "Saved without product_id — run supabase/product-builder-product-id-migration.sql in Supabase SQL Editor.",
      };
    }

    return { ok: false, error: retry.error.message, usedProductId: false };
  }

  return { ok: false, error: first.error.message, usedProductId: false };
}
