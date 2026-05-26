import {
  COLLAGEN_GLOW_PRIMARY_IMAGE,
  DETOX_CLEANSE_PRIMARY_IMAGE,
  HAIR_REVIVE_PRIMARY_IMAGE,
} from "@/lib/product-images";
import { HOME_TRANSFORMATION_IMAGES } from "@/lib/home-images";
import { REVIEW_AVATARS } from "@/lib/review-images";

export const brand = {
  name: "LIMORA",
  nameAr: "ليمورا",
  tagline: "جمالٌ يُولَد من الداخل",
};

export const announcements = [
  "ضمان متوفر على جميع منتجات LIMORA",
  "شحن مجاني + الدفع عند الاستلام داخل السعودية",
  "مجموعة LIMORA للجمال الطبيعي من الداخل — عرض حصري",
];

export const navLinks = [
  { href: "#products", label: "المنتجات" },
  { href: "#results", label: "التحول" },
  { href: "#reviews", label: "آراء العملاء" },
  { href: "#faq", label: "الأسئلة الشائعة" },
  { href: "/about", label: "من نحن" },
];

export const hero = {
  label: "LIMORA — SAUDI LUXURY BEAUTY",
  headline: "أنتِ تستحقين",
  headlineAccent: "أن تتوهجي كل يوم",
  subheadline:
    "ثلاث تركيبات فاخرة — Collagen Glow، Hair Revive، Detox Cleanse — لبشرة متوهجة، شعرٍ أكثر كثافة، وتوازن داخلي. لأن الجمال الحقيقي يُشعّ من داخلكِ.",
  trustLine: "✦ معتمد SFDA · ضمان على جميع المنتجات · دفع عند الاستلام",
  ctaPrimary: "اختاري LIMORA الآن",
  ctaSecondary: "اكتشفي تحولكِ",
  stats: [
    { value: "+18K", label: "امرأة سعودية وثقت" },
    { value: "4.9", label: "تقييم العميلات" },
    { value: "21", label: "يوم لفرق ملموس" },
  ],
  floatCard1: { title: "إشراقة تُلاحظ", subtitle: "من الأسبوع الأول" },
  floatCard2: { label: "الأكثر طلباً", title: "Collagen Glow" },
};

export const emotionalMessage = {
  label: "BEAUTY FROM WITHIN",
  title: "جمالٌ يُولَد من الداخل",
  subtitle:
    "LIMORA ليست مجرد مكملات — بل نظام جمال أنثوي متكامل. بشرة، شعر، وتوازن… في روتين واحد فاخر صُمم للمرأة السعودية التي تستحق الأفضل.",
  paragraphs: [
    "نؤمن أن الجمال الحقيقي لا يُغطّى — بل يُغذّى. كل تركيبة من LIMORA وُلدت لامرأة تعرف أن العناية الحقيقية تبدأ من الداخل.",
    "Collagen Glow للبشرة المتوهجة، Hair Revive للشعر الأقوى، Detox Cleanse للتوازن الداخلي — ثلاثة منتجات، تحول واحد.",
    "مع LIMORA… أنتِ لا تشتري منتجاً — بل تختارين نفسكِ.",
  ],
  values: [
    { label: "معتمد SFDA", icon: "❋" },
    { label: "مكونات فاخرة", icon: "✦" },
    { label: "دفع عند الاستلام", icon: "✧" },
  ],
  image: COLLAGEN_GLOW_PRIMARY_IMAGE,
};

export const featuredProducts = [
  {
    id: "collagen-glow",
    name: "LIMORA Collagen Glow",
    nameEn: "LIMORA Collagen Glow",
    benefit: "بشرة متوهجة… مرونة وشباب من الداخل",
    description:
      "كولاجين بحري فاخر + فيتامين C + بيوتين + هيالورونيك — لإشراقة، تماسك، ومظهر أكثر شباباً.",
    price: "199",
    originalPrice: "289",
    badge: "الأكثر طلباً",
    image: COLLAGEN_GLOW_PRIMARY_IMAGE,
    cta: "اختاري Collagen Glow",
  },
  {
    id: "hair-revive",
    name: "LIMORA Hair Revive",
    nameEn: "LIMORA Hair Revive",
    benefit: "شعرٌ أكثف… وقوة من الجذور",
    description:
      "كولاجين + بيوتين + كيراتين + زنك — لنمو الشعر، كثافة، وقوة تُلاحظ.",
    price: "249",
    originalPrice: "329",
    badge: "الأكثر مبيعاً",
    image: HAIR_REVIVE_PRIMARY_IMAGE,
    cta: "اختاري Hair Revive",
  },
  {
    id: "detox-cleanse",
    name: "LIMORA Detox Cleanse",
    nameEn: "LIMORA Detox Cleanse",
    benefit: "توازن داخلي… وبطن أخف",
    description:
      "خليط أخضر + بريبيوتيك + ألياف + إنزيمات — للتخلص من السموم وتقليل الانتفاخ.",
    price: "229",
    originalPrice: "299",
    badge: "حصري",
    image: DETOX_CLEANSE_PRIMARY_IMAGE,
    cta: "اختاري Detox Cleanse",
  },
];

export const limoraBundle = {
  title: "مجموعة LIMORA للجمال الطبيعي من الداخل",
  subtitle:
    "Collagen Glow + Hair Revive + Detox Cleanse — نظام جمال متكامل: بشرة، شعر، وتوازن… في مجموعة واحدة فاخرة.",
  priceNote: "599 ر.س بدلاً من 677 ر.س — شحن مجاني + الدفع عند الاستلام",
  ctaLabel: "اطلبي المجموعة الآن",
  ctaHref: "/product/collagen-glow",
  products: [
    {
      name: "Collagen Glow",
      image: COLLAGEN_GLOW_PRIMARY_IMAGE,
      href: "/product/collagen-glow",
    },
    {
      name: "Hair Revive",
      image: HAIR_REVIVE_PRIMARY_IMAGE,
      href: "/product/hair-revive",
    },
    {
      name: "Detox Cleanse",
      image: DETOX_CLEANSE_PRIMARY_IMAGE,
      href: "/product/detox-cleanse",
    },
  ],
};

export const finalCta = {
  title: "ابدئي تحولكِ اليوم",
  subtitle: "جمالٌ يُولَد من الداخل — مع LIMORA. اختاري منتجكِ واطلبي بثقة.",
  ctaLabel: "اختاري منتجكِ الآن",
  ctaHref: "#products",
  backgroundColor: "linear-gradient(135deg, #3d2e2a, #2a201e)",
};

export const whyLimora = {
  label: "THE LIMORA DIFFERENCE",
  title: "لماذا LIMORA مختلفة؟",
  subtitle:
    "ثلاث تركيبات فاخرة — Collagen Glow، Hair Revive، Detox Cleanse — مصممة لامرأة سعودية تعرف أن العناية الحقيقية تبدأ من الداخل.",
  pillars: [
    {
      icon: "✦",
      title: "مكونات فاخرة… بمعايير عالمية",
      description:
        "كولاجين بحري، بيوتين، كيراتين، خليط أخضر، بريبيوتيك — بتركيزات مدروسة وفعالية مثبتة.",
    },
    {
      icon: "◈",
      title: "جمالٌ يُغذّى… لا يُغطّى",
      description:
        "تركيبة بودر فاخرة تمتص أسرع وتعمل أعمق — لنتائج تُحسّينها من الداخل، لا تُخفينها بالمكياج.",
    },
    {
      icon: "❋",
      title: "عناية أنثوية… بفهم عميق",
      description:
        "صُممت لاحتياجات المرأة السعودية والخليجية — إشراقة، شعر، توازن… في نظام جمال واحد.",
    },
    {
      icon: "✧",
      title: "ثقة… قبل الجمال",
      description:
        "معتمد SFDA، ضمان على جميع المنتجات، ودفع عند الاستلام — لأن راحتكِ جزء من تجربتنا الفاخرة.",
    },
  ],
};

export const realResults = {
  label: "REAL TRANSFORMATIONS",
  title: "تحولٌ حقيقي… تستحقينه",
  subtitle:
    "وراء كل إشراقة امرأة اختارت نفسها. LIMORA لا تغيّر مظهركِ فقط — بل تُعيد إليكِ ثقتكِ.",
  contentRevision: 2,
  transformations: [
    {
      productName: "LIMORA Collagen Glow",
      title: "بشرة تتوهج",
      emotionalLine: "إشراقة تبدأ من الداخل",
      description:
        "إشراقة طبيعية ونعومة كالحرير — بشرة أكثر تماسكاً وشباباً من الداخل.",
      image: HOME_TRANSFORMATION_IMAGES.collagenGlow,
      stat: "92%",
      statLabel: "لاحظن إشراقة خلال 14 يوم",
      href: "/product/collagen-glow",
      accent: "rose",
    },
    {
      productName: "LIMORA Hair Revive",
      title: "شعرٌ أكثر حياة",
      emotionalLine: "شعر أكثر قوة… وثقة تدوم",
      description:
        "كثافة، لمعان، وقوة من الجذور — شعر أقوى وأقل تساقطاً.",
      image: HOME_TRANSFORMATION_IMAGES.hairRevive,
      stat: "88%",
      statLabel: "لاحظن فرقاً في الكثافة",
      href: "/product/hair-revive",
      accent: "gold",
    },
    {
      productName: "LIMORA Detox Cleanse",
      title: "توازن داخلي",
      emotionalLine: "توازن داخلي ينعكس على جمالك",
      description:
        "بطن أخف وتوازن يومي — تنظيف الجسم بلطف وتقليل الانتفاخ.",
      image: HOME_TRANSFORMATION_IMAGES.detoxCleanse,
      stat: "21",
      statLabel: "يوماً لتحول ملموس",
      href: "/product/detox-cleanse",
      accent: "sage",
    },
  ],
};

export const testimonials = {
  label: "CUSTOMER LOVE",
  title: "آراء العملاء",
  subtitle:
    "نساء من الرياض وجدة والدمام… يشاركن تجربتهن مع LIMORA Collagen Glow، Hair Revive، وDetox Cleanse.",
  items: [
    {
      name: "نورة العتيبي",
      location: "الرياض",
      product: "LIMORA Collagen Glow",
      rating: 5,
      text: "Collagen Glow غيّر بشرتي فعلاً. الإشراقة ظهرت خلال أسبوعين — اليوم أخرج بدون تغطية كثيرة وأحس بثقة مختلفة.",
      image: REVIEW_AVATARS.noura,
    },
    {
      name: "فاطمة الدوسري",
      location: "جدة",
      product: "LIMORA Hair Revive",
      rating: 5,
      text: "تساقط شعري كان يقلقني. Hair Revive خلّاني أشوف كثافة حقيقية خلال شهر — والدفع عند الاستلام خلّاني أجرب بدون تردد.",
      image: REVIEW_AVATARS.fatima,
    },
    {
      name: "مريم القحطاني",
      location: "الدمام",
      product: "LIMORA Detox Cleanse",
      rating: 5,
      text: "Detox Cleanse هو اللي كنت أدور عليه — بطن أخف وتوازن يومي. المجموعة الثلاثية مع Collagen Glow وHair Revive صارت روتيني الكامل.",
      image: REVIEW_AVATARS.maryam,
    },
  ],
};

export const faqs = {
  label: "FAQ",
  title: "الأسئلة الشائعة",
  subtitle: "كل ما تحتاجين معرفته عن LIMORA Collagen Glow، Hair Revive، وDetox Cleanse.",
  items: [
    {
      question: "هل الدفع عند الاستلام متاح؟",
      answer:
        "نعم — نوفر الدفع عند الاستلام (COD) داخل جميع مناطق المملكة. اطلبي بثقة، وادفعي عند استلام طلبكِ.",
    },
    {
      question: "كم يستغرق التوصيل؟",
      answer:
        "التوصيل مجاني داخل السعودية — عادة خلال 2–4 أيام عمل. نوصل LIMORA إلى باب منزلكِ بسرعة وأمان.",
    },
    {
      question: "هل المنتجات آمنة ومعتمدة؟",
      answer:
        "جميع منتجات LIMORA معتمدة من SFDA، ومكوناتها طبيعية 100%. نلتزم بأعلى معايير الجودة والسلامة.",
    },
    {
      question: "متى ألاحظ النتائج؟",
      answer:
        "معظم عميلاتنا يلاحظن فرقاً خلال 7–21 يوماً حسب المنتج. Collagen Glow للإشراقة، Hair Revive للكثافة، Detox Cleanse للتوازن الداخلي.",
    },
    {
      question: "كيف أستخدم المكملات؟",
      answer:
        "ذوبي ملعقة واحدة من البودر في كوب ماء أو عصير طبيعي — يومياً صباحاً على معدة فارغة. اجعليها طقساً يومياً من العناية بنفسكِ.",
    },
    {
      question: "هل يمكن طلب المجموعة الثلاثية؟",
      answer:
        "نعم — مجموعة LIMORA للجمال الطبيعي من الداخل تضم Collagen Glow + Hair Revive + Detox Cleanse بعرض حصري وشحن مجاني.",
    },
  ],
};

export const about = {
  label: "OUR STORY",
  title: "من نحن",
  subtitle: "LIMORA — حيث يلتقي الجمال بالثقة",
  paragraphs: [
    "وُلدت LIMORA في قلب المملكة — من رؤية بسيطة: المرأة السعودية تستحق مكملات تجميلية بمستوى فندقي، لا منتجات عادية.",
    "Collagen Glow، Hair Revive، Detox Cleanse — ثلاث تركيبات فاخرة تشكّل نظام جمال متكامل من الداخل.",
    "LIMORA ليست مجرد علامة — بل وعد. وعد بأن كل امرأة تستحق أن تتوهج… من الداخل.",
  ],
  values: [
    { label: "معتمد SFDA", icon: "❋" },
    { label: "مكونات نقية", icon: "✦" },
    { label: "ضمان شامل", icon: "◈" },
    { label: "دفع عند الاستلام", icon: "✧" },
  ],
  image: COLLAGEN_GLOW_PRIMARY_IMAGE,
};

export const footer = {
  tagline:
    "العلامة الأولى لمكملات التجميل الفاخرة في المملكة — Collagen Glow، Hair Revive، Detox Cleanse.",
  location: "الرياض - المملكة العربية السعودية",
  quickLinks: [
    { href: "/about", label: "من نحن" },
    { href: "/privacy", label: "سياسة الخصوصية" },
    { href: "/returns", label: "سياسة الاسترجاع والاستبدال" },
  ],
};
