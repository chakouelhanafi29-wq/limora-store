import {
  DETOX_CLEANSE_PRIMARY_IMAGE,
  HAIR_REVIVE_PRIMARY_IMAGE,
  OFFICIAL_PRODUCT_SLUGS,
  type OfficialProductSlug,
} from "@/lib/product-images";
import { REVIEW_AVATARS } from "@/lib/review-images";
import { buildStaticTemplateConfig as buildCollagenTemplate } from "@/lib/page-builder/section-templates";
import type { PageSection, ProductPageConfig } from "@/lib/page-builder/types";

export { OFFICIAL_PRODUCT_SLUGS, type OfficialProductSlug };

export function isOfficialProductSlug(slug: string): slug is OfficialProductSlug {
  return OFFICIAL_PRODUCT_SLUGS.includes(slug as OfficialProductSlug);
}

function patchSection(
  sections: PageSection[],
  type: PageSection["type"],
  content: Record<string, unknown>,
): PageSection[] {
  return sections.map((section) =>
    section.type === type ? { ...section, content } : section,
  );
}

const hairSections = (sections: PageSection[]) =>
  patchSection(
    patchSection(
      patchSection(
        patchSection(sections, "problem_solution", {
          label: "HAIR CONCERNS",
          title: "هل تعانين من هذه المشاكل؟",
          problems: [
            {
              title: "تساقط الشعر",
              description: "خصلات تتساقط يومياً… وتقلق يزداد.",
            },
            {
              title: "شعر خفيف",
              description: "كثافة تقل… والمظهر يفقد حيويته.",
            },
            {
              title: "شعر ضعيف",
              description: "يتكسر بسهولة… ولا يتحمل التصفيف.",
            },
            {
              title: "بطء النمو",
              description: "شعركِ لا ينمو بالسرعة التي تستحقينها.",
            },
          ],
          solution: {
            title: "LIMORA Hair Revive — نمو وتقوية من الداخل",
            description:
              "كولاجين + بيوتين + كيراتين + زنك + سيليكا + فيتامين E — تركيبة لنمو الشعر وتقويته.",
            highlights: [
              "تحفيز نمو الشعر من الجذور",
              "شعر أقوى وأقل تساقطاً",
              "كثافة ولمعان طبيعي",
            ],
          },
        }),
        "benefits",
        {
          label: "YOUR HAIR",
          title: "ما الذي ستحصلين عليه؟",
          subtitle: "LIMORA Hair Revive — لشعر أكثر كثافة، قوة وصحة.",
          items: [
            {
              icon: "🌿",
              title: "تحفيز نمو الشعر",
              description: "من الجذور… نتائج تُلاحظ مع الاستمرار",
            },
            {
              icon: "💪",
              title: "شعر أقوى",
              description: "كيراتين وكولاجين لتقوية الخصلات",
            },
            {
              icon: "✨",
              title: "تقليل التساقط",
              description: "بيوتين وزنك لدعم صحة الشعر",
            },
            {
              icon: "👑",
              title: "كثافة ولمعان",
              description: "مظهر حيوي… بثقة أنثوية",
            },
          ],
        },
      ),
      "comparison",
      {
        label: "WHY LIMORA",
        title: "لماذا LIMORA Hair Revive؟",
        subtitle: "تركيبة نمو وتقوية… مصممة للمرأة التي تستحق الأفضل.",
        rows: [
          { feature: "كولاجين + بيوتين + كيراتين", limora: true, others: false },
          { feature: "زنك + سيليكا + فيتامين E", limora: true, others: false },
          { feature: "سهل الاستخدام يومياً", limora: true, others: false },
          { feature: "نتائج تُلاحظ خلال أسابيع", limora: true, others: false },
        ],
      },
    ),
    "reviews",
    {
      label: "CUSTOMER LOVE",
      title: "آراء عميلات Hair Revive",
      items: [
        {
          name: "ريم الشمري",
          location: "جدة",
          rating: 5,
          text: "تساقط شعري كان يقلقني. Hair Revive خلّاني أشوف كثافة حقيقية خلال شهر — والدفع عند الاستلام خلّاني أجرب بدون تردد.",
          image: REVIEW_AVATARS.reem,
        },
        {
          name: "هند الزهراني",
          location: "مكة",
          rating: 5,
          text: "شعري صار أقوى وأقل تساقطاً. الذوبان سهل — أضيفه لسموثي كل صباح.",
          image: REVIEW_AVATARS.hind,
        },
      ],
    },
  );

const detoxSections = (sections: PageSection[]) =>
  patchSection(
    patchSection(
      patchSection(
        patchSection(sections, "problem_solution", {
          label: "WELLNESS CONCERNS",
          title: "هل تعانين من هذه المشاكل؟",
          problems: [
            {
              title: "الانتفاخ",
              description: "ثقل بعد الوجبات… وبطن غير مريح.",
            },
            {
              title: "بطء الهضم",
              description: "شعور بالثقل… وعدم راحة يومية.",
            },
            {
              title: "عدم التوازن",
              description: "جسمكِ يحتاج تنظيفاً لطيفاً من الداخل.",
            },
            {
              title: "تعب داخلي",
              description: "طاقة أقل… وشعور بعدم الخفة.",
            },
          ],
          solution: {
            title: "LIMORA Detox Cleanse — توازن من الداخل",
            description:
              "خليط أخضر + بريبيوتيك + ألياف + إنزيمات + فيتامينات — دعم يومي للتخلص من السموم والانتفاخ.",
            highlights: [
              "تنظيف الجسم بلطف",
              "تقليل الانتفاخ",
              "تحسين الهضم والتوازن",
            ],
          },
        }),
        "benefits",
        {
          label: "YOUR BALANCE",
          title: "ما الذي ستحصلين عليه؟",
          subtitle: "LIMORA Detox Cleanse — لبطن مسطح وتوازن داخلي.",
          items: [
            {
              icon: "🍃",
              title: "تنظيف الجسم",
              description: "خليط أخضر فاخر… بلطف يومي",
            },
            {
              icon: "💫",
              title: "تقليل الانتفاخ",
              description: "ألياف وبريبيوتيك لراحة أفضل",
            },
            {
              icon: "🌸",
              title: "تحسين الهضم",
              description: "إنزيمات لفوائد يومية ملموسة",
            },
            {
              icon: "✨",
              title: "توازن داخلي",
              description: "خفّفي… توازني… أشرقي",
            },
          ],
        },
      ),
      "comparison",
      {
        label: "WHY LIMORA",
        title: "لماذا LIMORA Detox Cleanse؟",
        subtitle: "تركيبة تنظيف وتوازن… مصممة للعناية اليومية.",
        rows: [
          { feature: "خليط أخضر + بريبيوتيك", limora: true, others: false },
          { feature: "ألياف + إنزيمات + فيتامينات", limora: true, others: false },
          { feature: "دعم يومي لطيف", limora: true, others: false },
          { feature: "نتائج تُحسّينها تدريجياً", limora: true, others: false },
        ],
      },
    ),
    "reviews",
    {
      label: "CUSTOMER LOVE",
      title: "آراء عميلات Detox Cleanse",
      items: [
        {
          name: "مريم القحطاني",
          location: "الدمام",
          rating: 5,
          text: "Detox Cleanse هو اللي كنت أدور عليه — بطن أخف وتوازن يومي. أحس بخفة من الأسبوع الأول.",
          image: REVIEW_AVATARS.maryam,
        },
        {
          name: "دانة المطيري",
          location: "الطائف",
          rating: 5,
          text: "الانتفاخ بعد الوجبات قل كثير. المذاق لطيف والاستخدام سهل — صار جزء من روتيني.",
          image: REVIEW_AVATARS.dana,
        },
      ],
    },
  );

const hairReviveConfig = (): ProductPageConfig => {
  const base = buildCollagenTemplate("hair-revive");
  return {
    ...base,
    slug: "hair-revive",
    sections: hairSections(base.sections),
    hero: {
      nameAr: "LIMORA Hair Revive",
      nameEn: "LIMORA Hair Revive",
      subtitle: "تركيبة لنمو الشعر وتقويته — لشعر أكثر كثافة، قوة وصحة",
      emotionalHook: "شعركِ يستحق أن يُروى… من الداخل",
      rating: 4.9,
      reviewCount: 2180,
      bullets: [
        "تحفيز نمو الشعر من الجذور",
        "شعر أقوى وأقل تساقطاً",
        "كثافة ولمعان طبيعي",
        "كولاجين + بيوتين + كيراتين + زنك",
      ],
      urgency: "✨ الأكثر طلباً — عرض قطعتين بـ 349 ر.س + شحن مجاني",
      images: [HAIR_REVIVE_PRIMARY_IMAGE],
      codTrust: ["شحن مجاني", "دفع عند الاستلام", "ضمان الجودة", "دعم العملاء"],
      ctaLabel: "أطلب الآن الدفع عند الاستلام",
    },
    offers: [
      {
        id: "1",
        label: "قطعة واحدة",
        displayLabel: "عرض قطعة واحدة",
        quantity: 1,
        price: 249,
        badge: null,
        recommended: false,
        savingsText: null,
      },
      {
        id: "2",
        label: "قطعتان",
        displayLabel: "عرض قطعتين",
        quantity: 2,
        price: 349,
        badge: "الأكثر طلباً",
        recommended: true,
        savingsText: null,
      },
      {
        id: "3",
        label: "3 قطع",
        displayLabel: "عرض 3 قطع",
        quantity: 3,
        price: 449,
        badge: "أفضل قيمة",
        recommended: false,
        savingsText: null,
      },
    ],
    stickyBar: {
      enabled: true,
      messages: [
        "LIMORA Hair Revive — نمو وتقوية من الداخل",
        "شحن مجاني + الدفع عند الاستلام",
        "نتائج تُلاحظ خلال أسابيع",
      ],
    },
    theme: {
      accentColor: "#C4A574",
      buttonStyle: "rounded-full",
      heroGradient: "luxury",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
  };
};

const detoxCleanseConfig = (): ProductPageConfig => {
  const base = buildCollagenTemplate("detox-cleanse");
  return {
    ...base,
    slug: "detox-cleanse",
    sections: detoxSections(base.sections),
    hero: {
      nameAr: "LIMORA Detox Cleanse",
      nameEn: "LIMORA Detox Cleanse",
      subtitle: "دعم يومي للتخلص من السموم والانتفاخ — لبطن مسطح وتوازن داخلي",
      emotionalHook: "خفّفي… توازني… أشرقي من الداخل",
      rating: 4.8,
      reviewCount: 1840,
      bullets: [
        "تنظيف الجسم بلطف يومياً",
        "تقليل الانتفاخ والثقل",
        "تحسين الهضم والتوازن الداخلي",
        "خليط أخضر + بريبيوتيك + ألياف",
      ],
      urgency: "✨ عرض قطعتين بـ 329 ر.س — شحن مجاني + COD",
      images: [DETOX_CLEANSE_PRIMARY_IMAGE],
      codTrust: ["شحن مجاني", "دفع عند الاستلام", "ضمان الجودة", "دعم العملاء"],
      ctaLabel: "أطلب الآن الدفع عند الاستلام",
    },
    offers: [
      {
        id: "1",
        label: "قطعة واحدة",
        displayLabel: "عرض قطعة واحدة",
        quantity: 1,
        price: 229,
        badge: null,
        recommended: false,
        savingsText: null,
      },
      {
        id: "2",
        label: "قطعتان",
        displayLabel: "عرض قطعتين",
        quantity: 2,
        price: 329,
        badge: "الأكثر طلباً",
        recommended: true,
        savingsText: null,
      },
      {
        id: "3",
        label: "3 قطع",
        displayLabel: "عرض 3 قطع",
        quantity: 3,
        price: 429,
        badge: "أفضل قيمة",
        recommended: false,
        savingsText: null,
      },
    ],
    stickyBar: {
      enabled: true,
      messages: [
        "LIMORA Detox Cleanse — توازن من الداخل",
        "شحن مجاني + الدفع عند الاستلام",
        "خفّفي واشعري بالفرق",
      ],
    },
    theme: {
      accentColor: "#7A9B76",
      buttonStyle: "rounded-full",
      heroGradient: "soft",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
  };
};

export function getStaticProductPageConfig(slug: string): ProductPageConfig | null {
  if (slug === "collagen-glow" || slug === "glow") {
    return buildCollagenTemplate("collagen-glow");
  }
  if (slug === "hair-revive") return hairReviveConfig();
  if (slug === "detox-cleanse") return detoxCleanseConfig();
  return null;
}

export function resolveProductSlug(slug: string): string {
  return slug === "glow" ? "collagen-glow" : slug;
}
