import { cookies } from "next/headers";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import {
  DATE_FILTER_COOKIE,
  DEFAULT_DATE_FILTER,
  parseDateFilterCookie,
} from "@/lib/analytics/admin-date-filter";

export async function getAdminAnalyticsInitialData() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DATE_FILTER_COOKIE)?.value;
  const filter = raw
    ? parseDateFilterCookie(decodeURIComponent(raw))
    : DEFAULT_DATE_FILTER;

  return getAnalyticsDashboard(
    filter.preset,
    filter.preset === "custom" ? filter.customStart : undefined,
    filter.preset === "custom" ? filter.customEnd : undefined,
  );
}
