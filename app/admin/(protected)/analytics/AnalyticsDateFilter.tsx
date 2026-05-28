"use client";

import type { DatePreset } from "@/lib/analytics/date-range";

type Props = {
  preset: DatePreset;
  customStart: string;
  customEnd: string;
  onChange: (next: {
    preset: DatePreset;
    customStart?: string;
    customEnd?: string;
  }) => void;
  loading?: boolean;
};

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: "today", label: "اليوم" },
  { id: "yesterday", label: "أمس" },
  { id: "7d", label: "7 أيام" },
  { id: "30d", label: "30 يوم" },
  { id: "month", label: "هذا الشهر" },
  { id: "custom", label: "مخصص" },
];

export default function AnalyticsDateFilter({
  preset,
  customStart,
  customEnd,
  onChange,
  loading,
}: Props) {
  return (
    <div className="rounded-2xl border border-champagne/10 bg-white p-4 luxury-shadow sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-champagne uppercase">DATE RANGE</p>
          <p className="mt-1 text-sm text-muted">جميع المؤشرات تتحدّث حسب الفترة المختارة</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={loading}
              onClick={() => onChange({ preset: item.id })}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                preset === item.id
                  ? "bg-foreground text-ivory"
                  : "border border-champagne/20 bg-beige/30 text-foreground hover:bg-beige"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {preset === "custom" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">من</span>
            <input
              type="date"
              dir="ltr"
              value={customStart}
              onChange={(e) =>
                onChange({ preset: "custom", customStart: e.target.value, customEnd })
              }
              className="w-full rounded-xl border border-champagne/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">إلى</span>
            <input
              type="date"
              dir="ltr"
              value={customEnd}
              onChange={(e) =>
                onChange({ preset: "custom", customStart, customEnd: e.target.value })
              }
              className="w-full rounded-xl border border-champagne/20 px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={loading || !customStart || !customEnd}
            onClick={() => onChange({ preset: "custom", customStart, customEnd })}
            className="self-end rounded-full bg-champagne px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            تطبيق
          </button>
        </div>
      ) : null}
    </div>
  );
}
