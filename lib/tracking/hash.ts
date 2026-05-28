import { createHash } from "crypto";

export function hashSha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** E.164 digits without + — optimized for Saudi numbers (9665XXXXXXXX). */
export function normalizePhoneForTracking(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("5")) return `966${digits}`;
  return digits;
}

export function hashPhoneForTracking(phone: string): string | null {
  const normalized = normalizePhoneForTracking(phone);
  if (!normalized) return null;
  return hashSha256(normalized);
}

export function hashNameForTracking(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return null;
  return hashSha256(trimmed);
}
