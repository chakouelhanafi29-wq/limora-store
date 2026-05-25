export const dynamic = "force-dynamic";

import { getAnalyticsStats } from "@/lib/supabase/queries";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AdminAnalyticsPage() {
  const stats = await getAnalyticsStats(30);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">التحليلات</h1>
        <p className="mt-1 text-sm text-muted">
          تتبع الزيارات، المصادر، التحويلات، وأداء المنصات — آخر 30 يوم
        </p>
      </div>
      <AnalyticsDashboard stats={stats} />
    </div>
  );
}
