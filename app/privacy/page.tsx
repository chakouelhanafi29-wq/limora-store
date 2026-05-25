import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return buildPageMetadata(site, {
    title: "سياسة الخصوصية",
    description: "سياسة الخصوصية وحماية البيانات في متجر LIMORA.",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
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
          PRIVACY POLICY
        </span>
        <h1 className="mb-8 font-serif text-4xl font-semibold text-foreground">
          سياسة الخصوصية
        </h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted">
          <p>
            في LIMORA، نحترم خصوصيتكِ ونلتزم بحماية بياناتكِ الشخصية. تُستخدم
            المعلومات التي تقدّمينها عند الطلب فقط لمعالجة طلبكِ وتوصيل منتجاتكِ
            داخل المملكة العربية السعودية.
          </p>
          <p>
            لا نشارك بياناتكِ مع أطراف ثالثة إلا عند الضرورة لإتمام التوصيل أو
            الامتثال للأنظمة المعمول بها. نطبّق معايير أمنية مناسبة لحماية
            معلوماتكِ.
          </p>
          <p>
            باستخدامكِ لموقع LIMORA، فإنكِ توافقين على هذه السياسة. للاستفسارات
            المتعلقة بالخصوصية، يمكنكِ التواصل معنا عبر قنوات الدعم الرسمية
            للعلامة.
          </p>
        </div>
      </main>
    </>
  );
}
