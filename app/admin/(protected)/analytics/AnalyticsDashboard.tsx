import type { AnalyticsStats } from "@/lib/types/database";

const platformColors: Record<string, string> = {
  facebook: "bg-blue-500",
  tiktok: "bg-foreground",
  snapchat: "bg-yellow-400",
  google: "bg-emerald-500",
  organic: "bg-teal-500",
  direct: "bg-champagne",
};

const deviceLabels: Record<string, string> = {
  mobile: "جوال",
  tablet: "تابلت",
  desktop: "كمبيوتر",
};

export default function AnalyticsDashboard({ stats }: { stats: AnalyticsStats }) {
  const maxPlatform = Math.max(...stats.trafficByPlatform.map((p) => p.count), 1);
  const maxDay = Math.max(...stats.ordersPerDay.map((d) => d.count), 1);
  const maxDevice = Math.max(...stats.deviceBreakdown.map((d) => d.count), 1);

  const cards = [
    { label: "إجمالي الزوار", value: stats.totalVisitors },
    { label: "مشاهدات الصفحات", value: stats.totalPageViews },
    { label: "التحويلات", value: stats.totalConversions },
    { label: "معدل التحويل", value: `${stats.conversionRate}%` },
    {
      label: "إيرادات COD",
      value: `${stats.totalRevenue.toLocaleString("ar-SA")} ر.س`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-champagne/10 bg-white p-5 luxury-shadow"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-serif text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
          <h2 className="mb-5 font-semibold">مصادر الزيارات</h2>
          {stats.trafficByPlatform.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-4">
              {stats.trafficByPlatform.map((item) => (
                <div key={item.platform}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className={`h-full rounded-full ${platformColors[item.platform] ?? "bg-champagne"}`}
                      style={{ width: `${(item.count / maxPlatform) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
          <h2 className="mb-5 font-semibold">الطلبات يومياً</h2>
          {stats.ordersPerDay.length === 0 ? (
            <p className="text-sm text-muted">لا توجد طلبات بعد</p>
          ) : (
            <div className="flex h-48 items-end gap-2">
              {stats.ordersPerDay.map((day) => (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[10px] text-muted">{day.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-champagne/80"
                    style={{
                      height: `${Math.max((day.count / maxDay) * 100, 8)}%`,
                    }}
                  />
                  <span className="text-[10px] text-muted">
                    {day.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow xl:col-span-2">
          <h2 className="mb-5 font-semibold">أفضل المنتجات</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-champagne/10 text-muted">
                    <th className="py-2 text-right">المنتج</th>
                    <th className="py-2 text-right">المشاهدات</th>
                    <th className="py-2 text-right">الطلبات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((product) => (
                    <tr key={product.name} className="border-b border-champagne/5">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">{product.views}</td>
                      <td className="py-3">{product.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
          <h2 className="mb-5 font-semibold">الأجهزة</h2>
          {stats.deviceBreakdown.length === 0 ? (
            <p className="text-sm text-muted">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-4">
              {stats.deviceBreakdown.map((item) => (
                <div key={item.device}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{deviceLabels[item.device] ?? item.device}</span>
                    <span className="text-muted">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className="h-full rounded-full bg-foreground/70"
                      style={{ width: `${(item.count / maxDevice) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-champagne/10 bg-white p-6 luxury-shadow">
        <h2 className="mb-5 font-semibold">أحداث التتبع</h2>
        {stats.eventBreakdown.length === 0 ? (
          <p className="text-sm text-muted">لا توجد أحداث بعد</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {stats.eventBreakdown.map((item) => (
              <span
                key={item.event}
                className="rounded-full border border-champagne/20 bg-beige/40 px-4 py-2 text-sm"
              >
                {item.event}{" "}
                <strong className="mr-1 text-champagne">{item.count}</strong>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
