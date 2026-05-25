export const productAnnouncements = [
  "شحن مجاني + الدفع عند الاستلام داخل السعودية",
  "ضمان الجودة على جميع منتجات LIMORA",
  "تخفيضات حصرية لفترة محدودة",
];

export const product = {
  id: "glow",
  name: "ليمورا جلو",
  nameEn: "Limora Glow",
  subtitle: "بشرة متوهجة… ثقة تُولَد من الداخل",
  rating: 4.9,
  reviewCount: 2847,
  bullets: [
    "إشراقة طبيعية خلال 14 يوم",
    "تركيبة بودر فاخرة — امتصاص أسرع",
    "كولاجين بحري + فيتامين C",
    "معتمد SFDA · مكونات نقية 100%",
  ],
  urgency: "⚡ كمية محدودة — يتبقى 23 عبوة فقط",
  images: [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    "https://images.unsplash.com/photo-1612817288484-6f916006177a?w=900&q=80",
    "https://images.unsplash.com/photo-1570175170871-a067510462a?w=900&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
  ],
  codTrust: ["شحن مجاني", "دفع عند الاستلام", "ضمان الجودة"],
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
    badge: "الأكثر توفيراً",
    recommended: false,
  },
];

export function getOfferDisplayLabel(offer: Offer): string {
  if (offer.quantity === 1) return "عرض قطعة واحدة";
  if (offer.quantity === 2) return "عرض قطعتين";
  return `عرض ${offer.quantity} قطع`;
}

export const productOrderName = "LIMORA Beauty Powder";

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
    title: "شحن سريع",
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
    title: "ضمان الرضا",
    description: "30 يوماً — بدون أسئلة",
  },
];

export const problemSolution = {
  label: "THE TRANSFORMATION",
  title: "هل تعانين من هذه المشاكل؟",
  problems: [
    {
      title: "بهتان البشرة وفقدان النضارة",
      description:
        "تستيقظين على بشرة بلا حياة — وتقضين ساعات أمام المرآة تحاولين إخفاء ما تشعرين به من تعب.",
    },
    {
      title: "تساقط الشعر وضعفه",
      description:
        "كل يوم تلاحظين شعراً أكثر على الوسادة — وكثافة أقل في المرآة، رغم كل المنتجات التي جربتِها.",
    },
    {
      title: "ضعف الأظافر وتكسرها",
      description:
        "أظافر هشة تتقصف بسرعة — تُخفيها بالطلاء بدلاً من أن تشعرين بالأناقة في كل تفصيل.",
    },
    {
      title: "فقدان الثقة بسبب مشاكل الجمال",
      description:
        "عندما لا تعكس المرآة من أنتِ — يبدأ الجمال بالشعور كعبء، لا كقوة تُزدان بها.",
    },
    {
      title: "صعوبة الحصول على إشراقة طبيعية",
      description:
        "تبحثين عن ذلك التوهج الذي ترينه على الآخرين — وتتساءلين: لماذا لا يحدث لكِ؟",
    },
  ],
  solution: {
    title: "LIMORA Glow يغيّر المعادلة",
    description:
      "تركيبة بودر فاخرة تغذّي بشرتكِ من الداخل — كولاجين بحري، فيتامين C، وحمض الهيالورونيك. ليس قناعاً على المشكلة… بل حلٌ يبدأ من جذور الجمال.",
    highlights: [
      "إشراقة تُلاحظ خلال 14 يوم",
      "نعومة كالحرير — بدون فلاتر",
      "ثقة تعود… طبيعياً",
    ],
  },
};

export const productBenefits = {
  label: "YOUR BENEFITS",
  title: "ما الذي ستحصلين عليه؟",
  subtitle: "تركيبة LIMORA Glow — مصممة لتحولٍ أنثوي حقيقي.",
  items: [
    {
      icon: "✨",
      title: "بشرة متوهجة",
      description: "إشراقة طبيعية تُلاحظ من الأسبوع الأول",
    },
    {
      icon: "💫",
      title: "شعر أقوى",
      description: "تغذية من الداخل لكثافة ولمعان أفضل",
    },
    {
      icon: "💅",
      title: "أظافر صحية",
      description: "قوة ولامعان — من الداخل",
    },
    {
      icon: "👑",
      title: "ثقة أنثوية",
      description: "عندما تتوهج بشرتكِ — يتغيّر كل شيء",
    },
    {
      icon: "🌸",
      title: "جمال من الداخل",
      description: "لأن الجمال الحقيقي يُغذّى… لا يُغطّى",
    },
    {
      icon: "🕊️",
      title: "عناية ذاتية فاخرة",
      description: "طقس يومي من الحب… لنفسكِ",
    },
  ],
};

export const transformation = {
  label: "REAL RESULTS",
  title: "تحولٌ حقيقي… في 21 يوم",
  subtitle:
    "نساء سعوديات وثقن بـ LIMORA Glow — وهذا ما شاركنه معنا.",
  beforeAfter: [
    {
      before:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
      after:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80",
      quote: "بشرتي صارت تتوهج بدون مكياج — الرياض",
      days: "21 يوم",
    },
    {
      before:
        "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=500&q=80",
      after:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80",
      quote: "إشراقة ونعومة ما توقعتها — جدة",
      days: "14 يوم",
    },
  ],
};

export const comparison = {
  label: "WHY LIMORA",
  title: "LIMORA vs المنتجات الأخرى",
  subtitle: "الفرق واضح — في كل تفصيل.",
  rows: [
    {
      feature: "مكونات فاخرة",
      limora: true,
      others: false,
    },
    {
      feature: "امتصاص أسرع (بودر)",
      limora: true,
      others: false,
    },
    {
      feature: "تركيبة آمنة SFDA",
      limora: true,
      others: false,
    },
    {
      feature: "جودة فاخرة",
      limora: true,
      others: false,
    },
    {
      feature: "مصمم للمرأة السعودية",
      limora: true,
      others: false,
    },
    {
      feature: "نتائج ملموسة خلال 21 يوم",
      limora: true,
      others: false,
    },
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
      text: "ما كنت أتوقع إن مكمل يغيّر بشرتي. الإشراقة ظهرت خلال أسبوعين — واليوم أخرج بدون تغطية وأحس إني كاملة. الدفع عند الاستلام خلّاني أجرب بدون تردد.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    {
      name: "سارة الحربي",
      location: "جدة",
      rating: 5,
      text: "طلبت قطعتين بالعرض — وفعلاً وفرت. بشرتي صارت ناعمة ومتوهجة، والتغليف فخم يحسسك إنكِ تستحقين الأفضل.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
    },
    {
      name: "لمى الشمري",
      location: "الدمام",
      rating: 5,
      text: "جربت منتجات كثيرة — LIMORA Glow أول واحد حسّيت فيه فرق حقيقي. الشحن سريع والدفع عند الباب راح بالي.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
    {
      name: "هند الزهراني",
      location: "مكة",
      rating: 5,
      text: "كنت مترددة — لكن الضمان وCOD خلّاني أطلب. بعد 3 أسابيع بشرتي مختلفة تماماً. أنصح فيه بقوة.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
  ],
};

export const howToUse = {
  label: "HOW TO USE",
  title: "طريقة الاستخدام",
  subtitle: "بسيطة… فاخرة… فعّالة.",
  steps: [
    {
      step: "01",
      title: "ذوبي",
      description: "ملعقة واحدة من البودر في كوب ماء أو عصير طبيعي",
    },
    {
      step: "02",
      title: "اشربي",
      description: "يومياً صباحاً — على معدة فارغة للامتصاص الأمثل",
    },
    {
      step: "03",
      title: "استمتعي",
      description: "اجعليها طقساً يومياً — النتائج تُحبّ الاستمرار",
    },
  ],
};

export const productIngredients = {
  label: "PREMIUM FORMULA",
  title: "مكونات فاخرة… بفعالية مثبتة",
  subtitle: "كل مكون مختار بعناية — لجمالكِ من الداخل.",
  items: [
    {
      name: "الكولاجين البحري",
      benefit: "مرونة البشرة ومكافحة التجاعيد",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    },
    {
      name: "فيتامين C",
      benefit: "إشراقة طبيعية وتفتيح أنيق",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",
    },
    {
      name: "حمض الهيالورونيك",
      benefit: "ترطيب عميق ونعومة فائقة",
      image:
        "https://images.unsplash.com/photo-1570175170871-a067510462a?w=400&q=80",
    },
    {
      name: "البيوتين",
      benefit: "دعم الشعر والأظافر من الداخل",
      image:
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80",
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
      answer:
        "الشحن مجاني — عادة 2–4 أيام عمل داخل السعودية.",
    },
    {
      question: "هل المنتج آمن؟",
      answer:
        "LIMORA Glow معتمد SFDA، ومكوناته طبيعية 100%.",
    },
    {
      question: "متى ألاحظ النتائج؟",
      answer:
        "معظم العميلات يلاحظن إشراقة خلال 7–14 يوم. التحول الكامل خلال 21–30 يوم.",
    },
    {
      question: "كيف أستخدم المنتج؟",
      answer:
        "ملعقة واحدة يومياً في ماء أو عصير — صباحاً على معدة فارغة.",
    },
    {
      question: "ماذا لو لم أكن راضية؟",
      answer:
        "ضمان 30 يوماً — نسترد مبلغكِ كاملاً بدون أسئلة.",
    },
  ],
};

export const guarantee = {
  label: "OUR PROMISE",
  title: "ضمان LIMORA",
  subtitle: "نثق في منتجاتنا — لذلك نضمن راحتكِ.",
  points: [
    {
      icon: "✦",
      title: "ضمان جودة المنتج",
      description: "كل عبوة مختبرة ومطابقة لمعايير SFDA",
    },
    {
      icon: "◈",
      title: "رضا العميل أولاً",
      description: "30 يوماً لاسترداد كامل — بدون تعقيد",
    },
    {
      icon: "❋",
      title: "طلب COD آمن",
      description: "ادفعي فقط عند استلام طلبكِ",
    },
    {
      icon: "✧",
      title: "دعم متواصل",
      description: "فريقنا جاهز لمساعدتكِ — الأحد إلى الخميس",
    },
  ],
};

export const relatedProducts = [
  {
    id: "hair",
    name: "ليمورا هير",
    nameEn: "Limora Hair",
    benefit: "شعرٌ أكثف… وثقة تُزدان",
    price: "299",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80",
    href: "/product",
  },
  {
    id: "radiance",
    name: "ليمورا راديance",
    nameEn: "Limora Radiance",
    benefit: "تفتيح أنثوي… بأناقة طبيعية",
    price: "319",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006177a?w=600&q=80",
    href: "/product",
  },
  {
    id: "nail",
    name: "ليمورا نيل",
    nameEn: "Limora Nail",
    benefit: "أظافر قوية… بأناقة طبيعية",
    price: "249",
    image:
      "https://images.unsplash.com/photo-1608245448919-77528928c9f9?w=600&q=80",
    href: "/product",
  },
];

export type Offer = (typeof offers)[number];
