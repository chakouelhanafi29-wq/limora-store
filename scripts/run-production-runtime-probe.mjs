/**
 * Run the same GA4 + merge probe as production (uses Supabase service role from .env.local).
 * Usage: node scripts/run-production-runtime-probe.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const { probeProductionAnalyticsRuntime } = await import(
  "../lib/analytics/ga4/production-runtime-probe.ts"
);

const result = await probeProductionAnalyticsRuntime("7d");
console.log(JSON.stringify(result, null, 2));
