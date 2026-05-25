export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSupabaseHealth } from "@/lib/supabase/health";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getEnvSiteUrl } from "@/lib/env";

export default async function AdminSetupPage() {
  const health = await getSupabaseHealth();
  const siteUrl = getEnvSiteUrl();
  const isProductionUrl = !siteUrl.includes("localhost");

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">ربط Supabase</h1>
        <p className="mt-1 text-sm text-muted">
          حالة الاتصال وإعداد قاعدة البيانات
        </p>
      </div>

      <div className="space-y-4">
        <StatusCard
          title="متغيرات البيئة"
          ok={health.configured}
          detail={
            health.configured
              ? "تم العثور على NEXT_PUBLIC_SUPABASE_URL و Publishable Key"
              : "أضيفي .env.local بالمفاتيح من Supabase"
          }
        />
        <StatusCard
          title="قاعدة البيانات"
          ok={health.connected}
          detail={
            health.connected
              ? "جميع الجداول الأساسية متصلة"
              : "شغّلي supabase/schema.sql في SQL Editor"
          }
        />
        <StatusCard
          title="Storage (product-images)"
          ok={health.storageReady}
          detail={
            health.storageReady
              ? "Bucket جاهز لرفع صور المنتجات"
              : "يُنشأ تلقائياً عند تشغيل schema.sql"
          }
        />
        <StatusCard
          title="محرّرات الصفحات"
          ok={health.builderTablesReady}
          detail={
            health.builderTablesReady
              ? "جداول home_page_configs و product_page_configs جاهزة"
              : "شغّلي supabase/ensure-migrations.sql في SQL Editor"
          }
        />
        <StatusCard
          title="حساب Admin"
          ok={health.tables.admins === true}
          detail={
            health.tables.admins
              ? "جدول admins جاهز — أنشئي مستخدم Auth ثم أضيفيه للجدول"
              : "يُنشأ مع schema.sql"
          }
        />
        <StatusCard
          title="Production URL"
          ok={isProductionUrl}
          detail={
            isProductionUrl
              ? `Site URL: ${siteUrl}`
              : "أضيفي NEXT_PUBLIC_SITE_URL=https://yourdomain.sa في Vercel"
          }
        />
      </div>

      <div className="mt-8 rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <h2 className="mb-4 font-semibold">البيانات الحالية</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="المنتجات" value={health.productCount} />
          <Metric label="الطلبات" value={health.orderCount} />
          <Metric label="التقييمات" value={health.reviewCount} />
        </div>
      </div>

      {health.connected && !health.builderTablesReady && (
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-3 font-semibold text-blue-900">
            تفعيل محرّر الرئيسية ومحرّر المنتج
          </h2>
          <ol className="list-decimal space-y-2 pr-5 text-sm text-blue-900/90">
            <li>
              افتحي{" "}
              <a
                href="https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                Supabase SQL Editor
              </a>
            </li>
            <li>
              انسخي محتوى <code>supabase/ensure-migrations.sql</code> واضغطي Run
            </li>
            <li>
              أو أضيفي <code dir="ltr">DATABASE_URL</code> إلى{" "}
              <code dir="ltr">.env.local</code> ثم شغّلي{" "}
              <code dir="ltr">npm run ensure:supabase</code>
            </li>
          </ol>
        </div>
      )}

      {health.connected && (
        <div className="mt-8 rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
          <h2 className="mb-3 font-semibold">نشر Vercel + النطاق المخصص</h2>
          <ol className="list-decimal space-y-2 pr-5 text-sm text-muted">
            <li>ارفعي المشروع إلى GitHub واربطيه بـ Vercel</li>
            <li>
              أضيفي متغيرات البيئة من{" "}
              <code dir="ltr">.env.local.example</code>
            </li>
            <li>
              في Vercel → Settings → Domains أضيفي نطاقكِ (limora.sa)
            </li>
            <li>
              حدّثي Site URL في{" "}
              <Link href="/admin/settings" className="text-champagne underline">
                الإعدادات
              </Link>
            </li>
            <li>
              شغّلي{" "}
              <code dir="ltr">supabase/ensure-migrations.sql</code> لتفعيل
              محرّرات الصفحات
            </li>
          </ol>
        </div>
      )}

      {!health.connected && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-3 font-semibold text-amber-900">
            خطوة واحدة مطلوبة
          </h2>
          <ol className="list-decimal space-y-2 pr-5 text-sm text-amber-900/90">
            <li>
              افتحي{" "}
              <a
                href="https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                Supabase SQL Editor
              </a>
            </li>
            <li>انسخي محتوى الملف <code>supabase/schema.sql</code></li>
            <li>اضغطي Run ثم أعيدي تحميل هذه الصفحة</li>
          </ol>
        </div>
      )}

      {health.connected && health.tables.admins && (
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-900">
          <p className="mb-2 font-semibold">إنشاء مدير</p>
          <p>
            بعد إنشاء مستخدم في Authentication، نفّذي في SQL Editor:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-4 text-xs" dir="ltr">
{`insert into admins (id, email, full_name)
values ('USER-UUID', 'admin@limora.sa', 'LIMORA Admin');`}
          </pre>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin"
          className="rounded-full bg-foreground px-6 py-2.5 text-sm text-ivory hover:bg-champagne"
        >
          لوحة التحكم
        </Link>
        {isSupabaseConfigured() && (
          <a
            href="https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-champagne/30 px-6 py-2.5 text-sm hover:bg-beige"
          >
            فتح Supabase Dashboard
          </a>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  title,
  ok,
  detail,
}: {
  title: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-champagne/10 bg-white p-5 luxury-shadow">
      <span
        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
          ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {ok ? "✓" : "!"}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted">{detail}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-beige/40 p-4 text-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
