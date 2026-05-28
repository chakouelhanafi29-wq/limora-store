-- LIMORA: storefront COD checkout RPC (create_storefront_order)
-- Run in Supabase SQL Editor if COD fails with:
--   Could not find the function public.create_storefront_order(...) in the schema cache
-- Idempotent: safe to run multiple times.

-- ─── Orders columns required by checkout + attribution ─────────────────────
alter table orders add column if not exists city text;
alter table orders add column if not exists product_slug text;
alter table orders add column if not exists notes text;
alter table orders add column if not exists traffic_source text;
alter table orders add column if not exists traffic_platform text;
alter table orders add column if not exists utm_source text;
alter table orders add column if not exists utm_medium text;
alter table orders add column if not exists utm_campaign text;
alter table orders add column if not exists utm_content text;
alter table orders add column if not exists utm_term text;
alter table orders add column if not exists referrer text;
alter table orders add column if not exists device_type text;
alter table orders add column if not exists landing_page text;
alter table orders add column if not exists session_id text;

update orders
set city = coalesce(nullif(trim(city), ''), 'يتم التأكيد هاتفياً')
where city is null or trim(city) = '';

create index if not exists orders_traffic_platform_idx
  on orders (traffic_platform);

-- ─── RLS: public INSERT, admin read/update/delete ───────────────────────────
drop policy if exists "Public insert orders" on orders;
drop policy if exists "Admin all orders" on orders;
drop policy if exists "Admin read orders" on orders;
drop policy if exists "Admin update orders" on orders;
drop policy if exists "Admin delete orders" on orders;

create policy "Public insert orders" on orders
  for insert
  to anon, authenticated
  with check (true);

create policy "Admin read orders" on orders
  for select
  to authenticated
  using (is_admin());

create policy "Admin update orders" on orders
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Admin delete orders" on orders
  for delete
  to authenticated
  using (is_admin());

-- ─── Drop legacy signatures before creating the canonical function ───────────
drop function if exists create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text
);

drop function if exists create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text,
  text, text, text, text, text, text, text, text, text, text, text
);

-- ─── Secure insert RPC (returns order id without public SELECT on orders) ───
create or replace function create_storefront_order(
  p_customer_name text,
  p_phone text,
  p_product_name text,
  p_offer_label text,
  p_total_price numeric,
  p_city text default 'يتم التأكيد هاتفياً',
  p_product_id uuid default null,
  p_product_slug text default null,
  p_offer_id uuid default null,
  p_offer_quantity int default 1,
  p_notes text default null,
  p_traffic_source text default null,
  p_traffic_platform text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_utm_term text default null,
  p_referrer text default null,
  p_device_type text default null,
  p_landing_page text default null,
  p_session_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into orders (
    customer_name, phone, city, product_id, product_name, product_slug,
    offer_id, offer_label, offer_quantity, total_price, status, notes,
    traffic_source, traffic_platform, utm_source, utm_medium, utm_campaign,
    utm_content, utm_term, referrer, device_type, landing_page, session_id
  ) values (
    p_customer_name,
    p_phone,
    coalesce(nullif(trim(p_city), ''), 'يتم التأكيد هاتفياً'),
    p_product_id,
    p_product_name,
    p_product_slug,
    p_offer_id,
    p_offer_label,
    coalesce(p_offer_quantity, 1),
    p_total_price,
    'pending',
    p_notes,
    p_traffic_source,
    p_traffic_platform,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_content,
    p_utm_term,
    p_referrer,
    p_device_type,
    p_landing_page,
    p_session_id
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text,
  text, text, text, text, text, text, text, text, text, text, text
) from public;

grant execute on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text,
  text, text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

-- Reload PostgREST schema cache immediately
notify pgrst, 'reload schema';
