import type { FeaturedProductCard } from "@/lib/storefront";
import FeaturedProductsSection from "@/app/components/home/FeaturedProductsSection";

type Props = {
  products: FeaturedProductCard[];
};

export default function Products({ products }: Props) {
  return <FeaturedProductsSection products={products} />;
}
