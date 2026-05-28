"use client";

import { useMemo } from "react";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import { useAdminAnalytics } from "@/lib/analytics/use-admin-analytics";
import AnalyticsDateFilter from "./AnalyticsDateFilter";

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500",
  tiktok: "bg-foreground",
  snapchat: "bg-yellow-400",
  google: "bg-emerald-500",
  organic: "bg-teal-500",
  direct: "bg-champagne",
};

function HeroMetric({
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
      className={`rounded-2xl border p-6 luxury-shadow sm:p-7 ${
        accent
          ? "border-champagne/30 bg-gradient-to-br from-beige/80 to-white"
          : "border-champagne/10 bg-white"
      }`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </p>
    </div>
  );
}

function BarRows({
  rows,
}: {
  rows: { label: string; count: number; key?: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  if (!rows.length) return <p className="text-sm text-muted">لا توجد بيانات بعد</p>;

  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.key ?? item.label}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted">{item.count.toLocaleString("ar-SA")}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-beige">
            <div
              className={`h-full rounded-full ${platformColors[item.key ?? ""] ?? "bg-champagne"}`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersChart({
  points,
}: {
  points: { date: string; count: number; revenue: number }[];
}) {
  const max = Math.max(...points.map((p) => p.count), 1);
  if (!points.length) return <p className="text-sm text-muted">لا توجد بيانات بعد</p>;

  return (
    <div className="flex h-52 items-end gap-2 overflow-x-auto pb-1">
      {points.map((point) => (
        <div
          key={point.date}
          className="flex min-w-[2.25rem] flex-1 flex-col items-center gap-2"
          title={`${point.count} طلب · ${Math.round(point.revenue)} ر.س`}
        >
          <span className="text-[10px] font-medium text-foreground">{point.count}</span>
          <div
            className="w-full rounded-t-xl bg-champagne"
            style={{ height: `${Math.max((point.count / max) * 100, 10)}%` }}
          />
          <span className="text-[10px] text-muted">{point.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function DeviceCard({
  label,
  sessions,
  orders,
  conversionRate,
  visitsOnly = false,
}: {
  label: string;
  sessions: number;
  orders: number | null;
  conversionRate: number;
  visitsOnly?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-beige/20 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-sm text-muted">
            {visitsOnly
              ? `${sessions.toLocaleString("ar-SA")} زيارة`
              : `${(orders ?? 0).toLocaleString("ar-SA")} طلب · ${sessions.toLocaleString("ar-SA")} زيارة`}
          </p>
          {visitsOnly ? (
            <p className="mt-1 text-xs text-muted">معدل تحويل الجوال (تقريبي)</p>
          ) : null}
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-champagne ring-1 ring-champagne/20">
          {conversionRate}%
        </span>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({
  initialData,
}: {
  initialData: AnalyticsDashboardData;
}) {
  const { data, appliedFilter, applyFilter, isPending } = useAdminAnalytics(initialData);

  const fmt = (n: number) => n.toLocaleString("ar-SA");
  const money = (n: number) => `${fmt(Math.round(n))} ر.س`;

  const confirmedOrders =
    data.cod.confirmed + data.cod.shipped + data.cod.delivered;

  const deviceCards = useMemo(() => {
    const mobile = data.devices.mobileVsDesktop.find((d) => d.key === "mobile");
    const desktop = data.devices.mobileVsDesktop.find((d) => d.key === "desktop");
    const ios = data.devices.osBreakdown.find((d) => d.key === "ios");
    const android = data.devices.osBreakdown.find((d) => d.key === "android");

    const mobileCr = mobile?.conversionRate ?? 0;

    return [
      {
        key: "mobile",
        label: "جوال",
        sessions: mobile?.sessions ?? 0,
        orders: mobile?.orders ?? 0,
        conversionRate: mobileCr,
      },
      {
        key: "desktop",
        label: "كمبيوتر",
        sessions: desktop?.sessions ?? 0,
        orders: desktop?.orders ?? 0,
        conversionRate: desktop?.conversionRate ?? 0,
      },
      {
        key: "ios",
        label: "iPhone",
        sessions: ios?.count ?? 0,
        orders: null,
        conversionRate: mobileCr,
        visitsOnly: true,
      },
      {
        key: "android",
        label: "Android",
        sessions: android?.count ?? 0,
        orders: null,
        conversionRate: mobileCr,
        visitsOnly: true,
      },
    ];
  }, [data.devices]);

  return (
    <div className="space-y-8">
      <AnalyticsDateFilter applied={appliedFilter} onApply={applyFilter} loading={isPending} />

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
        <HeroMetric label="عدد الزوار" value={fmt(data.traffic.totalVisitors)} accent />
        <HeroMetric label="عدد الطلبات" value={fmt(data.cod.totalOrders)} />
        <HeroMetric label="معدل التحويل" value={`${data.conversion.conversionRate}%`} />
        <HeroMetric label="الإيرادات" value={money(data.cod.totalRevenue)} accent />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <HeroMetric label="الطلبات المؤكدة" value={fmt(confirmedOrders)} />
        <HeroMetric label="الطلبات الملغاة" value={fmt(data.cod.cancelled)} />
        <HeroMetric label="نسبة التوصيل" value={`${data.cod.deliveredRate}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow sm:p-7">
          <h2 className="font-semibold">الطلبات يومياً</h2>
          <p className="mt-1 text-sm text-muted">مبيعات COD خلال الفترة المختارة</p>
          <div className="mt-6">
            <OrdersChart points={data.charts.ordersPerDay} />
          </div>
        </section>

        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow sm:p-7">
          <h2 className="font-semibold">مصادر الزيارات</h2>
          <p className="mt-1 text-sm text-muted">من أين يأتي زوار LIMORA</p>
          <div className="mt-6">
            <BarRows rows={data.traffic.trafficByPlatform} />
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow sm:p-7">
        <h2 className="font-semibold">أفضل المنتجات</h2>
        <p className="mt-1 text-sm text-muted">الأكثر طلباً وإيراداً في هذه الفترة</p>
        {data.products.length === 0 ? (
          <p className="mt-6 text-sm text-muted">لا توجد بيانات منتجات بعد</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-champagne/10 text-muted">
                  <th className="py-3 text-right font-medium">المنتج</th>
                  <th className="py-3 text-right font-medium">الطلبات</th>
                  <th className="py-3 text-right font-medium">الإيرادات</th>
                  <th className="py-3 text-right font-medium">التحويل</th>
                </tr>
              </thead>
              <tbody>
                {data.products.slice(0, 5).map((product) => (
                  <tr key={product.slug} className="border-b border-champagne/5">
                    <td className="py-4 font-medium">{product.name}</td>
                    <td className="py-4">{fmt(product.purchases)}</td>
                    <td className="py-4">{money(product.revenue)}</td>
                    <td className="py-4">{product.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow sm:p-7">
        <h2 className="font-semibold">الأجهزة</h2>
        <p className="mt-1 text-sm text-muted">الأداء حسب نوع الجهاز ومعدل التحويل</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {deviceCards.map((device) => (
            <DeviceCard
              key={device.key}
              label={device.label}
              sessions={device.sessions}
              orders={device.orders}
              conversionRate={device.conversionRate}
              visitsOnly={"visitsOnly" in device ? device.visitsOnly : false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
