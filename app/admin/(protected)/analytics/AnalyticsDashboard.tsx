"use client";

import { useCallback, useState, useTransition } from "react";
import type { DatePreset } from "@/lib/analytics/date-range";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import AnalyticsDateFilter from "./AnalyticsDateFilter";

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500",
  tiktok: "bg-foreground",
  snapchat: "bg-yellow-400",
  google: "bg-emerald-500",
  organic: "bg-teal-500",
  direct: "bg-champagne",
};

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-white p-5 luxury-shadow">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function BarRows({
  rows,
  valueKey = "count",
  labelKey = "label",
}: {
  rows: { label: string; count: number; key?: string }[];
  valueKey?: "count" | "sessions" | "orders";
  labelKey?: "label";
}) {
  const max = Math.max(...rows.map((r) => r[valueKey as keyof typeof r] as number), 1);
  if (!rows.length) return <p className="text-sm text-muted">لا توجد بيانات بعد</p>;
  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.key ?? item.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{item[labelKey]}</span>
            <span className="text-muted">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-beige">
            <div
              className={`h-full rounded-full ${platformColors[item.key ?? ""] ?? "bg-foreground/70"}`}
              style={{ width: `${((item.count / max) * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineBars({
  points,
  valueKey,
  colorClass = "bg-champagne/80",
}: {
  points: { date: string; [key: string]: string | number }[];
  valueKey: string;
  colorClass?: string;
}) {
  const max = Math.max(...points.map((p) => Number(p[valueKey]) || 0), 1);
  if (!points.length) return <p className="text-sm text-muted">لا توجد بيانات بعد</p>;
  return (
    <div className="flex h-48 items-end gap-1.5 overflow-x-auto pb-1">
      {points.map((point) => (
        <div key={point.date} className="flex min-w-[2rem] flex-1 flex-col items-center gap-2">
          <span className="text-[10px] text-muted">{point[valueKey]}</span>
          <div
            className={`w-full rounded-t-lg ${colorClass}`}
            style={{
              height: `${Math.max((Number(point[valueKey]) / max) * 100, 8)}%`,
            }}
          />
          <span className="text-[10px] text-muted">{String(point.date).slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow ${className}`.trim()}
    >
      <div className="mb-5">
        <h2 className="font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function AnalyticsDashboard({
  initialData,
}: {
  initialData: AnalyticsDashboardData;
}) {
  const [data, setData] = useState(initialData);
  const [preset, setPreset] = useState<DatePreset>(initialData.range.preset);
  const [customStart, setCustomStart] = useState(initialData.range.start.slice(0, 10));
  const [customEnd, setCustomEnd] = useState(initialData.range.end.slice(0, 10));
  const [isPending, startTransition] = useTransition();

  const loadRange = useCallback(
    (next: { preset: DatePreset; customStart?: string; customEnd?: string }) => {
      setPreset(next.preset);
      if (next.customStart) setCustomStart(next.customStart);
      if (next.customEnd) setCustomEnd(next.customEnd);

      startTransition(async () => {
        const params = new URLSearchParams({ preset: next.preset });
        if (next.preset === "custom") {
          params.set("start", next.customStart ?? customStart);
          params.set("end", next.customEnd ?? customEnd);
        }
        const response = await fetch(`/api/admin/analytics?${params.toString()}`);
        if (!response.ok) return;
        const json = (await response.json()) as AnalyticsDashboardData;
        setData(json);
      });
    },
    [customEnd, customStart],
  );

  const fmt = (n: number) => n.toLocaleString("ar-SA");
  const money = (n: number) => `${fmt(Math.round(n))} ر.س`;

  return (
    <div className="space-y-6">
      <AnalyticsDateFilter
        preset={preset}
        customStart={customStart}
        customEnd={customEnd}
        loading={isPending}
        onChange={loadRange}
      />

      <div className="rounded-xl border border-champagne/10 bg-beige/20 px-4 py-3 text-sm text-muted">
        الفترة المعروضة: <strong className="text-foreground">{data.range.label}</strong>
        {isPending ? " — جاري التحديث..." : null}
      </div>

      <div>
        <p className="mb-3 text-xs tracking-[0.2em] text-champagne uppercase">TRAFFIC</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="الزوار" value={fmt(data.traffic.totalVisitors)} hint="Sessions / PageViews" />
          <MetricCard label="زوار فريدون" value={fmt(data.traffic.uniqueVisitors)} />
          <MetricCard label="الجلسات" value={fmt(data.traffic.sessions)} />
          <MetricCard label="مشاهدات الصفحات" value={fmt(data.traffic.pageViews)} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs tracking-[0.2em] text-champagne uppercase">CONVERSION</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="معدل التحويل" value={`${data.conversion.conversionRate}%`} />
          <MetricCard label="تحويل صفحة المنتج" value={`${data.conversion.productPageConversionRate}%`} />
          <MetricCard label="فتح الطلب" value={`${data.conversion.checkoutOpenRate}%`} />
          <MetricCard label="Lead / COD" value={`${data.conversion.leadSubmitRate}%`} />
          <MetricCard label="Purchase rate" value={`${data.conversion.purchaseRate}%`} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs tracking-[0.2em] text-champagne uppercase">COD SAUDI</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="طلبات COD" value={fmt(data.cod.totalOrders)} />
          <MetricCard label="إيرادات COD" value={money(data.cod.totalRevenue)} />
          <MetricCard label="معدل التأكيد" value={`${data.cod.confirmationRate}%`} />
          <MetricCard label="معدل التسليم" value={`${data.cod.deliveredRate}%`} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="قيد الانتظار" value={fmt(data.cod.pending)} />
          <MetricCard label="مؤكد" value={fmt(data.cod.confirmed)} />
          <MetricCard label="تم الشحن" value={fmt(data.cod.shipped)} />
          <MetricCard label="تم التسليم" value={fmt(data.cod.delivered)} />
          <MetricCard label="ملغي" value={`${data.cod.cancelled} (${data.cod.cancelledRate}%)`} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="الزوار يومياً" subtitle="Unique sessions + page views">
          <LineBars points={data.charts.visitorsPerDay} valueKey="visitors" colorClass="bg-foreground/70" />
        </Section>
        <Section title="الطلبات والإيرادات" subtitle="COD orders per day">
          <LineBars points={data.charts.ordersPerDay} valueKey="count" />
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="قمع التحويل">
          {data.conversion.funnel.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {data.conversion.funnel.map((step, index) => (
                <div key={step.step} className="rounded-xl bg-beige/30 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>
                      {index + 1}. {step.label}
                    </span>
                    <span className="font-medium">
                      {fmt(step.count)} · {step.rate}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-champagne"
                      style={{ width: `${Math.max(step.rate, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Drop-off" subtitle="أين يفقد المتجر الزوار">
          {data.conversion.dropOff.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {data.conversion.dropOff.map((row) => (
                <div
                  key={`${row.from}-${row.to}`}
                  className="flex items-center justify-between rounded-xl border border-champagne/10 px-4 py-3 text-sm"
                >
                  <span>
                    {row.from} → {row.to}
                  </span>
                  <span className="font-medium text-rose-700">{row.dropRate}% drop</span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="مصادر الزيارات">
          <BarRows rows={data.traffic.trafficByPlatform} />
        </Section>
        <Section title="أفضل صفحات الهبوط">
          <BarRows rows={data.traffic.topLandingPages} />
        </Section>
      </div>

      <Section title="UTM Performance">
        {data.traffic.utmPerformance.length === 0 ? (
          <p className="text-sm text-muted">لا توجد حملات UTM بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-champagne/10 text-muted">
                  <th className="py-2 text-right">Source</th>
                  <th className="py-2 text-right">Medium</th>
                  <th className="py-2 text-right">Campaign</th>
                  <th className="py-2 text-right">Visits</th>
                  <th className="py-2 text-right">Orders</th>
                  <th className="py-2 text-right">Revenue</th>
                  <th className="py-2 text-right">CR</th>
                </tr>
              </thead>
              <tbody>
                {data.traffic.utmPerformance.map((row) => (
                  <tr key={`${row.source}-${row.medium}-${row.campaign}`} className="border-b border-champagne/5">
                    <td className="py-3">{row.source}</td>
                    <td className="py-3">{row.medium}</td>
                    <td className="py-3">{row.campaign}</td>
                    <td className="py-3">{fmt(row.visits)}</td>
                    <td className="py-3">{fmt(row.orders)}</td>
                    <td className="py-3">{money(row.revenue)}</td>
                    <td className="py-3">{row.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="أداء المنتجات">
        {data.products.length === 0 ? (
          <p className="text-sm text-muted">لا توجد بيانات منتجات بعد</p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-3 text-sm">
              {data.bestSelling ? (
                <span className="rounded-full bg-beige px-4 py-2">
                  الأكثر مبيعاً: <strong>{data.bestSelling.name}</strong> ({data.bestSelling.purchases})
                </span>
              ) : null}
              {data.bestConverting ? (
                <span className="rounded-full bg-beige px-4 py-2">
                  الأفضل تحويلاً: <strong>{data.bestConverting.name}</strong> ({data.bestConverting.conversionRate}%)
                </span>
              ) : null}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-champagne/10 text-muted">
                    <th className="py-2 text-right">المنتج</th>
                    <th className="py-2 text-right">Views</th>
                    <th className="py-2 text-right">Leads</th>
                    <th className="py-2 text-right">Purchases</th>
                    <th className="py-2 text-right">Revenue</th>
                    <th className="py-2 text-right">CR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product.slug} className="border-b border-champagne/5">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">{fmt(product.views)}</td>
                      <td className="py-3">{fmt(product.leads)}</td>
                      <td className="py-3">{fmt(product.purchases)}</td>
                      <td className="py-3">{money(product.revenue)}</td>
                      <td className="py-3">{product.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Mobile vs Desktop" subtitle="Conversion by device class">
          {data.devices.mobileVsDesktop.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {data.devices.mobileVsDesktop.map((row) => (
                <div key={row.key} className="rounded-xl border border-champagne/10 p-4 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>{row.label}</span>
                    <span>{row.conversionRate}% CR</span>
                  </div>
                  <p className="mt-1 text-muted">
                    {fmt(row.sessions)} sessions · {fmt(row.orders)} orders
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Conversion by device">
          <div className="space-y-3">
            {data.devices.conversionByDevice.map((row) => (
              <div key={row.key} className="flex items-center justify-between rounded-xl bg-beige/30 px-4 py-3 text-sm">
                <span>{row.label}</span>
                <span>
                  {fmt(row.orders)}/{fmt(row.sessions)} · {row.conversionRate}%
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="iPhone vs Android">
          <BarRows rows={data.devices.osBreakdown} />
        </Section>
        <Section title="Safari vs Chrome">
          <BarRows rows={data.devices.browserBreakdown} />
        </Section>
      </div>

      <Section title="Tracking & CAPI">
        <div className="mb-5 flex flex-wrap gap-3">
          {[
            { label: "Meta CAPI", ok: data.tracking.capiStatus.meta },
            { label: "TikTok Events API", ok: data.tracking.capiStatus.tiktok },
            { label: "Snap CAPI", ok: data.tracking.capiStatus.snapchat },
          ].map((item) => (
            <span
              key={item.label}
              className={`rounded-full px-4 py-2 text-xs font-medium ${
                item.ok
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-stone-100 text-stone-600 ring-1 ring-stone-200"
              }`}
            >
              {item.ok ? "✅" : "○"} {item.label}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Stored events" value={fmt(data.tracking.storedEvents)} />
          <MetricCard label="Server-side events" value={fmt(data.tracking.serverEvents)} />
          <MetricCard label="Unique event IDs" value={fmt(data.tracking.deduplicatedEventIds)} />
          <MetricCard
            label="Dedup coverage"
            value={
              data.tracking.storedEvents
                ? `${Math.round((data.tracking.deduplicatedEventIds / data.tracking.storedEvents) * 100)}%`
                : "0%"
            }
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Event breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {data.tracking.eventBreakdown.map((item) => (
                <span
                  key={item.key}
                  className="rounded-full border border-champagne/20 bg-beige/40 px-4 py-2 text-sm"
                >
                  {item.label} <strong className="mr-1 text-champagne">{item.count}</strong>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Platform signal (Lead/Purchase/View)</h3>
            <BarRows rows={data.tracking.platformSignal} />
          </div>
        </div>
      </Section>
    </div>
  );
}
