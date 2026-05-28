export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAdminAnalyticsInitialData } from "@/lib/analytics/admin-date-filter-server";
import { getSupabaseHealth } from "@/lib/supabase/health";
import AdminHomeDashboard from "./AdminHomeDashboard";

export default async function AdminDashboardPage() {
  const [initialData, health] = await Promise.all([
    getAdminAnalyticsInitialData(),
    getSupabaseHealth(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          لوحة التحكم
        </h1>
        <p className="mt-1 text-sm text-muted">مرحباً بك في LIMORA Admin</p>
      </div>

      {!health.connected && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            Supabase متصل — لكن قاعدة البيانات غير مُنشأة بعد
          </p>
          <p className="mt-1 text-sm text-amber-900/80">
            شغّلي <code>supabase/schema.sql</code> في SQL Editor لتفعيل المنتجات
            والطلبات والتقييمات.
          </p>
          <Link
            href="/admin/setup"
            className="mt-3 inline-block text-sm font-medium text-champagne hover:underline"
          >
            عرض خطوات الإعداد ←
          </Link>
        </div>
      )}

      {health.connected && !health.builderTablesReady && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-blue-900">
            محرّر الصفحات يحتاج جداول إضافية
          </p>
          <p className="mt-1 text-sm text-blue-900/80">
            شغّلي <code>supabase/ensure-migrations.sql</code> في SQL Editor لتفعيل
            محرّر الرئيسية ومحرّر المنتج. أو نفّذي{" "}
            <code dir="ltr">npm run ensure:supabase</code> إذا كان DATABASE_URL
            مضبوطاً.
          </p>
          <Link
            href="/admin/setup"
            className="mt-3 inline-block text-sm font-medium text-champagne hover:underline"
          >
            تفاصيل الإعداد ←
          </Link>
        </div>
      )}

      <AdminHomeDashboard initialData={initialData} />
    </div>
  );
}
