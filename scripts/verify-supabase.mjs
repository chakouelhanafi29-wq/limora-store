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

async function fetchWithRetry(url, options, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 1000 * attempt));
      }
    }
  }
  throw lastError;
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

const coreTables = [
  "settings",
  "products",
  "product_images",
  "product_offers",
  "orders",
  "reviews",
  "admins",
  "analytics_events",
];

const builderTables = ["product_page_configs", "home_page_configs", "tracking_secrets"];
const tables = [...coreTables, ...builderTables];

console.log("Checking Supabase:", url);

const missing = [];

for (const table of tables) {
  const res = await fetchWithRetry(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers,
  });
  const ok = res.ok;
  console.log(`${ok ? "OK" : "MISSING"}  ${table} (${res.status})`);
  if (!ok) missing.push(table);
}

const storageRes = await fetchWithRetry(`${url}/storage/v1/bucket/product-images`, {
  headers,
});
console.log(
  `${storageRes.ok ? "OK" : "MISSING"}  storage/product-images (${storageRes.status})`,
);
if (!storageRes.ok) missing.push("storage/product-images");

if (missing.length === 0) {
  const settingsRes = await fetchWithRetry(
    `${url}/rest/v1/settings?select=google_analytics_id,facebook_pixel_id&limit=1`,
    { headers },
  );
  if (!settingsRes.ok) {
    console.log(
      `WARN  settings tracking columns (${settingsRes.status}) — run supabase/tracking-settings-columns.sql`,
    );
    process.exit(1);
  }

  const rpcRes = await fetchWithRetry(`${url}/rest/v1/rpc/create_storefront_order`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({}),
  });
  if (rpcRes.status === 404) {
    console.log(
      "WARN  create_storefront_order RPC missing — run supabase/create-storefront-order.sql",
    );
    process.exit(1);
  }
  console.log("\nSupabase is fully connected.");
  process.exit(0);
}

console.log("\nMissing resources:");
for (const item of missing) {
  console.log(`- ${item}`);
}

const missingCore = missing.filter((item) => coreTables.includes(item));
const missingBuilder = missing.filter((item) => builderTables.includes(item));

if (missingCore.length > 0) {
  console.log("\nRun supabase/schema.sql in your Supabase SQL Editor:");
} else if (missingBuilder.length > 0) {
  console.log("\nCore tables exist. Run supabase/ensure-migrations.sql for page builders:");
} else if (!missing.includes("settings")) {
  console.log("\nRun supabase/tracking-settings-columns.sql for tracking settings columns:");
} else {
  console.log("\nRun supabase/schema.sql if storage is missing:");
}

console.log("https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new");
process.exit(1);
