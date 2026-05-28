const ADMIN_NUMBER_LOCALE = "en-US";

export function formatAdminNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(ADMIN_NUMBER_LOCALE, options).format(value);
}

export function formatAdminInteger(value: number): string {
  return formatAdminNumber(value, { maximumFractionDigits: 0 });
}

export function formatAdminMoney(value: number): string {
  return `${formatAdminInteger(Math.round(value))} ر.س`;
}

export function formatAdminPercent(value: number, decimals = 1): string {
  return `${formatAdminNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })}%`;
}

export function formatAdminDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(ADMIN_NUMBER_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatAdminDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(ADMIN_NUMBER_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
