import Link from "next/link";

type Order = {
  product: string;
  offer: string;
  price: number;
  orderId?: string;
  slug?: string;
};

const trustItems = [
  "ضمان الجودة على جميع المنتجات",
  "شحن مجاني داخل السعودية",
  "الدفع عند الاستلام فقط",
  "لا حاجة لبطاقة ائتمان",
];

const nextSteps = [
  "سيتصل بكِ فريق LIMORA خلال ساعات قليلة لتأكيد طلبكِ",
  "يرجى الرد على الاتصال — هذا يساعدنا على شحن طلبكِ بسرعة",
  "ادفعي فقط عند استلام طلبكِ من مندوب التوصيل",
];

export default function ThankYouContent({ order }: { order: Order }) {
  const productHref = order.slug ? `/product/${order.slug}` : "/";

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <section className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/60">
          <span className="text-4xl" aria-hidden="true">
            ✨
          </span>
        </div>

        <h1 className="mb-4 font-serif text-3xl font-semibold leading-snug text-foreground sm:text-4xl">
          تم استلام طلبكِ بنجاح
        </h1>

        {order.orderId && (
          <p className="mb-4 font-mono text-sm text-champagne">
            رقم الطلب: {order.orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-muted">
          شكراً لثقتكِ بـ LIMORA. طلبكِ في أيدٍ أمينة — وسنتواصل معكِ قريباً
          لتأكيد التفاصيل.
        </p>

        <div className="mx-auto max-w-md rounded-2xl border border-champagne/25 bg-champagne/10 px-5 py-4">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            📞 المرجو الرد على الاتصال — هذا ضروري لإكمال طلبكِ وشحنه
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-2xl bg-white p-5 luxury-shadow">
          <h2 className="mb-4 text-center font-serif text-lg font-semibold">
            ماذا يحدث الآن؟
          </h2>
          <ol className="space-y-3 text-right">
            {nextSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne/15 text-xs font-bold text-champagne">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          {trustItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-champagne/15 bg-white/70 px-4 py-2 text-[11px] font-medium text-foreground/80 sm:text-xs"
            >
              <span className="text-[10px] text-champagne">✓</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg">
          <div className="border-b border-champagne/10 bg-beige/40 px-6 py-4 text-center">
            <p className="text-xs tracking-[0.2em] text-champagne uppercase">
              ORDER SUMMARY
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">
              ملخص طلبكِ
            </h2>
          </div>

          <dl className="divide-y divide-champagne/10 px-6 py-2">
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm text-muted">المنتج</dt>
              <dd className="text-sm font-semibold text-foreground">
                {order.product}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm text-muted">العرض</dt>
              <dd className="text-sm font-semibold text-foreground">
                {order.offer}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-sm text-muted">السعر</dt>
              <dd className="text-sm font-semibold text-foreground">
                {order.price} ر.س
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-5">
              <dt className="text-base font-bold text-foreground">
                المجموع (COD)
              </dt>
              <dd className="font-serif text-2xl font-semibold text-champagne">
                {order.price} ر.س
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 text-center">
        <Link
          href={productHref}
          className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-medium text-ivory transition hover:bg-champagne"
        >
          متابعة التسوق
        </Link>
        <Link
          href="/"
          className="inline-block rounded-full border border-champagne/30 bg-white px-8 py-3 text-sm font-medium text-foreground transition hover:border-champagne hover:shadow-md"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
