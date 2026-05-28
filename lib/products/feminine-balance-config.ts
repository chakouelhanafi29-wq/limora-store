import { FEMININE_BALANCE_PRIMARY_IMAGE } from "@/lib/product-images";
import { HOME_TRANSFORMATION_IMAGES } from "@/lib/home-images";
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

function feminineBalanceSections(sections: PageSection[]): PageSection[] {
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
                      label: "FEMININE WELLNESS",
                      title: "هل تعانين من هذه المشاعر؟",
                      problems: [
                        {
                          icon: "🌸",
                          title: "عدم الراحة اليومية",
                          description: "شعور بعدم الانتعاش… يؤثر على يومكِ.",
                          image: "",
                        },
                        {
                          icon: "💭",
                          title: "قلق من الروائح",
                          description: "تفكير مستمر… يقلل من ثقتكِ.",
                          image: "",
                        },
                        {
                          icon: "⚖️",
                          title: "شعور بعدم التوازن",
                          description: "جسمكِ يحتاج عناية أنثوية لطيفة يومياً.",
                          image: "",
                        },
                        {
                          icon: "🩷",
                          title: "فقدان الثقة",
                          description: "تمنين راحة أكثر… وثقة طبيعية كل يوم.",
                          image: "",
                        },
                      ],
                      solution: {
                        title: "LIMORA Feminine Balance — عناية أنثوية يومية",
                        description:
                          "بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — دعم يومي لانتعاش أنثوي وتوازن مريح.",
                        highlights: [
                          "انتعاش وثقة يومية",
                          "دعم التوازن الأنثوي",
                          "عناية لطيفة… بروتين فاخر",
                        ],
                        image: "/products/feminine-balance/hero.webp",
                        caption: "راحة… انتعاش… وثقة تعودين إليها كل يوم 🌸",
                      },
                    }),
                    "transformation",
                    {
                      label: "YOUR BALANCE",
                      title: "تحولٌ أنثوي… يُحسّ من الداخل",
                      subtitle: "راحة أكثر… ثقة أهدأ… عناية يومية تستحقينها.",
                      beforeAfter: [
                        {
                          title: "بداية الرحلة",
                          caption: "قلق… عدم راحة… ثقة أقل",
                          image: FEMININE_BALANCE_PRIMARY_IMAGE,
                        },
                        {
                          title: "بعد 21 يوم",
                          caption: "انتعاش… توازن… ثقة طبيعية",
                          image: HOME_TRANSFORMATION_IMAGES.feminineBalance,
                        },
                      ],
                    },
                  ),
                  "benefits",
                  {
                    label: "YOUR CONFIDENCE",
                    title: "ما الذي ستحصلين عليه؟",
                    subtitle:
                      "LIMORA Feminine Balance — لعناية أنثوية يومية… بانتعاش وثقة.",
                    items: [
                      {
                        icon: "🌸",
                        title: "انتعاش يومي",
                        description: "شعور بالنظافة والراحة… طوال اليوم",
                      },
                      {
                        icon: "💫",
                        title: "ثقة أنثوية",
                        description: "راحة داخلية… تنعكس على ثقتكِ",
                      },
                      {
                        icon: "⚖️",
                        title: "توازن مريح",
                        description: "دعم يومي لاحتياجات المرأة الخليجية",
                      },
                      {
                        icon: "✨",
                        title: "عناية لطيفة",
                        description: "تركيبة ناعمة… فاخرة… سهلة الاستخدام",
                      },
                    ],
                  },
                ),
                "comparison",
                {
                  label: "WHY LIMORA",
                  title: "LIMORA vs المنتجات العادية الأخرى",
                  subtitle: "عناية أنثوية فاخرة… بمعايير أعلى وبثقة هادئة.",
                  rows: [
                    { feature: "بريبيوتيك + بروبيوتيك", limora: true, others: false },
                    { feature: "Cranberry + فيتامين C", limora: true, others: false },
                    { feature: "مستخلصات طبيعية", limora: true, others: false },
                    { feature: "سهل الاستخدام يومياً", limora: true, others: false },
                  ],
                },
              ),
              "quality_trust",
              {
                label: "TRUSTED QUALITY",
                title: "جودة موثوقة ومعتمدة",
                subtitle: "منتج حقيقي… بمعايير جودة تستحقين ثقتكِ",
                reassurance:
                  "عناية أنثوية فاخرة… لراحة وثقة أكبر. هذا ليس منتجاً عشوائياً — بل تجربة تستحقينها.",
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
                    description: "مصمم ليناسب احتياجات المرأة الخليجية",
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
                    title: "\u062D\u0644\u0627\u0644",
                    description: "تركيبة مناسبة ومتوافقة مع معايير \u0627\u0644\u062D\u0644\u0627\u0644",
                    enabled: true,
                  },
                ],
              },
            ),
            "ingredients",
            {
              label: "PREMIUM FORMULA",
              title: "مكونات فاخرة… بعناية أنثوية",
              subtitle: "كل مكون مختار لدعم انتعاشكِ وثقتكِ اليومية.",
              items: [
                {
                  name: "Prebiotics",
                  benefit: "دعم التوازن اليومي بلطف",
                  image: "",
                  icon: "🌿",
                },
                {
                  name: "Probiotics",
                  benefit: "عناية أنثوية من الداخل",
                  image: "",
                  icon: "✨",
                },
                {
                  name: "Cranberry",
                  benefit: "مكون طبيعي… بفوائد يومية",
                  image: "",
                  icon: "🫐",
                },
                {
                  name: "Vitamin C",
                  benefit: "دعم عام… بانتعاش أكثر",
                  image: "",
                  icon: "🍊",
                },
                {
                  name: "Natural Extracts",
                  benefit: "مستخلصات طبيعية… بتركيبة فاخرة",
                  image: "",
                  icon: "🌸",
                },
              ],
            },
          ),
          "how_to_use",
          {
            label: "HOW TO USE",
            title: "طريقة الاستعمال",
            subtitle: "بسيطة… أنيقة… جزء من روتينكِ اليومي.",
            steps: [
              {
                step: "01",
                title: "ملعقة واحدة",
                description: "يومياً مع الماء أو العصير الطبيعي",
              },
              {
                step: "02",
                title: "استمري",
                description: "الاستمرار اليومي = راحة وثقة أكبر",
              },
              {
                step: "03",
                title: "استمتعي",
                description: "اجعليها طقس عناية… لأنكِ تستحقين",
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
              question: "هل Feminine Balance مناسب للاستخدام اليومي؟",
              answer:
                "نعم — صُمم للاستخدام اليومي كجزء من روتين العناية الأنثوية. اتبعي التعليمات على العبوة.",
            },
            {
              question: "متى ألاحظ الفرق؟",
              answer:
                "كثير من العميلات يشعرن براحة أكبر خلال الأسبوع الأول… والثقة تتعزز مع الاستمرار.",
            },
            {
              question: "هل الدفع عند الاستلام متاح؟",
              answer: "نعم — نوفر COD داخل السعودية. اطلبي بثقة وادفعي عند الاستلام.",
            },
            {
              question: "هل المنتج \u062D\u0644\u0627\u0644\u061F",
              answer: "نعم — تركيبة متوافقة مع معايير \u0627\u0644\u062D\u0644\u0627\u0644 لراحة وثقة أكبر.",
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
          {
            icon: "🛡️",
            title: "ضمان الجودة",
            description: "منتج فاخر… بمعايير موثوقة",
          },
          {
            icon: "🚚",
            title: "شحن مجاني",
            description: "توصيل سريع داخل السعودية",
          },
          {
            icon: "💵",
            title: "دفع عند الاستلام",
            description: "اطلبي بثقة… وادفعي عند الاستلام",
          },
          {
            icon: "💬",
            title: "دعم سريع",
            description: "فريقنا جاهز لمساعدتكِ",
          },
        ],
        ctaSubtitle: "جاهزة لتجربة Feminine Balance؟ — اطلبي الآن بالدفع عند الاستلام",
      },
    ),
    "reviews",
    {
      label: "CUSTOMER LOVE",
      title: "آراء عميلات Feminine Balance",
      items: [
        {
          name: "مريم القحطاني",
          location: "الدمام",
          rating: 5,
          text: "Feminine Balance هو اللي كنت أدور عليه — راحة يومية وثقة أكبر. صار جزء من روتيني بدون تردد.",
          image: REVIEW_AVATARS.maryam,
        },
        {
          name: "دانة المطيري",
          location: "الطائف",
          rating: 5,
          text: "التركيبة لطيفة والاستخدام سهل. أحس بانتعاش وثقة أكثر — والدفع عند الاستلام خلّاني أجرب بأمان.",
          image: REVIEW_AVATARS.dana,
        },
        {
          name: "نورة العتيبي",
          location: "الرياض",
          rating: 5,
          text: "منتج أنيق فعلاً. Feminine Balance ساعدني أحس براحة وتوازن يومي — أنصح فيه.",
          image: REVIEW_AVATARS.noura,
        },
        {
          name: "فاطمة الدوسري",
          location: "الرياض",
          rating: 5,
          text: "أحببتُ التغليف والجودة. أحس بفرق في الثقة والراحة من الأسبوع الثاني — تجربة تستحقينها.",
          image: REVIEW_AVATARS.fatima,
        },
      ],
    },
  );

  const timelineContent = {
    label: "YOUR TRANSFORMATION",
    title: "متى تظهر النتائج؟",
    subtitle: "راحة تدريجية… ثقة تتعزز… أسبوعاً بعد أسبوع.",
    weeks: [
      {
        title: "الأسبوع الأول",
        description: "بداية الشعور بالانتعاش والراحة اليومية",
        progress: 25,
        image: "",
      },
      {
        title: "الأسبوع الثاني",
        description: "ثقة أكبر… وراحة أوضح في روتينكِ",
        progress: 50,
        image: "",
      },
      {
        title: "الأسبوع الثالث",
        description: "توازن مريح… وعناية أصبحت عادة",
        progress: 75,
        image: "",
      },
      {
        title: "الأسبوع الرابع",
        description: "ثقة أنثوية… تُحسّينها كل يوم",
        progress: 100,
        image: "",
      },
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
            items: getRelatedProductsForSlug("feminine-balance"),
          },
        }
      : section,
  );

  return next;
}

export function feminineBalanceConfig(): ProductPageConfig {
  const base = buildCollagenTemplate("feminine-balance");
  return {
    ...base,
    slug: "feminine-balance",
    sections: feminineBalanceSections(base.sections),
    hero: {
      nameAr: "LIMORA Feminine Balance",
      nameEn: "LIMORA Feminine Balance",
      subtitle: "دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم",
      emotionalHook: "انتعاشي… متوازنة… واثقة من الداخل",
      rating: 4.9,
      reviewCount: 1960,
      bullets: [
        "دعم يومي للتوازن الأنثوي",
        "انتعاش وثقة طوال اليوم",
        "عناية أنثوية لطيفة وفاخرة",
        "بريبيوتيك + بروبيوتيك + Cranberry",
      ],
      urgency: "✨ عرض قطعتين بـ 329 ر.س — شحن مجاني + COD",
      images: [FEMININE_BALANCE_PRIMARY_IMAGE],
      codTrust: ["شحن سريع", "دفع عند الاستلام", "ضمان الجودة", "\u062D\u0644\u0627\u0644"],
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
        "LIMORA Feminine Balance — عناية أنثوية يومية",
        "شحن مجاني + الدفع عند الاستلام",
        "انتعاش… ثقة… كل يوم",
      ],
    },
    finalCta: {
      enabled: true,
      label: "FINAL STEP",
      title: "جاهزة لتجربة Feminine Balance؟",
      subtitle: "عناية أنثوية فاخرة… بثقة ودفع عند الاستلام.",
      footnote: "✓ الدفع عند الاستلام · ✓ شحن مجاني · ✓ ضمان الجودة",
      showTrustBadges: true,
    },
    theme: {
      accentColor: "#D4899A",
      buttonStyle: "rounded-full",
      heroGradient: "pink",
      sectionSpacing: "normal",
      sectionBackground: "ivory",
    },
  };
}
