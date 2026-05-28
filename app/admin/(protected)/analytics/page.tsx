export const dynamic = "force-dynamic";

import { getAdminAnalyticsInitialData } from "@/lib/analytics/admin-date-filter-server";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsInitialData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold">التحليلات</h1>
        <p className="mt-1 text-sm text-muted">
          نظرة سريعة على الزيارات، الطلبات، COD، والمنتجات — بسيطة وواضحة
        </p>
      </div>
      <AnalyticsDashboard initialData={data} />
    </div>
  );
}
