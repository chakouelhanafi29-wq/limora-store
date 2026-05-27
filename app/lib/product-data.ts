import {
  COLLAGEN_GLOW_GALLERY,
  COLLAGEN_GLOW_PRIMARY_IMAGE,
} from "@/lib/product-images";
import { REVIEW_AVATARS } from "@/lib/review-images";

export const productAnnouncements = [
  "شحن مجاني + الدفع عند الاستلام داخل السعودية",
  "LIMORA Collagen Glow — كولاجين بحري فاخر",
  "نتائج طبيعية… جمال يبدأ من الداخل",
];

export const product = {
  id: "collagen-glow",
  name: "LIMORA Collagen Glow",
  nameEn: "LIMORA Collagen Glow",
  subtitle:
    "كولاجين بحري فاخر لبشرة أكثر إشراقًا، مرونة وشبابًا ✨",
  emotionalHook: "جمالك يبدأ من الداخل",
  rating: 4.9,
  reviewCount: 3241,
  bullets: [
    "جمالك يبدأ من الداخل",
    "بشرة أكثر إشراقًا ونضارة",
    "تركيبة بحرية فاخرة — كولاجين + هيالورونيك",
    "سهل الاستخدام يومياً — نتائج طبيعية ومتدرجة",
  ],
  urgency: "✨ العرض الأقوى — الأكثر طلباً: عرض قطعتين بـ 249 ر.س",
  images: [...COLLAGEN_GLOW_GALLERY],
  codTrust: ["شحن سريع", "دفع عند الاستلام", "ضمان الجودة", "حلال"],
};

export const offers = [
  {
    id: "1",
    quantity: 1,
    label: "قطعة واحدة",
    price: 199,
    unitPrice: 199,
    badge: null as string | null,
    recommended: false,
  },
  {
    id: "2",
    quantity: 2,
    label: "قطعتان",
    price: 249,
    unitPrice: 124.5,
    badge: "الأكثر طلباً",
    recommended: true,
  },
  {
    id: "3",
    quantity: 3,
    label: "3 قطع",
    price: 299,
    unitPrice: 99.7,
    badge: "أفضل قيمة",
    recommended: false,
  },
];

export function getOfferDisplayLabel(offer: Offer): string {
  if (offer.quantity === 1) return "عرض قطعة واحدة";
  if (offer.quantity === 2) return "عرض قطعتين";
  return `عرض ${offer.quantity} قطع`;
}

export const productOrderName = "LIMORA Collagen Glow";

export const saudiCities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الطائف",
  "تبوك",
  "أبها",
  "بريدة",
  "خميس مشيط",
  "الجبيل",
  "نجران",
  "حائل",
  "القطيف",
  "ينبع",
  "الأحساء",
];

export const trustBadges = [
  {
    icon: "🔒",
    title: "طلب آمن",
    description: "بياناتكِ محمية بالكامل",
  },
  {
    icon: "🚚",
    title: "شحن مجاني",
    description: "2–4 أيام داخل السعودية",
  },
  {
    icon: "💵",
    title: "دفع عند الاستلام",
    description: "ادفعي عند استلام طلبكِ",
  },
  {
    icon: "💬",
    title: "دعم العملاء",
    description: "فريقنا معكِ على مدار الساعة",
  },
  {
    icon: "✦",
    title: "ضمان الجودة",
    description: "30 يوماً — رضاكِ أولاً",
  },
];

export const problemSolution = {
  label: "SKIN CONCERNS",
  title: "هل تعانين من هذه المشاكل؟",
  problems: [
    {
      icon: "😔",
      title: "بهتان البشرة",
      description: "بشرة بلا حياة… وتوهج يختفي مع ضغط الأيام.",
      image: "",
    },
    {
      icon: "〰️",
      title: "الخطوط الدقيقة والتجاعيد",
      description: "علامات التعب تظهر قبل وقتها — وتقلقين كل صباح.",
      image: "",
    },
    {
      icon: "💧",
      title: "جفاف البشرة",
      description: "ترطيب سطحي لا يكفي… والبشرة تطلب عناية أعمق.",
      image: "",
    },
    {
      icon: "🌸",
      title: "فقدان المرونة",
      description: "مرونة البشرة تضعف… والمظهر يفقد شبابه الطبيعي.",
      image: "",
    },
    {
      title: "مسام واسعة",
      description: "ملمس غير متجانس يقلّل ثقتكِ بنفسك.",
    },
    {
      title: "عدم توحد لون البشرة",
      description: "بقع وبهتان يمنعان الإشراقة الطبيعية.",
    },
    {
      title: "ضعف الشعر والأظافر",
      description: "جمالكِ يحتاج دعماً من الداخل — لا من الخارج فقط.",
    },
  ],
  solution: {
    title: "LIMORA Collagen Glow يعيد إشراقة بشرتكِ",
    description:
      "كولاجين بحري فاخر غني بالهيالورونيك أسيد والبيوتين — تركيبة مصممة لبشرة أكثر إشراقًا، مرونة وشبابًا. جمالك يبدأ من الداخل.",
    highlights: [
      "إشراقة طبيعية ومتدرجة",
      "ترطيب عميق ومرونة أفضل",
      "ثقة أنثوية تعود… من الداخل",
    ],
    image: COLLAGEN_GLOW_GALLERY[0],
    caption: "بشرة تتوهج… وثقة تعود من الداخل ✨",
  },
};

export const productBenefits = {
  label: "YOUR GLOW",
  title: "ما الذي ستحصلين عليه؟",
  subtitle: "LIMORA Collagen Glow — لبشرة تتوهج بثقة هادئة.",
  items: [
    {
      icon: "✨",
      title: "بشرة أكثر إشراقًا ونضارة",
      description: "توهج طبيعي يُلاحظ مع الاستمرار اليومي",
    },
    {
      icon: "💧",
      title: "ترطيب عميق للبشرة",
      description: "هيالورونيك أسيد لنعومة وامتلاء أفضل",
    },
    {
      icon: "🌸",
      title: "تحسين مرونة البشرة",
      description: "كولاجين بحري فاخر لدعم مرونة البشرة",
    },
    {
      icon: "💫",
      title: "تقليل الخطوط الدقيقة",
      description: "مظهر أكثر شبابًا… بانتظام وصبر",
    },
    {
      icon: "💅",
      title: "دعم صحة الشعر والأظافر",
      description: "بيوتين وزنك لجمال متكامل من الداخل",
    },
    {
      icon: "👑",
      title: "مظهر أكثر شبابًا",
      description: "ثقة أنثوية… تبدأ من الداخل",
    },
  ],
};

export const transformation = {
  label: "REAL RESULTS",
  title: "تحولٌ حقيقي… بشرة تتوهج",
  subtitle: "نساء خليجيات وثقن بـ LIMORA Collagen Glow — وهذا ما شاركنه.",
  beforeAfter: [
    {
      image: COLLAGEN_GLOW_GALLERY[1],
      title: "تحول خلال 21 يوم",
      caption: "بشرتي صارت أهدأ وأكثر إشراقًا — الرياض",
      resultText: "21 يوم · نتيجة حقيقية مع الاستمرار اليومي",
    },
    {
      image: COLLAGEN_GLOW_GALLERY[1],
      title: "إشراقة ومرونة ملحوظة",
      caption: "مرونة وترطيب حسيت فيهم من الأسبوع الثاني — جدة",
      resultText: "14 يوم · توهج طبيعي… بثقة أنثوية",
    },
  ],
};

export const resultsTimeline = {
  label: "YOUR TRANSFORMATION",
  title: "متى تظهر النتائج؟",
  subtitle: "تحولٌ تدريجي… حقيقي… تُلاحظينه أسبوعاً بعد أسبوع.",
  weeks: [
    {
      title: "الأسبوع الأول",
      description: "بداية الشعور بالترطيب والنضارة",
      progress: 25,
      image: "",
    },
    {
      title: "الأسبوع الثاني",
      description: "تحسن واضح في مرونة البشرة",
      progress: 50,
      image: "",
    },
    {
      title: "الأسبوع الثالث",
      description: "إشراقة أقوى وملمس أكثر نعومة",
      progress: 75,
      image: "",
    },
    {
      title: "الأسبوع الرابع",
      description: "تحول ملموس… ثقة تُحسّ من الداخل",
      progress: 100,
      image: "",
    },
  ],
};

export const comparison = {
  label: "WHY LIMORA",
  title: "LIMORA vs المنتجات العادية الأخرى",
  subtitle: "تركيبة فاخرة… بمعايير أعلى… بثقة أنثوية هادئة.",
  rows: [
    { feature: "تركيبة بحرية فاخرة", limora: true, others: false },
    { feature: "كولاجين عالي الجودة", limora: true, others: false },
    { feature: "غني بالبيوتين والهيالورونيك أسيد", limora: true, others: false },
    { feature: "سهل الذوبان والاستخدام", limora: true, others: false },
    { feature: "مناسب للاستخدام اليومي", limora: true, others: false },
    { feature: "نتائج طبيعية ومتدرجة", limora: true, others: false },
  ],
};

export const productReviews = {
  label: "CUSTOMER LOVE",
  title: "آراء عميلات LIMORA",
  items: [
    {
      name: "نورة العتيبي",
      location: "الرياض",
      rating: 5,
      text: "Collagen Glow غيّر بشرتي فعلاً. الإشراقة ظهرت خلال أسبوعين — اليوم أخرج بدون تغطية كثيرة وأحس بثقة مختلفة. الدفع عند الاستلام خلّاني أجرب بدون تردد.",
      image: REVIEW_AVATARS.noura,
    },
    {
      name: "سارة الحربي",
      location: "جدة",
      rating: 5,
      text: "طلبت عرض قطعتين — وفعلاً الأفضل. بشرتي صارت أكثر مرونة وترطيب، والخطوط الدقيقة أهدأ. التغليف فخم يحسسك إنكِ تستحقين الأفضل.",
      image: REVIEW_AVATARS.sara,
    },
    {
      name: "لمى الشمري",
      location: "الدمام",
      rating: 5,
      text: "جربت منتجات كثيرة — Collagen Glow أول واحد حسّيت فيه فرق حقيقي في الإشراقة والنعومة. الشحن سريع والدفع عند الباب راح بالي.",
      image: REVIEW_AVATARS.lama,
    },
    {
      name: "هند الزهراني",
      location: "مكة",
      rating: 5,
      text: "كنت مترددة — لكن الضمان وCOD خلّاني أطلب. بعد 3 أسابيع بشرتي مختلفة: أكثر إشراقًا ومرونة. أنصح فيه بقوة.",
      image: REVIEW_AVATARS.hind,
    },
    {
      name: "ريم القحطاني",
      location: "الخبر",
      rating: 5,
      text: "الذوبان سهل جداً — أضيفه لسموثي كل صباح. شعري وأظافري صاروا أقوى، وبشرتي توهج طبيعي مو مصطنع.",
      image: REVIEW_AVATARS.reem,
    },
    {
      name: "دانة المطيري",
      location: "الطائف",
      rating: 5,
      text: "منتج فاخر بكل معنى الكلمة. جفاف بشرتي اختفى تقريباً، ولونها صار أكثر توحّد. LIMORA Collagen Glow صار جزء من روتيني اليومي.",
      image: REVIEW_AVATARS.dana,
    },
  ],
};

export const howToUse = {
  label: "HOW TO USE",
  title: "طريقة الاستعمال",
  subtitle: "بسيطة… فاخرة… فعّالة.",
  steps: [
    {
      step: "01",
      title: "ملعقة واحدة",
      description: "يومياً مع الماء أو العصير أو السموثي",
    },
    {
      step: "02",
      title: "استمري",
      description: "الاستمرار اليومي = نتائج طبيعية ومتدرجة",
    },
    {
      step: "03",
      title: "استمتعي",
      description: "اجعليها طقس جمالي… جمالك يبدأ من الداخل",
    },
  ],
};

export const productIngredients = {
  label: "PREMIUM FORMULA",
  title: "مكونات فاخرة… بفعالية مثبتة",
  subtitle: "كل مكون مختار بعناية — لجمالكِ من الداخل.",
  items: [
    {
      name: "Marine Collagen",
      benefit: "مرونة البشرة ومكافحة علامات التقدّم",
      image: COLLAGEN_GLOW_GALLERY[0],
      icon: "🧬",
    },
    {
      name: "Hyaluronic Acid",
      benefit: "ترطيب عميق ونعومة فائقة",
      image: COLLAGEN_GLOW_GALLERY[1],
      icon: "💧",
    },
    {
      name: "Vitamin C",
      benefit: "إشراقة طبيعية ونضارة",
      image: COLLAGEN_GLOW_GALLERY[1],
      icon: "✨",
    },
    {
      name: "Biotin",
      benefit: "دعم الشعر والأظافر من الداخل",
      image:
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80",
      icon: "🌿",
    },
    {
      name: "Zinc",
      benefit: "صحة البشرة والتوازن الطبيعي",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
      icon: "⚡",
    },
  ],
};

export const productFaqs = {
  label: "FAQ",
  title: "الأسئلة الشائعة",
  items: [
    {
      question: "هل الدفع عند الاستلام متاح؟",
      answer:
        "نعم — نوفر COD في جميع مناطق المملكة. اطلبي الآن وادفعي عند استلام طلبكِ.",
    },
    {
      question: "كم يستغرق التوصيل؟",
      answer: "الشحن مجاني — عادة 2–4 أيام عمل داخل السعودية.",
    },
    {
      question: "كيف أستخدم Collagen Glow؟",
      answer:
        "ملعقة واحدة يومياً مع الماء أو العصير أو السموثي — للاستخدام اليومي.",
    },
    {
      question: "متى ألاحظ النتائج؟",
      answer:
        "معظم العميلات يلاحظن تحسناً في الترطيب والإشراقة خلال 2–3 أسابيع. النتائج تتدرج مع الاستمرار.",
    },
    {
      question: "هل المنتج آمن للاستخدام اليومي؟",
      answer:
        "نعم — تركيبة LIMORA Collagen Glow مصممة للاستخدام اليومي بمكونات فاخرة ومدروسة.",
    },
    {
      question: "ماذا لو لم أكن راضية؟",
      answer: "ضمان الجودة — فريق الدعم جاهز لمساعدتكِ.",
    },
  ],
};

export const qualityTrust = {
  label: "TRUSTED QUALITY",
  title: "جودة موثوقة ومعتمدة",
  subtitle: "منتج حقيقي… بمعايير جودة تستحقين ثقتكِ",
  reassurance:
    "تركيبة مصنعة بعناية في بيئة احترافية… لراحة وثقة أكبر مع كل طلب. هذا ليس منتجاً عشوائياً — بل تجربة فاخرة موثوقة.",
  labImage:
    "https://images.unsplash.com/photo-1582719471131-67643f839661?w=1200&q=80",
  certifications: [
    "مرخص من وزارة الصحة",
    "معتمد وفق معايير الجودة",
    "فحص جودة في مختبرات موثوقة",
  ],
  badges: [
    {
      icon: "🇸🇦",
      label: "منتج محلي",
      description: "منتج محلي بمعايير جودة عالية",
    },
    {
      icon: "✦",
      label: "جودة عالية",
      description: "معايير فاخرة في كل مرحلة تصنيع",
    },
    {
      icon: "🏭",
      label: "تصنيع احترافي",
      description: "بيئة تصنيع نظيفة ومحكمة",
    },
    {
      icon: "🧪",
      label: "مختبرات موثوقة",
      description: "فحص وجودة قبل الوصول إليكِ",
    },
    {
      icon: "☪",
      label: "\u062D\u0644\u0627\u0644",
      description: "معتمد لراحة وثقة أكبر",
    },
    {
      icon: "💵",
      label: "الدفع عند الاستلام",
      description: "ادفعي عند استلام طلبكِ بأمان",
    },
  ],
};

export const guarantee = {
  label: "OUR PROMISE",
  title: "ضمان LIMORA",
  subtitle: "نثق في منتجاتنا — لذلك نضمن راحتكِ.",
  points: [
    {
      icon: "🚚",
      title: "شحن مجاني",
      description: "توصيل سريع داخل السعودية",
    },
    {
      icon: "💵",
      title: "الدفع عند الاستلام",
      description: "ادفعي فقط عند استلام طلبكِ",
    },
    {
      icon: "✦",
      title: "ضمان الجودة",
      description: "كل عبوة بمعايير فاخرة وموثوقة",
    },
    {
      icon: "💬",
      title: "دعم العملاء",
      description: "فريقنا جاهز لمساعدتكِ",
    },
  ],
};

export const relatedProducts = [
  {
    id: "hair-revive",
    name: "LIMORA Hair Revive",
    nameEn: "LIMORA Hair Revive",
    benefit: "شعرٌ أكثف… وقوة من الجذور",
    price: "249",
    image: "/products/hair-revive/hero.webp",
    href: "/product/hair-revive",
  },
  {
    id: "detox-cleanse",
    name: "LIMORA Detox Cleanse",
    nameEn: "LIMORA Detox Cleanse",
    benefit: "توازن داخلي… وبطن أخف",
    price: "229",
    image: "/products/detox-cleanse/hero.webp",
    href: "/product/detox-cleanse",
  },
];

export type Offer = (typeof offers)[number];
