import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function LegacyProductPage({ searchParams }: Props) {
  const { slug = "collagen-glow" } = await searchParams;
  const resolved =
    slug === "glow"
      ? "collagen-glow"
      : slug === "detox-cleanse"
        ? "feminine-balance"
        : slug;
  redirect(`/product/${encodeURIComponent(resolved)}`);
}
