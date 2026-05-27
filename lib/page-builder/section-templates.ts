import {
  comparison,
  guarantee,
  howToUse,
  offers,
  problemSolution,
  product,
  productBenefits,
  productFaqs,
  productIngredients,
  productReviews,
  qualityTrust,
  relatedProducts,
  resultsTimeline,
  transformation,
} from "@/app/lib/product-data";
import { createDefaultFinalCta } from "@/lib/page-builder/default-final-cta";
import type { ProductWithRelations } from "@/lib/types/database";
import type { PageSection, ProductPageConfig, SectionType } from "./types";

export function createSectionId() {
  return `sec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildStaticTemplateConfig(slug: string): ProductPageConfig {
  const sections: PageSection[] = [
    {
      id: createSectionId(),
      type: "problem_solution",
      enabled: true,
      order: 0,
      content: structuredClone(problemSolution),
    },
    {
      id: createSectionId(),
      type: "transformation",
      enabled: true,
      order: 1,
      content: structuredClone(transformation),
    },
    {
      id: createSectionId(),
      type: "benefits",
      enabled: true,
      order: 2,
      content: structuredClone(productBenefits),
    },
    {
      id: createSectionId(),
      type: "comparison",
      enabled: true,
      order: 3,
      content: structuredClone(comparison),
    },
    {
      id: createSectionId(),
      type: "quality_trust",
      enabled: true,
      order: 4,
      content: structuredClone(qualityTrust),
    },
    {
      id: createSectionId(),
      type: "ingredients",
      enabled: true,
      order: 5,
      content: structuredClone(productIngredients),
    },
    {
      id: createSectionId(),
      type: "reviews",
      enabled: true,
      order: 5,
      content: structuredClone(productReviews),
    },
    {
      id: createSectionId(),
      type: "guarantee",
      enabled: true,
      order: 7,
      content: structuredClone(guarantee),
    },
    {
      id: createSectionId(),
      type: "how_to_use",
      enabled: true,
      order: 7,
      content: structuredClone(howToUse),
    },
    {
      id: createSectionId(),
      type: "faq",
      enabled: true,
      order: 9,
      content: structuredClone(productFaqs),
    },
    {
      id: createSectionId(),
      type: "related_products",
      enabled: false,
      order: 10,
      content: {
        label: "YOU MAY ALSO LOVE",
        title: "منتجات قد تعجبكِ",
        items: relatedProducts,
      },
    },
  ];

  return {
    slug,
    hero: {
      nameAr: product.name,
      nameEn: product.nameEn,
      subtitle: product.subtitle,
      emotionalHook: product.emotionalHook,
      rating: product.rating,
      reviewCount: product.reviewCount,
      bullets: [...product.bullets],
      urgency: product.urgency,
      images: [...product.images],
      codTrust: [...product.codTrust],
      ctaLabel: "أطلب الآن الدفع عند الاستلام",
    },
    offers: offers.map((offer) => ({
      id: offer.id,
      label: offer.label,
      displayLabel:
        offer.quantity === 1
          ? "عرض قطعة واحدة"
          : offer.quantity === 2
            ? "عرض قطعتين"
            : `عرض ${offer.quantity} قطع`,
      quantity: offer.quantity,
      price: offer.price,
      badge: offer.badge,
      recommended: offer.recommended,
      savingsText: null,
    })),
    orderModal: {
      title: "أكّدي طلبكِ",
      subtitle: "دفع عند الاستلام · شحن مجاني",
      submitLabel: "تأكيد الطلب",
      trustLine: "✦ الدفع عند الاستلام · لا حاجة لبطاقة ائتمان",
    },
    stickyBar: {
      enabled: true,
      messages: [
        `${product.nameEn} — ${product.subtitle}`,
        "شحن مجاني + الدفع عند الاستلام",
        "جمالك يبدأ من الداخل",
      ],
    },
    finalCta: createDefaultFinalCta(product.name),
    sections,
    theme: {
      accentColor: "#D4899A",
      buttonStyle: "rounded-full",
      heroGradient: "pink",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
    mobile: {
      ctaSize: "md",
      imageAspect: "square",
      sectionOrder: null,
      spacingScale: 1,
    },
  };
}

export function genericSectionScaffolds(
  product: ProductWithRelations,
): Omit<PageSection, "id" | "order">[] {
  const name = product.name_ar;
  const nameEn = product.name_en;

  return [
    {
      type: "problem_solution",
      enabled: true,
      content: {
        label: "SKIN CONCERNS",
        title: "هل تعانين من هذه المشاكل؟",
        problems: (product.bullets ?? []).slice(0, 5).map((bullet, index) => ({
          icon: ["✨", "💧", "🌸", "💫", "👑"][index % 5],
          title: bullet,
          description: "",
          image: "",
        })),
        solution: {
          title: `${name} — الحل الذي تستحقينه`,
          description: product.description ?? product.subtitle ?? "",
          highlights: product.bullets?.slice(0, 3) ?? [],
        },
      },
    },
    {
      type: "benefits",
      enabled: true,
      content: {
        label: "YOUR BENEFITS",
        title: "ما الذي ستحصلين عليه؟",
        subtitle: `${name} — مصمم لنتائج طبيعية ومتدرجة.`,
        items: (product.bullets ?? ["فائدة 1", "فائدة 2", "فائدة 3"]).map(
          (bullet, index) => ({
            icon: ["✨", "💧", "🌸", "💫", "👑", "💅"][index % 6],
            title: bullet,
            description: "",
          }),
        ),
      },
    },
    {
      type: "transformation",
      enabled: true,
      content: {
        label: "REAL RESULTS",
        title: "تحولٌ حقيقي… قبل وبعد",
        subtitle: `عملاء ${nameEn} يشاركون تجربتهم.`,
        beforeAfter: [],
      },
    },
    {
      type: "results_timeline",
      enabled: true,
      content: structuredClone(resultsTimeline),
    },
    {
      type: "comparison",
      enabled: true,
      content: {
        label: "WHY LIMORA",
        title: `LIMORA vs المنتجات العادية الأخرى`,
        subtitle: "معايير أعلى… بثقة أنثوية هادئة.",
        rows: [
          { feature: "تركيبة فاخرة", limora: true, others: false },
          { feature: "جودة عالية", limora: true, others: false },
          { feature: "سهل الاستخدام", limora: true, others: false },
          { feature: "نتائج طبيعية", limora: true, others: false },
        ],
      },
    },
    {
      type: "quality_trust",
      enabled: true,
      content: structuredClone(qualityTrust),
    },
    {
      type: "reviews",
      enabled: true,
      content: {
        label: "CUSTOMER LOVE",
        title: `آراء عميلات ${nameEn}`,
        items: [],
      },
    },
    {
      type: "how_to_use",
      enabled: true,
      content: {
        label: "HOW TO USE",
        title: "طريقة الاستعمال",
        subtitle: "بسيطة… فاخرة… فعّالة.",
        steps: [
          { step: "01", title: "استخدمي", description: "حسب تعليمات المنتج" },
          { step: "02", title: "استمري", description: "الاستمرار = نتائج أفضل" },
          { step: "03", title: "استمتعي", description: "جمالك يبدأ من الداخل" },
        ],
      },
    },
    {
      type: "ingredients",
      enabled: true,
      content: {
        label: "PREMIUM FORMULA",
        title: "مكونات فاخرة",
        subtitle: "كل مكون مختار بعناية.",
        items: [],
      },
    },
    {
      type: "faq",
      enabled: true,
      content: {
        label: "FAQ",
        title: "الأسئلة الشائعة",
        items: [
          {
            question: "هل الدفع عند الاستلام متاح؟",
            answer: "نعم — COD متاح في جميع مناطق المملكة.",
          },
          {
            question: "كم يستغرق التوصيل؟",
            answer: "الشحن مجاني — عادة 2–4 أيام عمل.",
          },
        ],
      },
    },
    {
      type: "guarantee",
      enabled: true,
      content: {
        label: "OUR PROMISE",
        title: "ضمان LIMORA",
        subtitle: "نثق في منتجاتنا — لذلك نضمن راحتكِ.",
        points: [
          { icon: "🚚", title: "شحن مجاني", description: "توصيل سريع" },
          { icon: "💵", title: "الدفع عند الاستلام", description: "ادفعي عند الاستلام" },
          { icon: "✦", title: "ضمان الجودة", description: "جودة فاخرة" },
          { icon: "💬", title: "دعم العملاء", description: "فريقنا معكِ" },
        ],
      },
    },
    {
      type: "related_products",
      enabled: false,
      content: {
        label: "YOU MAY ALSO LOVE",
        title: "منتجات قد تعجبكِ",
        items: [],
      },
    },
  ];
}

export function createBlankSection(type: SectionType) {
  return {
    id: createSectionId(),
    type,
    enabled: true,
    order: 99,
    content: { label: "", title: "", subtitle: "" },
  };
}
