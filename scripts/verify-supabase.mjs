import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

const tables = [
  "settings",
  "products",
  "product_images",
  "product_offers",
  "orders",
  "reviews",
  "admins",
  "analytics_events",
];

console.log("Checking Supabase:", url);

let ready = true;

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers,
  });
  const ok = res.ok;
  console.log(`${ok ? "OK" : "MISSING"}  ${table} (${res.status})`);
  if (!ok) ready = false;
}

const storageRes = await fetch(`${url}/storage/v1/bucket/product-images`, {
  headers,
});
console.log(
  `${storageRes.ok ? "OK" : "MISSING"}  storage/product-images (${storageRes.status})`,
);
if (!storageRes.ok) ready = false;

if (ready) {
  console.log("\nSupabase is fully connected.");
} else {
  console.log("\nRun supabase/schema.sql in your Supabase SQL Editor:");
  console.log("https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new");
  process.exit(1);
}
