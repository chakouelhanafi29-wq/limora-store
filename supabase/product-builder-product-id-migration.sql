-- Link product page builder configs to catalog products (optional FK)
alter table product_page_configs
  add column if not exists product_id uuid references products(id) on delete cascade;

create index if not exists product_page_configs_product_id_idx
  on product_page_configs (product_id);

-- Backfill product_id from slug where possible
update product_page_configs ppc
set product_id = p.id
from products p
where ppc.slug = p.slug
  and ppc.product_id is null;
