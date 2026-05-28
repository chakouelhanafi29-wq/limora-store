const TRACKING_READY_EVENT = "limora:tracking-ready";

let trackingReady = false;
const readyListeners = new Set<() => void>();

export function isTrackingReady() {
  return trackingReady;
}

export function markTrackingReady() {
  if (trackingReady || typeof window === "undefined") return;
  trackingReady = true;
  readyListeners.forEach((listener) => listener());
  readyListeners.clear();
  window.dispatchEvent(new Event(TRACKING_READY_EVENT));
}

export function whenTrackingReady(callback: () => void) {
  if (typeof window === "undefined") return;
  if (trackingReady) {
    callback();
    return;
  }
  readyListeners.add(callback);
}

export function onTrackingReadyEvent(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  if (trackingReady) {
    callback();
    return () => {};
  }
  window.addEventListener(TRACKING_READY_EVENT, callback, { once: true });
  return () => window.removeEventListener(TRACKING_READY_EVENT, callback);
}
