import {
  COLLAGEN_GLOW_GALLERY,
  FEMININE_BALANCE_GALLERY,
  HAIR_REVIVE_GALLERY,
  OFFICIAL_PRODUCT_SLUGS,
  type OfficialProductSlug,
} from "@/lib/product-images";

type ProductImageSeed = {
  url: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
};

type ProductOfferSeed = {
  label: string;
  display_label: string;
  quantity: number;
  price: number;
  badge: string | null;
  is_recommended: boolean;
  sort_order: number;
};

export type OfficialProductSeed = {
  slug: OfficialProductSlug;
  name_ar: string;
  name_en: string;
  subtitle: string;
  description: string;
  price: number;
  original_price: number;
  badge: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  bullets: string[];
  urgency_text: string;
  images: ProductImageSeed[];
  offers: ProductOfferSeed[];
};

function galleryToImageSeeds(
  slug: OfficialProductSlug,
  gallery: readonly string[],
): ProductImageSeed[] {
  return gallery.map((url, index) => ({
    url,
    storage_path: url.replace(/^\//, ""),
    sort_order: index + 1,
    is_primary: index === 0,
  }));
}

export const OFFICIAL_PRODUCT_SEEDS: OfficialProductSeed[] = [
  {
    slug: "collagen-glow",
    name_ar: "LIMORA Collagen Glow",
    name_en: "LIMORA Collagen Glow",
    subtitle: "كولاجين بحري فاخر — لبشرة متوهجة، أكثر تماسكاً وشباباً ✨",
    description:
      "كولاجين بحري فاخر + فيتامين C + بيوتين + هيالورونيك أسيد — لبشرة متوهجة، مرنة، وأكثر شباباً.",
    price: 199,
    original_price: 289,
    badge: "الأكثر طلباً",
    is_featured: true,
    is_active: true,
    sort_order: 1,
    bullets: [
      "بشرة متوهجة ومرنة",
      "كولاجين بحري فاخر",
      "فيتامين C + بيوتين + هيالورونيك",
      "سهل الاستخدام يومياً",
    ],
    urgency_text: "✨ العرض الأقوى — عرض قطعتين بـ 249 ر.س + شحن مجاني",
    images: galleryToImageSeeds("collagen-glow", COLLAGEN_GLOW_GALLERY),
    offers: [
      {
        label: "قطعة واحدة",
        display_label: "عرض قطعة واحدة",
        quantity: 1,
        price: 199,
        badge: null,
        is_recommended: false,
        sort_order: 1,
      },
      {
        label: "قطعتان",
        display_label: "عرض قطعتين",
        quantity: 2,
        price: 249,
        badge: "الأكثر طلباً",
        is_recommended: true,
        sort_order: 2,
      },
      {
        label: "3 قطع",
        display_label: "عرض 3 قطع",
        quantity: 3,
        price: 299,
        badge: "أفضل قيمة",
        is_recommended: false,
        sort_order: 3,
      },
    ],
  },
  {
    slug: "hair-revive",
    name_ar: "LIMORA Hair Revive",
    name_en: "LIMORA Hair Revive",
    subtitle: "تركيبة لنمو الشعر وتقويته — لشعر أكثر كثافة، قوة وصحة",
    description:
      "كولاجين + بيوتين + كيراتين + زنك + سيليكا + فيتامين E — لنمو الشعر وتقويته.",
    price: 249,
    original_price: 329,
    badge: "الأكثر مبيعاً",
    is_featured: true,
    is_active: true,
    sort_order: 2,
    bullets: [
      "تحفيز نمو الشعر",
      "شعر أقوى وأقل تساقطاً",
      "كثافة ولمعان طبيعي",
      "كولاجين + بيوتين + كيراتين",
    ],
    urgency_text: "✨ عرض قطعتين بـ 349 ر.س + شحن مجاني",
    images: galleryToImageSeeds("hair-revive", HAIR_REVIVE_GALLERY),
    offers: [
      {
        label: "قطعة واحدة",
        display_label: "عرض قطعة واحدة",
        quantity: 1,
        price: 249,
        badge: null,
        is_recommended: false,
        sort_order: 1,
      },
      {
        label: "قطعتان",
        display_label: "عرض قطعتين",
        quantity: 2,
        price: 349,
        badge: "الأكثر طلباً",
        is_recommended: true,
        sort_order: 2,
      },
      {
        label: "3 قطع",
        display_label: "عرض 3 قطع",
        quantity: 3,
        price: 449,
        badge: "أفضل قيمة",
        is_recommended: false,
        sort_order: 3,
      },
    ],
  },
  {
    slug: "feminine-balance",
    name_ar: "LIMORA Feminine Balance",
    name_en: "LIMORA Feminine Balance",
    subtitle: "دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم",
    description:
      "بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — عناية أنثوية يومية فاخرة.",
    price: 229,
    original_price: 299,
    badge: "حصري",
    is_featured: true,
    is_active: true,
    sort_order: 3,
    bullets: [
      "دعم يومي للتوازن الأنثوي",
      "انتعاش وثقة طوال اليوم",
      "عناية أنثوية لطيفة وفاخرة",
      "بريبيوتيك + بروبيوتيك + Cranberry",
    ],
    urgency_text: "✨ عرض قطعتين بـ 329 ر.س + شحن مجاني",
    images: galleryToImageSeeds("feminine-balance", FEMININE_BALANCE_GALLERY),
    offers: [
      {
        label: "قطعة واحدة",
        display_label: "عرض قطعة واحدة",
        quantity: 1,
        price: 229,
        badge: null,
        is_recommended: false,
        sort_order: 1,
      },
      {
        label: "قطعتان",
        display_label: "عرض قطعتين",
        quantity: 2,
        price: 329,
        badge: "الأكثر طلباً",
        is_recommended: true,
        sort_order: 2,
      },
      {
        label: "3 قطع",
        display_label: "عرض 3 قطع",
        quantity: 3,
        price: 429,
        badge: "أفضل قيمة",
        is_recommended: false,
        sort_order: 3,
      },
    ],
  },
];

export function getOfficialProductSeed(
  slug: OfficialProductSlug,
): OfficialProductSeed | undefined {
  return OFFICIAL_PRODUCT_SEEDS.find((product) => product.slug === slug);
}

export function missingOfficialProductSlugs(existingSlugs: string[]): OfficialProductSlug[] {
  return OFFICIAL_PRODUCT_SLUGS.filter((slug) => !existingSlugs.includes(slug));
}
