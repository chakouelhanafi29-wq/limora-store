export type HomeSectionType =
  | "announcement_bar"
  | "hero"
  | "products"
  | "before_after"
  | "benefits"
  | "reviews"
  | "faq"
  | "brand_story"
  | "promo_banner"
  | "countdown_banner"
  | "footer";

export type HomeSection = {
  id: string;
  type: HomeSectionType;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
};

export type HomePageTheme = {
  accentColor: string;
  buttonStyle: "rounded-full" | "rounded-xl";
  heroGradient: "luxury" | "soft" | "minimal";
  sectionSpacing: "compact" | "normal" | "spacious";
  sectionBackground: "ivory" | "beige" | "white";
};

export type HomePageMobile = {
  spacingScale: number;
  fontScale: number;
  sectionOrder: string[] | null;
};

export type HomeNavbar = {
  brandName: string;
  ctaLabel: string;
  ctaHref: string;
  links: { href: string; label: string }[];
};

export type HomePageConfig = {
  slug: string;
  navbar: HomeNavbar;
  sections: HomeSection[];
  theme: HomePageTheme;
  mobile: HomePageMobile;
};

export const HOME_SECTION_LABELS: Record<HomeSectionType, string> = {
  announcement_bar: "شريط الإعلانات",
  hero: "Hero",
  products: "عرض المنتجات",
  before_after: "قبل / بعد",
  benefits: "لماذا LIMORA",
  reviews: "آراء العملاء",
  faq: "الأسئلة الشائعة",
  brand_story: "قصة العلامة",
  promo_banner: "بانر ترويجي",
  countdown_banner: "عدّاد تنازلي",
  footer: "Footer",
};
