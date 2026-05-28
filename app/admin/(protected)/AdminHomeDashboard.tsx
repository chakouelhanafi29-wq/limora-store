"use client";

import Link from "next/link";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import type { OrderStatus } from "@/lib/types/database";
import { useAdminAnalytics } from "@/lib/analytics/use-admin-analytics";
import AnalyticsDateFilter from "./analytics/AnalyticsDateFilter";

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

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 luxury-shadow ${
        accent
          ? "border-champagne/30 bg-gradient-to-br from-beige/80 to-white"
          : "border-champagne/10 bg-white"
      }`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

type Props = {
  initialData: AnalyticsDashboardData;
};

export default function AdminHomeDashboard({ initialData }: Props) {
  const { data, appliedFilter, applyFilter, isPending } = useAdminAnalytics(initialData);

  const fmt = (n: number) => n.toLocaleString("ar-SA");
  const money = (n: number) => `${fmt(Math.round(n))} ر.س`;
  const confirmedOrders =
    data.cod.confirmed + data.cod.shipped + data.cod.delivered;

  return (
    <div className="space-y-8">
      <AnalyticsDateFilter
        applied={appliedFilter}
        onApply={applyFilter}
        loading={isPending}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-champagne/10 bg-beige/20 px-5 py-4">
        <p className="text-sm text-muted">
          الفترة المعروضة:{" "}
          <strong className="text-foreground">{data.range.label}</strong>
        </p>
        {isPending ? (
          <span className="text-xs text-champagne">جاري تحديث البيانات...</span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="عدد الزوار" value={fmt(data.traffic.totalVisitors)} accent />
        <MetricCard label="عدد الطلبات" value={fmt(data.cod.totalOrders)} />
        <MetricCard label="معدل التحويل" value={`${data.conversion.conversionRate}%`} />
        <MetricCard label="الإيرادات" value={money(data.cod.totalRevenue)} accent />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="الطلبات المؤكدة" value={fmt(confirmedOrders)} />
        <MetricCard label="الطلبات الملغاة" value={fmt(data.cod.cancelled)} />
        <MetricCard label="نسبة التوصيل" value={`${data.cod.deliveredRate}%`} />
      </div>

      <section className="rounded-2xl border border-champagne/10 bg-white luxury-shadow">
        <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-4">
          <div>
            <h2 className="font-semibold text-foreground">أفضل المنتجات</h2>
            <p className="mt-1 text-sm text-muted">الأكثر طلباً في الفترة المختارة</p>
          </div>
          <Link href="/admin/analytics" className="text-sm text-champagne hover:underline">
            التحليلات الكاملة
          </Link>
        </div>
        {data.products.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">لا توجد بيانات منتجات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-champagne/10 text-muted">
                  <th className="px-6 py-3 text-right font-medium">المنتج</th>
                  <th className="px-6 py-3 text-right font-medium">الطلبات</th>
                  <th className="px-6 py-3 text-right font-medium">الإيرادات</th>
                  <th className="px-6 py-3 text-right font-medium">التحويل</th>
                </tr>
              </thead>
              <tbody>
                {data.products.slice(0, 5).map((product) => (
                  <tr key={product.slug} className="border-b border-champagne/5">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4">{fmt(product.purchases)}</td>
                    <td className="px-6 py-4">{money(product.revenue)}</td>
                    <td className="px-6 py-4">{product.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white luxury-shadow">
        <div className="flex items-center justify-between border-b border-champagne/10 px-6 py-4">
          <div>
            <h2 className="font-semibold text-foreground">طلبات الفترة</h2>
            <p className="mt-1 text-sm text-muted">أحدث الطلبات ضمن النطاق الزمني المحدد</p>
          </div>
          <Link href="/admin/orders" className="text-sm text-champagne hover:underline">
            عرض الكل
          </Link>
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
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    لا توجد طلبات في هذه الفترة
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
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
      </section>
    </div>
  );
}
