export function whenIdle(callback: () => void, timeoutMs = 2500) {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: timeoutMs });
    return;
  }

  setTimeout(callback, Math.min(timeoutMs, 1200));
}

export function whenPageInteractive(callback: () => void, timeoutMs = 3000) {
  if (typeof window === "undefined") return;

  const run = () => whenIdle(callback, timeoutMs);

  if (document.readyState === "complete") {
    run();
    return;
  }

  window.addEventListener("load", run, { once: true, passive: true });
}
