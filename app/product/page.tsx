import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function LegacyProductPage({ searchParams }: Props) {
  const { slug = "glow" } = await searchParams;
  redirect(`/product/${encodeURIComponent(slug)}`);
}
