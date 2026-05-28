"use client";

import { useCallback, useState, useTransition } from "react";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";
import {
  type DateFilterDraft,
  fetchAdminAnalytics,
  toAppliedFilter,
  writeDateFilterCookie,
} from "@/lib/analytics/admin-date-filter";

export function useAdminAnalytics(initialData: AnalyticsDashboardData) {
  const [data, setData] = useState(initialData);
  const [appliedFilter, setAppliedFilter] = useState<DateFilterDraft>(() =>
    toAppliedFilter(initialData),
  );
  const [isPending, startTransition] = useTransition();

  const applyFilter = useCallback((draft: DateFilterDraft) => {
    startTransition(async () => {
      writeDateFilterCookie(draft);
      const json = await fetchAdminAnalytics(draft);
      if (!json) return;
      setData(json);
      setAppliedFilter(toAppliedFilter(json));
    });
  }, []);

  return { data, appliedFilter, applyFilter, isPending };
}
