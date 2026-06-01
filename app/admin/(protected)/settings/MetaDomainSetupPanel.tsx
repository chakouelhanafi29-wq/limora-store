"use client";

import { META_AEM_EVENTS, META_SETUP_CHECKS } from "@/lib/meta/setup-checklist";

type Props = {
  siteUrl: string;
  siteDomain: string;
  metaDomainVerification: string;
  onMetaDomainVerificationChange: (value: string) => void;
};

export default function MetaDomainSetupPanel({
  siteUrl,
  siteDomain,
  metaDomainVerification,
  onMetaDomainVerificationChange,
}: Props) {
  const canonicalHost = "www.limorashop.co";
  const siteUrlOk =
    siteUrl.includes("limorashop.co") &&
    (siteUrl.startsWith("https://www.") || siteUrl.startsWith("https://limorashop.co"));

  return (
    <section className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-6">
      <p className="text-xs tracking-[0.2em] text-blue-800 uppercase">
        META DOMAIN & AEM
      </p>
      <h3 className="mt-1 font-serif text-xl font-semibold text-foreground">
        تحقق النطاق وإعداد الإعلانات
      </h3>
      <p className="mt-2 text-sm text-muted">
        النطاق الأساسي للمتجر:{" "}
        <span dir="ltr" className="font-medium text-foreground">
          https://{canonicalHost}
        </span>
        . يجب أن يطابق Site URL أدناه ونطاق Meta Business Manager.
      </p>

      {!siteUrlOk ? (
        <p className="mt-3 rounded-xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
          تحذير: Site URL غير مضبوط على limorashop.co — أحداث CAPI قد تُسجَّل على نطاق
          خاطئ (مثل limora.sa) وتضعف المطابقة والتحسين.
        </p>
      ) : null}

      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium">
          Meta Domain Verification (محتوى وسم HTML)
        </span>
        <span className="mb-2 block text-xs text-muted">
          من Business Manager → Domains → Verify → Meta-tag. يُضاف تلقائياً في{" "}
          <code dir="ltr" className="text-[11px]">
            &lt;meta name=&quot;facebook-domain-verification&quot;&gt;
          </code>
        </span>
        <input
          dir="ltr"
          placeholder="abc123def456..."
          value={metaDomainVerification}
          onChange={(e) => onMetaDomainVerificationChange(e.target.value)}
          className="w-full rounded-xl border border-champagne/20 bg-white px-4 py-2.5 text-sm"
        />
      </label>

      <div className="mt-4 rounded-xl border border-champagne/15 bg-white/80 p-4 text-xs leading-relaxed text-muted">
        <p className="font-semibold text-foreground">DNS TXT (مفضّل — أكثر ثباتاً)</p>
        <ol className="mt-2 list-decimal space-y-1 pr-4">
          <li>
            في مسجّل النطاق (dyna-ns / مزود limorashop.co) أضيفي سجل TXT على الجذر{" "}
            <span dir="ltr">@</span> أو <span dir="ltr">limorashop.co</span>.
          </li>
          <li>
            القيمة من Meta:{" "}
            <span dir="ltr">facebook-domain-verification=&lt;your-code&gt;</span> أو
            القيمة التي يعرضها Meta فقط.
          </li>
          <li>
            تحققي من <span dir="ltr">www</span> إن كان CNAME إلى Vercel — التحقق على
            الجذر يغطي عادة النطاق بالكامل.
          </li>
          <li>اضغطي Verify في Meta بعد انتشار DNS (5–60 دقيقة).</li>
        </ol>
      </div>

      <div className="mt-4 rounded-xl bg-beige/50 p-4 text-xs">
        <p className="font-semibold text-foreground">Aggregated Event Measurement — الأولوية</p>
        <p className="mt-1 text-muted">رتّبي الأحداث في Events Manager بهذا الترتيب (من الأعلى):</p>
        <ol className="mt-2 list-decimal space-y-0.5 pr-4 font-medium text-foreground">
          {META_AEM_EVENTS.map((event) => (
            <li key={event} dir="ltr">
              {event}
            </li>
          ))}
        </ol>
      </div>

      <ul className="mt-4 space-y-2 text-xs text-muted">
        {META_SETUP_CHECKS.map((check) => (
          <li key={check.id} className="rounded-lg border border-champagne/10 bg-white/60 px-3 py-2">
            <span className="font-medium text-foreground">{check.title}</span>
            <p className="mt-0.5">{check.description}</p>
            <p className="mt-1 opacity-80" dir="ltr">
              {check.metaPath}
            </p>
          </li>
        ))}
      </ul>

      {siteDomain && !siteDomain.includes("limorashop") ? (
        <p className="mt-3 text-xs text-amber-800">
          Domain field: {siteDomain} — يُفضّل <span dir="ltr">limorashop.co</span>
        </p>
      ) : null}
    </section>
  );
}
