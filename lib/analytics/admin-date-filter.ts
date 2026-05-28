import type { DatePreset } from "@/lib/analytics/date-range";
import type { AnalyticsDashboardData } from "@/lib/types/analytics-dashboard";

export type DateFilterDraft = {
  preset: DatePreset;
  customStart: string;
  customEnd: string;
};

export const DATE_FILTER_COOKIE = "limora_admin_date_filter";

export const DEFAULT_DATE_FILTER: DateFilterDraft = {
  preset: "30d",
  customStart: "",
  customEnd: "",
};

export function toAppliedFilter(data: AnalyticsDashboardData): DateFilterDraft {
  return {
    preset: data.range.preset,
    customStart: data.range.start.slice(0, 10),
    customEnd: data.range.end.slice(0, 10),
  };
}

export function filtersEqual(a: DateFilterDraft, b: DateFilterDraft) {
  if (a.preset !== b.preset) return false;
  if (a.preset !== "custom") return true;
  return a.customStart === b.customStart && a.customEnd === b.customEnd;
}

export function parseDateFilterCookie(value: string | undefined): DateFilterDraft {
  if (!value) return DEFAULT_DATE_FILTER;

  if (value.startsWith("custom:")) {
    const parts = value.split(":");
    return {
      preset: "custom",
      customStart: parts[1] ?? "",
      customEnd: parts[2] ?? "",
    };
  }

  const preset = value as DatePreset;
  if (
    preset === "today" ||
    preset === "yesterday" ||
    preset === "7d" ||
    preset === "30d" ||
    preset === "month"
  ) {
    return { preset, customStart: "", customEnd: "" };
  }

  return DEFAULT_DATE_FILTER;
}

export function serializeDateFilterCookie(draft: DateFilterDraft): string {
  if (draft.preset === "custom") {
    return `custom:${draft.customStart}:${draft.customEnd}`;
  }
  return draft.preset;
}

export function writeDateFilterCookie(draft: DateFilterDraft) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(serializeDateFilterCookie(draft));
  document.cookie = `${DATE_FILTER_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
}

export function buildAnalyticsQueryParams(draft: DateFilterDraft) {
  const params = new URLSearchParams({ preset: draft.preset });
  if (draft.preset === "custom") {
    params.set("start", draft.customStart);
    params.set("end", draft.customEnd);
  }
  return params;
}

export async function fetchAdminAnalytics(
  draft: DateFilterDraft,
): Promise<AnalyticsDashboardData | null> {
  const response = await fetch(
    `/api/admin/analytics?${buildAnalyticsQueryParams(draft).toString()}`,
    { cache: "no-store" },
  );
  if (!response.ok) return null;
  return (await response.json()) as AnalyticsDashboardData;
}
