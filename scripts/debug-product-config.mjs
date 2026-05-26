import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const headers = { apikey: key, Authorization: `Bearer ${key}` };

const res = await fetch(
  `${url}/rest/v1/product_page_configs?select=slug,config,updated_at`,
  { headers, cache: "no-store" },
);
const data = await res.json();

if (!res.ok) {
  console.error("Fetch failed:", data);
  process.exit(1);
}

console.log(`Found ${data.length} product_page_configs rows\n`);

for (const row of data) {
  const hero = row.config?.hero;
  console.log(`slug: ${row.slug}`);
  console.log(`updated_at: ${row.updated_at}`);
  console.log(`hero.nameAr: ${hero?.nameAr ?? "missing"}`);
  console.log(`hero.images: ${hero?.images?.length ?? 0}`);
  console.log(`sections: ${row.config?.sections?.length ?? 0}`);
  const first = row.config?.sections?.[0];
  console.log(`first section: ${first?.type} / ${first?.content?.title ?? "no title"}`);
  console.log("");
}
