-- Fix orders RLS for public COD checkout
-- Run in Supabase SQL Editor (idempotent — safe to run multiple times)

-- ─── Drop legacy/conflicting policies ───────────────────────────────────────
drop policy if exists "Public insert orders" on orders;
drop policy if exists "Admin all orders" on orders;
drop policy if exists "Admin read orders" on orders;
drop policy if exists "Admin update orders" on orders;
drop policy if exists "Admin delete orders" on orders;

-- ─── Public: INSERT only (anonymous + authenticated storefront) ───────────
create policy "Public insert orders" on orders
  for insert
  to anon, authenticated
  with check (true);

-- ─── Admin: SELECT / UPDATE / DELETE only ───────────────────────────────────
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

-- ─── Secure insert function (returns id without public SELECT on orders) ─────
-- Direct INSERT … RETURNING fails for anon users because SELECT is admin-only.
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
  p_notes text default null
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
    customer_name,
    phone,
    city,
    product_id,
    product_name,
    product_slug,
    offer_id,
    offer_label,
    offer_quantity,
    total_price,
    status,
    notes
  ) values (
    p_customer_name,
    p_phone,
    p_city,
    p_product_id,
    p_product_name,
    p_product_slug,
    p_offer_id,
    p_offer_label,
    coalesce(p_offer_quantity, 1),
    p_total_price,
    'pending',
    p_notes
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text
) from public;

grant execute on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text
) to anon, authenticated;
