/** Normalize and validate Saudi mobile numbers (05xxxxxxxx). */
export function normalizeSaudiPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (/^05\d{8}$/.test(digits)) return digits;
  if (/^9665\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^5\d{8}$/.test(digits)) return `0${digits}`;
  return null;
}

export function isValidSaudiPhone(input: string): boolean {
  return normalizeSaudiPhone(input) !== null;
}

export function formatSaudiPhoneDisplay(input: string): string {
  const normalized = normalizeSaudiPhone(input);
  if (!normalized) return input;
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}
