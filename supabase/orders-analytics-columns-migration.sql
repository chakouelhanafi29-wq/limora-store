-- Safe migration: add optional analytics columns to orders (if missing)
-- Run in Supabase SQL Editor when you see "device_type column not found"

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
  add column if not exists session_id text,
  add column if not exists product_slug text,
  add column if not exists notes text;

create index if not exists orders_traffic_platform_idx
  on orders (traffic_platform);
