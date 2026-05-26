import Link from "next/link";

type Order = {
  product: string;
  offer: string;
  price: number;
  slug?: string;
};

function SuccessIcon() {
  return (
    <div
      className="relative mx-auto mb-8 flex h-[5.5rem] w-[5.5rem] items-center justify-center"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-champagne/25 via-rose-gold/20 to-beige/40 blur-sm" />
      <div className="relative flex h-full w-full items-center justify-center rounded-full border border-champagne/30 bg-gradient-to-br from-ivory via-beige/80 to-champagne/15 luxury-shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-champagne/30 to-rose-gold/25 ring-1 ring-champagne/20">
          <svg
            className="h-6 w-6 text-champagne"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const trustItems = [
  "ضمان الجودة",
  "شحن مجاني",
  "الدفع عند الاستلام",
  "لا بطاقة ائتمان",
];

const nextSteps = [
  "سيتصل بكِ فريق LIMORA خلال ساعات قليلة لتأكيد طلبكِ",
  "يرجى الرد على الاتصال — هذا يساعدنا على شحن طلبكِ بسرعة",
  "ادفعي فقط عند استلام طلبكِ من مندوب التوصيل",
];

export default function ThankYouContent({ order }: { order: Order }) {
  const productHref = order.slug ? `/product/${order.slug}` : "/";

  return (
    <main className="mx-auto max-w-md px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
      <section className="text-center">
        <SuccessIcon />

        <p className="section-label mb-3 text-[11px] tracking-[0.28em] text-champagne">
          ORDER CONFIRMED
        </p>
        <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight text-foreground sm:text-[2rem]">
          تم استلام طلبكِ بنجاح
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-muted">
          شكراً لثقتكِ بـ LIMORA. طلبكِ في أيدٍ أمينة — وسنتواصل معكِ قريباً
          لتأكيد التفاصيل.
        </p>

        <div className="mx-auto max-w-sm rounded-2xl border border-champagne/20 bg-gradient-to-l from-champagne/10 via-white/80 to-beige/50 px-5 py-4 text-center luxury-shadow">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            المرجو الرد على الاتصال — هذا ضروري لإكمال طلبكِ وشحنه
          </p>
          <p className="mt-1.5 text-xs text-muted">
            فريقنا سيتصل بكِ على رقم الجوال الذي أدخلتِه
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="overflow-hidden rounded-3xl border border-champagne/10 bg-white luxury-shadow-lg">
          <div className="border-b border-champagne/10 bg-beige/30 px-6 py-5 text-center">
            <p className="text-[10px] tracking-[0.22em] text-champagne">
              YOUR ORDER
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">
              ملخص طلبكِ
            </h2>
          </div>

          <dl className="px-6 py-1">
            <div className="flex items-start justify-between gap-4 border-b border-champagne/10 py-4">
              <dt className="shrink-0 text-sm text-muted">المنتج</dt>
              <dd className="text-left text-sm font-semibold leading-snug text-foreground">
                {order.product}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-champagne/10 py-4">
              <dt className="text-sm text-muted">العرض</dt>
              <dd className="text-sm font-semibold text-foreground">
                {order.offer}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-5">
              <dt className="text-sm font-medium text-muted">المجموع · COD</dt>
              <dd className="font-serif text-2xl font-semibold text-champagne">
                {order.price}{" "}
                <span className="text-sm font-normal text-muted">ر.س</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-champagne/10 bg-white/70 p-6 backdrop-blur-sm luxury-shadow">
          <h2 className="mb-5 text-center font-serif text-lg font-semibold text-foreground">
            ماذا يحدث الآن؟
          </h2>
          <ol className="space-y-4">
            {nextSteps.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-3.5 text-right text-sm leading-relaxed text-muted"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-champagne/20 to-beige font-serif text-xs font-semibold text-champagne">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {trustItems.map((item) => (
            <span
              key={item}
              className="flex items-center justify-center gap-1 rounded-xl border border-champagne/10 bg-ivory/80 px-2 py-2.5 text-center text-[10px] font-medium leading-tight text-foreground/75 sm:text-[11px]"
            >
              <span className="text-champagne">✦</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3">
        <Link
          href={productHref}
          className="block rounded-full bg-foreground py-3.5 text-center text-sm font-medium text-ivory transition hover:bg-champagne hover:shadow-lg"
        >
          متابعة التسوق
        </Link>
        <Link
          href="/"
          className="block rounded-full border border-champagne/25 bg-white/80 py-3.5 text-center text-sm font-medium text-foreground transition hover:border-champagne hover:shadow-md"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
