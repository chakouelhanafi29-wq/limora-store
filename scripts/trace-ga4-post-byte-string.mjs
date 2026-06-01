/**
 * Reproduce POST /api/admin/ga4-settings ByteString throw.
 * Run: node scripts/trace-ga4-post-byte-string.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const k = trimmed.slice(0, eq).trim();
      let v = trimmed.slice(eq + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // optional local env
  }
}

loadEnv();

function assertByteString(label, value) {
  if (typeof value !== "string") return;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code > 255) {
      throw new Error(
        `[${label}] ByteString fail at index ${i} code ${code} char ${JSON.stringify(value[i])} preview=${JSON.stringify(value.slice(0, 24))}`,
      );
    }
  }
}

function testHeadersSet(label, value) {
  assertByteString(label, value);
  const headers = new Headers();
  headers.set("apikey", value);
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "";

console.log("serviceKey len", serviceKey.length, "char0", serviceKey.charCodeAt(0) || "empty");
console.log("anonKey len", anonKey.length, "char0", anonKey.charCodeAt(0) || "empty");

try {
  testHeadersSet("SUPABASE_SERVICE_ROLE_KEY", serviceKey);
  console.log("service key: OK for Headers.set(apikey)");
} catch (e) {
  console.error("service key FAIL:", e.message);
}

try {
  testHeadersSet("anon key", anonKey);
  console.log("anon key: OK for Headers.set(apikey)");
} catch (e) {
  console.error("anon key FAIL:", e.message);
}

const arabicErrors = [
  "Supabase غير مُفعّل",
  " — شغّلي supabase/ga4-analytics-migration.sql",
  "Measurement ID يجب أن يبدأ بـ G- (مثال: G-XXXXXXXXXX)",
  "JSON غير صالح",
];

for (const msg of arabicErrors) {
  console.log(
    `error[0]=${msg.charCodeAt(0)} (${msg[0]}) preview=${JSON.stringify(msg.slice(0, 20))}`,
  );
}

// Simulate Set-Cookie serialization (name NOT encoded in Next/edge cookies)
function testSetCookieName(name) {
  assertByteString("cookie-name", name);
  const headers = new Headers();
  headers.append("set-cookie", `${name}=${encodeURIComponent("x")}; Path=/`);
}

for (const name of ["sb-test-auth-token.0", "دعم.0", "د"]) {
  try {
    testSetCookieName(name);
    console.log(`cookie name OK: ${JSON.stringify(name)}`);
  } catch (e) {
    console.error(`cookie name FAIL: ${JSON.stringify(name)} -> ${e.message}`);
  }
}
