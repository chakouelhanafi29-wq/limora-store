import { unstable_noStore as noStore } from "next/cache";
import { resolveProductSlug } from "@/lib/products/catalog";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProductPageConfig } from "./types";

export type FetchSavedProductPageConfigResult = {
  config: ProductPageConfig | null;
  rowSlug: string | null;
  fetchError: string | null;
};

function isConfigRecord(value: unknown): value is ProductPageConfig {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function fetchSavedProductPageConfig(
  slug: string,
  productId?: string | null,
): Promise<FetchSavedProductPageConfigResult> {
  noStore();

  if (!isSupabaseConfigured()) {
    return { config: null, rowSlug: null, fetchError: null };
  }

  const resolvedSlug = resolveProductSlug(slug);
  const supabase = await createClient();
  const slugCandidates = [
    resolvedSlug,
    slug !== resolvedSlug ? slug : null,
    resolvedSlug === "collagen-glow" ? "glow" : null,
  ].filter((value): value is string => Boolean(value));

  let lastError: string | null = null;

  for (const candidate of slugCandidates) {
    const { data, error } = await supabase
      .from("product_page_configs")
      .select("config, slug")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      lastError = error.message;
      continue;
    }

    if (isConfigRecord(data?.config)) {
      return {
        config: data.config,
        rowSlug: data.slug,
        fetchError: null,
      };
    }
  }

  if (productId) {
    const { data, error } = await supabase
      .from("product_page_configs")
      .select("config, slug")
      .eq("product_id", productId)
      .maybeSingle();

    if (error) {
      lastError = error.message;
    } else if (isConfigRecord(data?.config)) {
      return {
        config: data.config,
        rowSlug: data.slug,
        fetchError: null,
      };
    }
  }

  return { config: null, rowSlug: null, fetchError: lastError };
}
