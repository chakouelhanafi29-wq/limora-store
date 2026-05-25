export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  getDashboardStats,
  getRecentOrders,
} from "@/lib/supabase/queries";
import { getSupabaseHealth } from "@/lib/supabase/health";
import type { OrderStatus } from "@/lib/types/database";

const statusLabels: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const [stats, recentOrders, health] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(6),
    getSupabaseHealth(),
  ]);

  const cards = [
    { label: "إجمالي الطلبات", value: stats.totalOrders, suffix: "" },
    {
      label: "إجمالي الإيرادات",
      value: stats.totalRevenue.toLocaleString("ar-SA"),
      suffix: " ر.س",
    },
    { label: "طلبات قيد الانتظار", value: stats.pendingOrders, suffix: "" },
    { label: "معدل التأكيد", value: stats.conversionRate, suffix: "%" },
  ];

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

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-foreground">
              {card.value}
              {card.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-champagne/10 bg-white luxury-shadow">
        <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-4">
          <h2 className="font-semibold text-foreground">أحدث الطلبات</h2>
          <div className="flex gap-4">
            <Link
              href="/admin/analytics"
              className="text-sm text-champagne hover:underline"
            >
              التحليلات
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-champagne hover:underline"
            >
              عرض الكل
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-champagne/10 text-muted">
                <th className="px-6 py-3 text-right font-medium">العميل</th>
                <th className="px-6 py-3 text-right font-medium">المنتج</th>
                <th className="px-6 py-3 text-right font-medium">المبلغ</th>
                <th className="px-6 py-3 text-right font-medium">الحالة</th>
                <th className="px-6 py-3 text-right font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    لا توجد طلبات بعد — اربط Supabase لتفعيل النظام
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-champagne/5">
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted" dir="ltr">
                        {order.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">{order.product_name}</td>
                    <td className="px-6 py-4">{order.total_price} ر.س</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(order.created_at).toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
