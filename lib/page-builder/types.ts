export type SectionType =
  | "problem_solution"
  | "benefits"
  | "transformation"
  | "comparison"
  | "reviews"
  | "how_to_use"
  | "ingredients"
  | "faq"
  | "guarantee"
  | "related_products";

export type PageSection = {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
};

export type ProductPageTheme = {
  accentColor: string;
  buttonStyle: "rounded-full" | "rounded-xl";
  heroGradient: "luxury" | "soft" | "minimal";
  sectionSpacing: "compact" | "normal" | "spacious";
  sectionBackground: "ivory" | "beige" | "white";
};

export type ProductPageMobile = {
  ctaSize: "sm" | "md" | "lg";
  imageAspect: "square" | "portrait";
  sectionOrder: string[] | null;
  spacingScale: number;
};

export type ProductPageHero = {
  nameAr: string;
  nameEn: string;
  subtitle: string;
  rating: number;
  reviewCount: number;
  bullets: string[];
  urgency: string;
  images: string[];
  codTrust: string[];
  ctaLabel: string;
};

export type BuilderOffer = {
  id: string;
  label: string;
  displayLabel: string;
  quantity: number;
  price: number;
  badge: string | null;
  recommended: boolean;
  savingsText: string | null;
};

export type OrderModalConfig = {
  title: string;
  subtitle: string;
  submitLabel: string;
  trustLine: string;
};

export type StickyBarConfig = {
  enabled: boolean;
  messages: string[];
};

export type ProductPageConfig = {
  slug: string;
  hero: ProductPageHero;
  offers: BuilderOffer[];
  orderModal: OrderModalConfig;
  stickyBar: StickyBarConfig;
  sections: PageSection[];
  theme: ProductPageTheme;
  mobile: ProductPageMobile;
};

export type ProductPageConfigRow = {
  id: string;
  slug: string;
  config: ProductPageConfig;
  created_at: string;
  updated_at: string;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  problem_solution: "المشكلة والحل",
  benefits: "الفوائد",
  transformation: "قبل / بعد",
  comparison: "المقارنة",
  reviews: "التقييمات",
  how_to_use: "طريقة الاستخدام",
  ingredients: "المكونات",
  faq: "الأسئلة الشائعة",
  guarantee: "الضمان",
  related_products: "منتجات ذات صلة",
};
