import { HOME_TRANSFORMATION_IMAGES } from "@/lib/home-images";
import { HAIR_REVIVE_PRIMARY_IMAGE } from "@/lib/product-images";
import { getRelatedProductsForSlug } from "@/lib/products/related-products";
import { REVIEW_AVATARS } from "@/lib/review-images";
import {
  buildStaticTemplateConfig as buildCollagenTemplate,
  createSectionId,
} from "@/lib/page-builder/section-templates";
import type { PageSection, ProductPageConfig } from "@/lib/page-builder/types";

function patchSection(
  sections: PageSection[],
  type: PageSection["type"],
  content: Record<string, unknown>,
): PageSection[] {
  return sections.map((section) =>
    section.type === type ? { ...section, content } : section,
  );
}

function hairReviveSections(sections: PageSection[]): PageSection[] {
  let next = patchSection(
    patchSection(
      patchSection(
        patchSection(
          patchSection(
            patchSection(
              patchSection(
                patchSection(
                  patchSection(
                    patchSection(sections, "problem_solution", {
                      label: "HAIR CONCERNS",
                      title: "هل تعانين من هذه المشاكل؟",
                      problems: [
                        {
                          icon: "💇‍♀️",
                          title: "تساقط الشعر",
                          description: "خصلات تتساقط يومياً… وتقلق يزداد.",
                          image: "",
                        },
                        {
                          icon: "😔",
                          title: "شعر خفيف",
                          description: "كثافة تقل… والمظهر يفقد حيويته.",
                          image: "",
                        },
                        {
                          icon: "💔",
                          title: "شعر ضعيف",
                          description: "يتكسر بسهولة… ولا يتحمل التصفيف.",
                          image: "",
                        },
                        {
                          icon: "⏳",
                          title: "بطء النمو",
                          description: "شعركِ لا ينمو بالسرعة التي تستحقينها.",
                          image: "",
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
                        image: "/products/hair-revive/hero.webp",
                        caption: "شعر أقوى… وثقة تعود مع كل يوم 💫",
                      },
                    }),
                    "transformation",
                    {
                      label: "REAL RESULTS",
                      title: "تحولٌ حقيقي… شعر أكثر حياة",
                      subtitle: "نساء سعوديات وثقن بـ Hair Revive — وهذا ما شاركنه.",
                      beforeAfter: [
                        {
                          title: "بداية الرحلة",
                          caption: "تساقط… خفة… ثقة أقل",
                          image: HAIR_REVIVE_PRIMARY_IMAGE,
                        },
                        {
                          title: "بعد 21 يوم",
                          caption: "كثافة… لمعان… شعر أقوى",
                          image: HOME_TRANSFORMATION_IMAGES.hairRevive,
                        },
                      ],
                    },
                  ),
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
                  title: "LIMORA vs المنتجات العادية الأخرى",
                  subtitle: "تركيبة نمو وتقوية… بمعايير أعلى وبثقة هادئة.",
                  rows: [
                    { feature: "كولاجين + بيوتين + كيراتين", limora: true, others: false },
                    { feature: "زنك + سيليكا + فيتامين E", limora: true, others: false },
                    { feature: "سهل الاستخدام يومياً", limora: true, others: false },
                    { feature: "نتائج تُلاحظ خلال أسابيع", limora: true, others: false },
                  ],
                },
              ),
              "quality_trust",
              {
                label: "TRUSTED QUALITY",
                title: "جودة موثوقة ومعتمدة",
                subtitle: "منتج حقيقي… بمعايير جودة تستحقين ثقتكِ",
                reassurance:
                  "Hair Revive ليس مكملاً عشوائياً — بل تركيبة فاخرة لشعر أقوى… بثقة COD.",
                items: [
                  {
                    icon: "🧪",
                    title: "تصنيع بمعايير عالية",
                    description: "تركيبة مصنعة بعناية داخل بيئة احترافية",
                    enabled: true,
                  },
                  {
                    icon: "🇸🇦",
                    title: "منتج محلي موثوق",
                    description: "مصمم لاحتياجات المرأة السعودية",
                    enabled: true,
                  },
                  {
                    icon: "✅",
                    title: "جودة مختبرة",
                    description: "مكونات مختارة بعناية وجودة عالية",
                    enabled: true,
                  },
                  {
                    icon: "🕌",
                    title: "حلال",
                    description: "تركيبة متوافقة مع معايير الحلال",
                    enabled: true,
                  },
                ],
              },
            ),
            "ingredients",
            {
              label: "PREMIUM FORMULA",
              title: "مكونات فاخرة… لشعر أقوى",
              subtitle: "كل مكون مختار لنمو الشعر وتقويته من الداخل.",
              items: [
                { name: "Collagen", benefit: "دعم بنية الشعر", image: "", icon: "✨" },
                { name: "Biotin", benefit: "تقليل التساقط", image: "", icon: "💪" },
                { name: "Keratin", benefit: "قوة ولمعان", image: "", icon: "👑" },
                { name: "Zinc", benefit: "صحة فروة الرأس", image: "", icon: "🌿" },
                { name: "Vitamin E", benefit: "حماية وتغذية", image: "", icon: "🍊" },
              ],
            },
          ),
          "how_to_use",
          {
            label: "HOW TO USE",
            title: "طريقة الاستعمال",
            subtitle: "بسيطة… يومياً… جزء من روتينكِ.",
            steps: [
              {
                step: "01",
                title: "ملعقة واحدة",
                description: "يومياً مع الماء أو العصير",
              },
              {
                step: "02",
                title: "استمري",
                description: "الاستمرار = نتائج أوضح خلال أسابيع",
              },
              {
                step: "03",
                title: "استمتعي",
                description: "شعر أقوى… وثقة تعود",
              },
            ],
          },
        ),
        "faq",
        {
          label: "FAQ",
          title: "الأسئلة الشائعة",
          items: [
            {
              question: "متى ألاحظ فرقاً في الشعر؟",
              answer:
                "كثير من العميلات يلاحظن فرقاً في التساقط واللمعان خلال 2–3 أسابيع مع الاستمرار اليومي.",
            },
            {
              question: "هل Hair Revive مناسب لجميع أنواع الشعر؟",
              answer: "نعم — صُمم لدعم نمو وتقوية الشعر لمعظم أنواع الشعر.",
            },
            {
              question: "هل الدفع عند الاستلام متاح؟",
              answer: "نعم — COD داخل السعودية. اطلبي بثقة وادفعي عند الاستلام.",
            },
            {
              question: "هل المنتج حلال؟",
              answer: "نعم — تركيبة متوافقة مع معايير الحلال.",
            },
          ],
        },
      ),
      "guarantee",
      {
        label: "OUR PROMISE",
        title: "ضمان LIMORA",
        subtitle: "نثق في منتجاتنا — لذلك نضمن راحتكِ.",
        points: [
          { icon: "🛡️", title: "ضمان الجودة", description: "منتج فاخر… بمعايير موثوقة" },
          { icon: "🚚", title: "شحن مجاني", description: "توصيل سريع داخل السعودية" },
          { icon: "💵", title: "دفع عند الاستلام", description: "اطلبي بثقة… وادفعي عند الاستلام" },
          { icon: "💬", title: "دعم سريع", description: "فريقنا جاهز لمساعدتكِ" },
        ],
        ctaSubtitle: "جاهزة لتجربة Hair Revive؟ — اطلبي الآن بالدفع عند الاستلام",
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
          text: "تساقط شعري كان يقلقني. Hair Revive خلّاني أشوف كثافة حقيقية خلال شهر — والدفع عند الاستلام خلّاني أجرب بثقة.",
          image: REVIEW_AVATARS.reem,
        },
        {
          name: "هند الزهراني",
          location: "مكة",
          rating: 5,
          text: "شعري صار أقوى وأقل تساقطاً. الذوبان سهل — أضيفه لسموثي كل صباح.",
          image: REVIEW_AVATARS.hind,
        },
        {
          name: "سارة الحربي",
          location: "جدة",
          rating: 5,
          text: "Hair Revive أعطاني كثافة ولمعان — فرق واضح خلال 3 أسابيع.",
          image: REVIEW_AVATARS.sara,
        },
        {
          name: "لمى الشمري",
          location: "الدمام",
          rating: 5,
          text: "كنت أبحث عن حل للتساقط — هذا المنتج فعلاً ساعدني. COD خلّاني أجرب بدون تردد.",
          image: REVIEW_AVATARS.lama,
        },
      ],
    },
  );

  const timelineContent = {
    label: "YOUR TRANSFORMATION",
    title: "متى تظهر النتائج؟",
    subtitle: "نمو تدريجي… كثافة تتعزز… أسبوعاً بعد أسبوع.",
    weeks: [
      { title: "الأسبوع الأول", description: "بداية تقليل التساقط واللمعان", progress: 25, image: "" },
      { title: "الأسبوع الثاني", description: "شعر أقوى… وأقل تكسر", progress: 50, image: "" },
      { title: "الأسبوع الثالث", description: "كثافة أوضح… وثقة أكبر", progress: 75, image: "" },
      { title: "الأسبوع الرابع", description: "شعر حيوي… تستحقينه", progress: 100, image: "" },
    ],
  };

  if (!next.some((section) => section.type === "results_timeline")) {
    const timelineSection: PageSection = {
      id: createSectionId(),
      type: "results_timeline",
      enabled: true,
      order: 0,
      content: timelineContent,
    };
    const benefitsIndex = next.findIndex((section) => section.type === "benefits");
    const insertAt = benefitsIndex >= 0 ? benefitsIndex : next.length;
    next = [...next.slice(0, insertAt), timelineSection, ...next.slice(insertAt)];
    next = next.map((section, index) => ({ ...section, order: index }));
  } else {
    next = patchSection(next, "results_timeline", timelineContent);
  }

  next = next.map((section) =>
    section.type === "related_products"
      ? {
          ...section,
          enabled: true,
          content: {
            label: "YOU MAY ALSO LOVE",
            title: "منتجات قد تعجبكِ",
            items: getRelatedProductsForSlug("hair-revive"),
          },
        }
      : section,
  );

  return next;
}

export function hairReviveConfig(): ProductPageConfig {
  const base = buildCollagenTemplate("hair-revive");
  return {
    ...base,
    slug: "hair-revive",
    sections: hairReviveSections(base.sections),
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
      codTrust: ["شحن سريع", "دفع عند الاستلام", "ضمان الجودة", "حلال"],
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
        savingsText: "وفر 149 ر.س vs شراء منفصل",
      },
      {
        id: "3",
        label: "3 قطع",
        displayLabel: "عرض 3 قطع",
        quantity: 3,
        price: 449,
        badge: "أفضل قيمة",
        recommended: false,
        savingsText: "وفر 298 ر.س vs شراء منفصل",
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
    finalCta: {
      enabled: true,
      label: "FINAL STEP",
      title: "جاهزة لشعر أقوى؟",
      subtitle: "Hair Revive — بثقة ودفع عند الاستلام.",
      footnote: "✓ الدفع عند الاستلام · ✓ شحن مجاني · ✓ ضمان الجودة",
      showTrustBadges: true,
    },
    theme: {
      accentColor: "#C4A574",
      buttonStyle: "rounded-full",
      heroGradient: "luxury",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
  };
}
