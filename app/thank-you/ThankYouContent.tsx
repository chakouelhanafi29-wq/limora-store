import Link from "next/link";

type Order = {
  product: string;
  offer: string;
  price: number;
};

const trustItems = [
  "ضمان الجودة على جميع المنتجات",
  "شحن مجاني داخل السعودية",
  "الدفع عند الاستلام",
];

export default function ThankYouContent({ order }: { order: Order }) {
  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      {/* Success */}
      <section className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200/60">
          <span className="text-4xl" aria-hidden="true">
            ✅
          </span>
        </div>

        <h1 className="mb-6 font-serif text-3xl font-semibold leading-snug text-foreground sm:text-4xl">
          تم استلام طلبك بنجاح
        </h1>

        <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-muted">
          سيتواصل معك فريق LIMORA بعد قليل لتأكيد طلبك عن طريق الاتصال بالرقم
          الذي أدخلته لنا.
        </p>

        <div className="mx-auto max-w-md rounded-2xl border border-champagne/25 bg-champagne/10 px-5 py-4">
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            المرجو الرد على الاتصال لإكمال طلبك بنجاح.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="mt-10">
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

      {/* Order summary */}
      <section className="mt-10">
        <div className="overflow-hidden rounded-3xl bg-white luxury-shadow-lg">
          <div className="border-b border-champagne/10 bg-beige/40 px-6 py-4 text-center">
            <p className="text-xs tracking-[0.2em] text-champagne uppercase">
              ORDER SUMMARY
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">
              ملخص طلبك
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
                {order.price} ريال
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-5">
              <dt className="text-base font-bold text-foreground">
                المجموع النهائي
              </dt>
              <dd className="font-serif text-2xl font-semibold text-champagne">
                {order.price} ريال
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/product"
          className="inline-block rounded-full border border-champagne/30 bg-white px-8 py-3 text-sm font-medium text-foreground transition hover:border-champagne hover:shadow-md"
        >
          العودة إلى المتجر
        </Link>
      </div>
    </main>
  );
}
