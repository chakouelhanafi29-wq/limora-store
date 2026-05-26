-- Add product_id to product_page_configs for per-product dynamic builder saves.
-- Safe to run multiple times (idempotent).

alter table product_page_configs
  add column if not exists product_id uuid references products(id) on delete cascade;

create index if not exists product_page_configs_product_id_idx
  on product_page_configs (product_id);

-- Backfill product_id from matching slug
update product_page_configs ppc
set product_id = p.id
from products p
where ppc.product_id is null
  and ppc.slug = p.slug;

-- Legacy glow slug -> collagen-glow
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

-- Ensure all official products are linked when configs exist
update product_page_configs ppc
set product_id = p.id
from products p
where ppc.product_id is null
  and ppc.slug = p.slug
  and p.slug in ('collagen-glow', 'hair-revive', 'detox-cleanse');

-- Refresh PostgREST schema cache (Supabase)
notify pgrst, 'reload schema';
