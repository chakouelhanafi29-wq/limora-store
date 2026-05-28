import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getOfficialProductSeed,
  missingOfficialProductSlugs,
  OFFICIAL_PRODUCT_SEEDS,
  type OfficialProductSeed,
} from "@/lib/products/official-product-seed";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

type SyncResult = {
  ok: boolean;
  error?: string;
  inserted: string[];
  migrated: string[];
};

async function migrateLegacyDetoxProduct(
  supabase: SupabaseClient,
): Promise<{ migrated: boolean; error?: string }> {
  const { data: products, error: readError } = await supabase
    .from("products")
    .select("id, slug")
    .in("slug", ["detox-cleanse", "feminine-balance"]);

  if (readError) {
    return { migrated: false, error: readError.message };
  }

  const detox = products?.find((product) => product.slug === "detox-cleanse");
  const feminine = products?.find((product) => product.slug === "feminine-balance");

  if (!detox || feminine) {
    return { migrated: false };
  }

  const seed = getOfficialProductSeed("feminine-balance");
  if (!seed) return { migrated: false };

  const { error } = await supabase
    .from("products")
    .update({
      slug: seed.slug,
      name_ar: seed.name_ar,
      name_en: seed.name_en,
      subtitle: seed.subtitle,
      description: seed.description,
      price: seed.price,
      original_price: seed.original_price,
      badge: seed.badge,
      is_featured: seed.is_featured,
      is_active: seed.is_active,
      sort_order: seed.sort_order,
      bullets: seed.bullets,
      urgency_text: seed.urgency_text,
    })
    .eq("id", detox.id);

  if (error) {
    return { migrated: false, error: error.message };
  }

  await supabase
    .from("product_page_configs")
    .update({ slug: seed.slug })
    .eq("slug", "detox-cleanse");

  return { migrated: true };
}

async function ensureProductRelations(
  supabase: SupabaseClient,
  productId: string,
  seed: OfficialProductSeed,
): Promise<string | undefined> {
  const { count: imageCount, error: imageCountError } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (imageCountError) return imageCountError.message;

  if (!imageCount) {
    const { error } = await supabase.from("product_images").insert(
      seed.images.map((image) => ({
        product_id: productId,
        url: image.url,
        storage_path: image.storage_path,
        sort_order: image.sort_order,
        is_primary: image.is_primary,
      })),
    );
    if (error) return error.message;
  }

  const { data: existingOffers, error: offersError } = await supabase
    .from("product_offers")
    .select("quantity")
    .eq("product_id", productId);

  if (offersError) return offersError.message;

  const existingQuantities = new Set(
    (existingOffers ?? []).map((offer) => Number(offer.quantity)),
  );

  const missingOffers = seed.offers.filter(
    (offer) => !existingQuantities.has(offer.quantity),
  );

  if (missingOffers.length) {
    const { error } = await supabase.from("product_offers").insert(
      missingOffers.map((offer) => ({
        product_id: productId,
        label: offer.label,
        display_label: offer.display_label,
        quantity: offer.quantity,
        price: offer.price,
        badge: offer.badge,
        is_recommended: offer.is_recommended,
        sort_order: offer.sort_order,
      })),
    );
    if (error) return error.message;
  }

  return undefined;
}

async function insertOfficialProduct(
  supabase: SupabaseClient,
  seed: OfficialProductSeed,
): Promise<{ id?: string; error?: string }> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: seed.slug,
      name_ar: seed.name_ar,
      name_en: seed.name_en,
      subtitle: seed.subtitle,
      description: seed.description,
      price: seed.price,
      original_price: seed.original_price,
      badge: seed.badge,
      is_featured: seed.is_featured,
      is_active: seed.is_active,
      sort_order: seed.sort_order,
      bullets: seed.bullets,
      urgency_text: seed.urgency_text,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { error: error?.message ?? "Failed to insert product" };
  }

  const relationError = await ensureProductRelations(supabase, data.id, seed);
  if (relationError) {
    return { error: relationError };
  }

  return { id: data.id };
}

async function ensureOfficialProductsSyncedFallback(
  supabase: SupabaseClient,
): Promise<SyncResult> {
  const result: SyncResult = {
    ok: true,
    inserted: [],
    migrated: [],
  };

  const migration = await migrateLegacyDetoxProduct(supabase);
  if (migration.error) {
    return { ok: false, error: migration.error, inserted: [], migrated: [] };
  }
  if (migration.migrated) {
    result.migrated.push("detox-cleanse→feminine-balance");
  }

  const { data: existingProducts, error: readError } = await supabase
    .from("products")
    .select("id, slug");

  if (readError) {
    return { ok: false, error: readError.message, inserted: [], migrated: [] };
  }

  const bySlug = new Map(
    (existingProducts ?? []).map((product) => [product.slug, product.id]),
  );

  for (const seed of OFFICIAL_PRODUCT_SEEDS) {
    const productId = bySlug.get(seed.slug);

    if (!productId) {
      const inserted = await insertOfficialProduct(supabase, seed);
      if (inserted.error) {
        return {
          ok: false,
          error: inserted.error,
          inserted: result.inserted,
          migrated: result.migrated,
        };
      }
      result.inserted.push(seed.slug);
      continue;
    }

    const relationError = await ensureProductRelations(
      supabase,
      productId,
      seed,
    );
    if (relationError) {
      return {
        ok: false,
        error: relationError,
        inserted: result.inserted,
        migrated: result.migrated,
      };
    }
  }

  return result;
}

export async function ensureOfficialProductsSynced(): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true, inserted: [], migrated: [] };
  }

  const supabase = await createClient();

  const { error: rpcError } = await supabase.rpc("ensure_official_limora_products");
  if (!rpcError) {
    return { ok: true, inserted: [], migrated: [] };
  }

  return ensureOfficialProductsSyncedFallback(supabase);
}

export async function getMissingOfficialProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("products").select("slug");
  const slugs = (data ?? []).map((product) => product.slug);
  return missingOfficialProductSlugs(slugs);
}
