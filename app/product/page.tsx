import { redirect } from "next/navigation";
import { resolveLegacyProductSlug } from "@/lib/products/legacy-slug-redirects";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function LegacyProductPage({ searchParams }: Props) {
  const { slug = "collagen-glow" } = await searchParams;
  const resolved = resolveLegacyProductSlug(slug);
  redirect(`/product/${encodeURIComponent(resolved)}`);
}
