-- LIMORA Analytics Migration
-- Run in Supabase SQL Editor if you already ran the base schema

alter table settings
  add column if not exists snapchat_pixel_id text,
  add column if not exists google_analytics_id text;

alter table orders
  add column if not exists traffic_source text,
  add column if not exists traffic_platform text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists referrer text,
  add column if not exists device_type text,
  add column if not exists landing_page text,
  add column if not exists session_id text;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  product_name text,
  product_slug text,
  offer_label text,
  value numeric(10,2),
  currency text default 'SAR',
  order_id text,
  traffic_source text,
  traffic_platform text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  device_type text,
  session_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists analytics_events_created_at_idx
  on analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx
  on analytics_events (event_name);
create index if not exists analytics_events_session_id_idx
  on analytics_events (session_id);
create index if not exists analytics_events_traffic_platform_idx
  on analytics_events (traffic_platform);
create index if not exists orders_traffic_platform_idx
  on orders (traffic_platform);

alter table analytics_events enable row level security;

create policy "Public insert analytics events" on analytics_events
  for insert with check (true);

create policy "Admin read analytics events" on analytics_events
  for select using (is_admin());
