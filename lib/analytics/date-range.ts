export type DatePreset =
  | "today"
  | "yesterday"
  | "7d"
  | "30d"
  | "month"
  | "custom";

export type ResolvedDateRange = {
  preset: DatePreset;
  start: Date;
  end: Date;
  label: string;
};

const PRESET_LABELS: Record<Exclude<DatePreset, "custom">, string> = {
  today: "اليوم",
  yesterday: "أمس",
  "7d": "آخر 7 أيام",
  "30d": "آخر 30 يوم",
  month: "هذا الشهر",
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function resolveDateRange(
  preset: DatePreset,
  customStart?: string,
  customEnd?: string,
): ResolvedDateRange {
  const now = new Date();

  if (preset === "custom" && customStart && customEnd) {
    const start = startOfDay(new Date(customStart));
    const end = endOfDay(new Date(customEnd));
    return {
      preset,
      start,
      end,
      label: `${customStart} — ${customEnd}`,
    };
  }

  if (preset === "today") {
    return {
      preset,
      start: startOfDay(now),
      end: endOfDay(now),
      label: PRESET_LABELS.today,
    };
  }

  if (preset === "yesterday") {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    return {
      preset,
      start: startOfDay(y),
      end: endOfDay(y),
      label: PRESET_LABELS.yesterday,
    };
  }

  if (preset === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      preset,
      start: startOfDay(start),
      end: endOfDay(now),
      label: PRESET_LABELS.month,
    };
  }

  const days = preset === "7d" ? 7 : 30;
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));

  return {
    preset,
    start: startOfDay(start),
    end: endOfDay(now),
    label: PRESET_LABELS[preset === "7d" ? "7d" : "30d"],
  };
}

export function parseDatePreset(value: string | null): DatePreset {
  if (
    value === "today" ||
    value === "yesterday" ||
    value === "7d" ||
    value === "30d" ||
    value === "month" ||
    value === "custom"
  ) {
    return value;
  }
  return "30d";
}
