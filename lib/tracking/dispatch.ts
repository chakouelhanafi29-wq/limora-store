import { getTrackingProviderConfig, isServerTrackingEnabled } from "./config";
import { sendMetaConversionEvent } from "./providers/meta";
import { sendSnapchatConversionEvent } from "./providers/snapchat";
import { sendTikTokConversionEvent } from "./providers/tiktok";
import type {
  DispatchResult,
  ServerRequestContext,
  ServerTrackingPayload,
} from "./types";

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch {
    return await fn();
  }
}

export async function dispatchServerTrackingEvent(
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): Promise<DispatchResult[]> {
  const config = await getTrackingProviderConfig();
  if (!isServerTrackingEnabled(config)) {
    return [];
  }

  const tasks: Promise<DispatchResult>[] = [];

  if (config.metaPixelId && config.metaAccessToken) {
    tasks.push(withRetry(() => sendMetaConversionEvent(config, payload, request)));
  }
  if (config.tiktokPixelId && config.tiktokAccessToken) {
    tasks.push(withRetry(() => sendTikTokConversionEvent(config, payload, request)));
  }
  if (config.snapchatPixelId && config.snapchatAccessToken) {
    tasks.push(
      withRetry(() => sendSnapchatConversionEvent(config, payload, request)),
    );
  }

  if (!tasks.length) return [];

  const settled = await Promise.allSettled(tasks);
  return settled.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          provider: "meta" as const,
          ok: false,
          error: "Provider dispatch failed",
        },
  );
}

export async function dispatchServerTrackingEventNonBlocking(
  payload: ServerTrackingPayload,
  request: ServerRequestContext,
): Promise<void> {
  void dispatchServerTrackingEvent(payload, request).catch((error) => {
    console.warn("[tracking] server dispatch failed:", error);
  });
}
