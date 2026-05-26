export type SectionType =
  | "problem_solution"
  | "benefits"
  | "transformation"
  | "results_timeline"
  | "comparison"
  | "reviews"
  | "how_to_use"
  | "ingredients"
  | "faq"
  | "guarantee"
  | "related_products"
  | "lifestyle";

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
  heroGradient: "luxury" | "soft" | "minimal" | "pink";
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
  emotionalHook?: string;
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

export type FinalCtaConfig = {
  enabled: boolean;
  label: string;
  title: string;
  subtitle: string;
  footnote: string;
  showTrustBadges: boolean;
};

export type ProductPageConfig = {
  slug: string;
  hero: ProductPageHero;
  offers: BuilderOffer[];
  orderModal: OrderModalConfig;
  stickyBar: StickyBarConfig;
  finalCta: FinalCtaConfig;
  sections: PageSection[];
  /** Full page flow order — system blocks + section ids. Null uses hero → offers → sections → final CTA. */
  pageLayoutOrder?: string[] | null;
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
  results_timeline: "متى تظهر النتائج؟",
  comparison: "المقارنة",
  reviews: "التقييمات",
  how_to_use: "طريقة الاستخدام",
  ingredients: "المكونات",
  faq: "الأسئلة الشائعة",
  guarantee: "الضمان",
  related_products: "منتجات ذات صلة",
  lifestyle: "لايف ستايل / Banner",
};
