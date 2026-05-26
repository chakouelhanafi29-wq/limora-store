-- Safe incremental migrations for existing LIMORA databases.
-- Idempotent: safe to run multiple times.

-- Site settings columns
alter table settings add column if not exists site_url text;
alter table settings add column if not exists site_domain text;
alter table settings add column if not exists site_name text default 'LIMORA';
alter table settings add column if not exists logo_url text;
alter table settings add column if not exists favicon_url text;
alter table settings add column if not exists seo_title text;
alter table settings add column if not exists seo_description text;
alter table settings add column if not exists seo_keywords text;
alter table settings add column if not exists og_image_url text;
alter table settings add column if not exists twitter_handle text;

-- Product page builder
create table if not exists product_page_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists product_page_configs_slug_idx
  on product_page_configs (slug);

create or replace function update_product_page_configs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists product_page_configs_updated_at on product_page_configs;
create trigger product_page_configs_updated_at
  before update on product_page_configs
  for each row execute function update_product_page_configs_updated_at();

alter table product_page_configs enable row level security;

drop policy if exists "Public read product page configs" on product_page_configs;
create policy "Public read product page configs" on product_page_configs
  for select using (true);

drop policy if exists "Admin manage product page configs" on product_page_configs;
create policy "Admin manage product page configs" on product_page_configs
  for all using (is_admin()) with check (is_admin());

-- Home page builder
create table if not exists home_page_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique default 'home',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists home_page_configs_slug_idx
  on home_page_configs (slug);

alter table home_page_configs enable row level security;

drop policy if exists "Public read home page configs" on home_page_configs;
create policy "Public read home page configs" on home_page_configs
  for select using (true);

drop policy if exists "Admin manage home page configs" on home_page_configs;
create policy "Admin manage home page configs" on home_page_configs
  for all using (is_admin()) with check (is_admin());

-- Orders RLS + storefront checkout RPC (run supabase/orders-rls-migration.sql for full fix)
-- See orders-rls-migration.sql

-- Homepage transformation section auto-sync (run supabase/home-transformations-sync.sql)
-- See home-transformations-sync.sql
