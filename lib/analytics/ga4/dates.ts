/** GA4 report dates use the property calendar (store timezone). */
const GA4_REPORT_TIMEZONE = "Asia/Riyadh";

export function formatGa4ReportDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: GA4_REPORT_TIMEZONE,
  }).format(date);
}
