import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isOfficialProductSlug, resolveProductSlug } from "@/lib/products/catalog";
import { isAdminUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slug = "collagen-glow";
  try {
    const body = (await request.json()) as { slug?: string };
    slug = resolveProductSlug(String(body.slug ?? ""));
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isOfficialProductSlug(slug)) {
    return NextResponse.json({ error: "Invalid product slug" }, { status: 400 });
  }

  revalidatePath(`/product/${slug}`);
  return NextResponse.json({ revalidated: true, slug });
}
