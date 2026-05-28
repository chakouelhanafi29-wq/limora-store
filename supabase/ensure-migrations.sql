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

-- Tracking & analytics pixel columns (Admin → Settings)
alter table settings add column if not exists facebook_pixel_id text;
alter table settings add column if not exists tiktok_pixel_id text;
alter table settings add column if not exists snapchat_pixel_id text;
alter table settings add column if not exists google_analytics_id text;
alter table settings add column if not exists google_tag_manager_id text;
alter table settings add column if not exists whatsapp_number text;
alter table settings add column if not exists free_shipping boolean default true;
alter table settings add column if not exists cod_enabled boolean default true;
alter table settings add column if not exists announcement_1 text;
alter table settings add column if not exists announcement_2 text;
alter table settings add column if not exists announcement_3 text;
alter table settings add column if not exists updated_at timestamptz default now();

insert into settings (id) values (1) on conflict (id) do nothing;

-- Server-side tracking credentials (admin-only)
create table if not exists tracking_secrets (
  id int primary key default 1 check (id = 1),
  meta_capi_access_token text,
  meta_test_event_code text,
  tiktok_events_access_token text,
  tiktok_test_event_code text,
  snapchat_capi_access_token text,
  snapchat_test_event_code text,
  updated_at timestamptz default now()
);

insert into tracking_secrets (id) values (1) on conflict (id) do nothing;

alter table tracking_secrets enable row level security;

drop policy if exists "Admin read tracking secrets" on tracking_secrets;
create policy "Admin read tracking secrets" on tracking_secrets
  for select using (is_admin());

drop policy if exists "Admin insert tracking secrets" on tracking_secrets;
create policy "Admin insert tracking secrets" on tracking_secrets
  for insert with check (is_admin());

drop policy if exists "Admin update tracking secrets" on tracking_secrets;
create policy "Admin update tracking secrets" on tracking_secrets
  for update using (is_admin()) with check (is_admin());

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

alter table product_page_configs
  add column if not exists product_id uuid references products(id) on delete cascade;

create index if not exists product_page_configs_product_id_idx
  on product_page_configs (product_id);

update product_page_configs ppc
set product_id = p.id
from products p
where ppc.product_id is null
  and ppc.slug = p.slug;

update product_page_configs ppc
set
  product_id = p.id,
  slug = 'collagen-glow'
from products p
where p.slug = 'collagen-glow'
  and ppc.slug = 'glow';

update product_page_configs ppc
set product_id = p.id
from products p
where ppc.product_id is null
  and p.slug = 'collagen-glow'
  and ppc.slug in ('glow', 'collagen-glow');

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
-- Review avatar migration (run supabase/review-avatars-migration.sql)
-- Homepage orphan section cleanup (run supabase/home-cleanup-orphan-sections.sql)
-- Tracking settings columns + CAPI secrets (run supabase/tracking-settings-columns.sql)
-- See tracking-settings-columns.sql
-- Product builder product_id column (also in ensure-migrations.sql above)
-- See product-builder-product-id-migration.sql
-- See home-transformations-sync.sql

notify pgrst, 'reload schema';
