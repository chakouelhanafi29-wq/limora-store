export function createTrackingEventId(prefix?: string): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  return prefix ? `${prefix}-${id}` : id;
}

export function resolvePurchaseEventId(orderId?: string | null): string {
  if (orderId?.trim()) return orderId.trim();
  return createTrackingEventId("purchase");
}
