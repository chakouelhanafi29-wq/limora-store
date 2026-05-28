import {
  COLLAGEN_GLOW_PRIMARY_IMAGE,
  FEMININE_BALANCE_PRIMARY_IMAGE,
  HAIR_REVIVE_PRIMARY_IMAGE,
  OFFICIAL_PRODUCT_SLUGS,
  type OfficialProductSlug,
} from "@/lib/product-images";

export type RelatedProductCard = {
  id: string;
  name: string;
  nameEn: string;
  benefit: string;
  price: string;
  image: string;
  href: string;
};

const RELATED_PRODUCT_CATALOG: Record<OfficialProductSlug, RelatedProductCard> = {
  "collagen-glow": {
    id: "collagen-glow",
    name: "LIMORA Collagen Glow",
    nameEn: "LIMORA Collagen Glow",
    benefit: "بشرة متوهجة… مرونة وشباب من الداخل",
    price: "199",
    image: COLLAGEN_GLOW_PRIMARY_IMAGE,
    href: "/product/collagen-glow",
  },
  "hair-revive": {
    id: "hair-revive",
    name: "LIMORA Hair Revive",
    nameEn: "LIMORA Hair Revive",
    benefit: "شعرٌ أكثف… وقوة من الجذور",
    price: "249",
    image: HAIR_REVIVE_PRIMARY_IMAGE,
    href: "/product/hair-revive",
  },
  "feminine-balance": {
    id: "feminine-balance",
    name: "LIMORA Feminine Balance",
    nameEn: "LIMORA Feminine Balance",
    benefit: "انتعاش أنثوي… وثقة يومية",
    price: "229",
    image: FEMININE_BALANCE_PRIMARY_IMAGE,
    href: "/product/feminine-balance",
  },
};

export function getRelatedProductsForSlug(
  currentSlug: string,
): RelatedProductCard[] {
  return OFFICIAL_PRODUCT_SLUGS.filter((slug) => slug !== currentSlug).map(
    (slug) => RELATED_PRODUCT_CATALOG[slug],
  );
}
