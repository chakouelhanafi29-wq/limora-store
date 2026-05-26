import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadBuilderImage(
  supabase: SupabaseClient,
  slug: string,
  file: File,
  folder = "builder",
): Promise<string | null> {
  const safeName = file.name.replace(/\s+/g, "-");
  const path = `${folder}/${slug}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);

  if (error) {
    alert(error.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  return publicUrl;
}
