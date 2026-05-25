import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: "سياسة الاسترجاع والاستبدال",
    description: "سياسة الاسترجاع والاستبدال لمنتجات LIMORA داخل السعودية.",
    path: "/returns",
  });
}

export default function ReturnsPage() {
  return (
    <>
      <header className="border-b border-champagne/10 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-[0.15em] text-foreground"
          >
            LIMORA
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-champagne">
            ← الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <span className="section-label mb-4 inline-block text-xs font-medium tracking-[0.25em] text-champagne">
          RETURN POLICY
        </span>
        <h1 className="mb-8 font-serif text-4xl font-semibold text-foreground">
          سياسة الاسترجاع والاستبدال
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted">
          <p>
            نثق في جودة منتجات LIMORA — لذلك نوفر ضمان رضا 30 يوماً على جميع
            مشترياتكِ داخل المملكة العربية السعودية.
          </p>
          <p>
            إذا لم تكوني راضية عن منتجكِ، يمكنكِ طلب الاسترجاع أو الاستبدال
            خلال 30 يوماً من تاريخ الاستلام، بشرط أن تكون العبوة في حالتها
            الأصلية.
          </p>
          <p>
            للطلبات عبر الدفع عند الاستلام (COD)، يتم التنسيق مع فريق LIMORA
            لاستلام المنتج وإتمام الاسترداد وفق السياسة المعتمدة.
          </p>
        </div>
      </main>
    </>
  );
}
