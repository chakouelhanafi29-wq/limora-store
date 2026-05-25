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
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

async function applySql(databaseUrl, sql) {
  const { Client } = await import("pg");
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_DATABASE_URL;

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

const builderTables = ["product_page_configs", "home_page_configs"];
const tables = [...coreTables, ...builderTables];

console.log("Ensuring Supabase schema:", url);

const missing = [];

for (const table of tables) {
  const res = await fetchWithRetry(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers,
  });
  const ok = res.ok;
  console.log(`${ok ? "OK" : "MISSING"}  ${table} (${res.status})`);
  if (!ok) missing.push(table);
}

const missingCore = missing.filter((item) => coreTables.includes(item));
const missingBuilder = missing.filter((item) => builderTables.includes(item));

if (missing.length === 0) {
  console.log("\nAll required tables exist.");
  process.exit(0);
}

if (missingCore.length > 0) {
  console.error(
    "\nCore tables are missing. Run supabase/schema.sql manually in Supabase SQL Editor first.",
  );
  console.error("https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new");
  process.exit(1);
}

if (!databaseUrl) {
  console.error(
    "\nBuilder tables are missing. Add DATABASE_URL to .env.local, or run supabase/ensure-migrations.sql manually.",
  );
  console.error("https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new");
  process.exit(1);
}

const migrationPath = resolve(process.cwd(), "supabase/ensure-migrations.sql");
const sql = readFileSync(migrationPath, "utf8");

console.log("\nApplying supabase/ensure-migrations.sql via DATABASE_URL...");
try {
  await applySql(databaseUrl, sql);
} catch (error) {
  console.error("Migration failed:", error.message ?? error);
  process.exit(1);
}

console.log("Migration applied. Re-checking tables...");
const stillMissing = [];

for (const table of builderTables) {
  const res = await fetchWithRetry(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers,
  });
  const ok = res.ok;
  console.log(`${ok ? "OK" : "MISSING"}  ${table} (${res.status})`);
  if (!ok) stillMissing.push(table);
}

if (stillMissing.length > 0) {
  console.error("\nSome builder tables are still missing:", stillMissing.join(", "));
  process.exit(1);
}

console.log("\nBuilder tables are ready.");
