-- LIMORA: tracking & analytics settings columns (safe for existing databases)
-- Run in Supabase SQL Editor if Admin → Settings save fails with schema cache errors.
-- Idempotent: safe to run multiple times.

-- Core tracking pixel columns on settings (Meta uses facebook_pixel_id)
alter table settings add column if not exists facebook_pixel_id text;
alter table settings add column if not exists tiktok_pixel_id text;
alter table settings add column if not exists snapchat_pixel_id text;
alter table settings add column if not exists google_analytics_id text;
alter table settings add column if not exists google_tag_manager_id text;

-- Other settings columns referenced by admin / storefront (older DBs may lack these)
alter table settings add column if not exists whatsapp_number text;
alter table settings add column if not exists free_shipping boolean default true;
alter table settings add column if not exists cod_enabled boolean default true;
alter table settings add column if not exists announcement_1 text;
alter table settings add column if not exists announcement_2 text;
alter table settings add column if not exists announcement_3 text;
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
alter table settings add column if not exists updated_at timestamptz default now();

-- Ensure singleton settings row exists
insert into settings (id) values (1) on conflict (id) do nothing;

-- Server-side CAPI tokens (admin-only; separate from public settings)
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

-- Reload PostgREST schema cache so API immediately sees new columns
notify pgrst, 'reload schema';
