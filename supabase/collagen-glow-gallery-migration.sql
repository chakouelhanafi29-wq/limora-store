-- Replace LIMORA Collagen Glow gallery images (safe for existing databases)

delete from product_images
where product_id in (select id from products where slug = 'glow');

insert into product_images (product_id, url, storage_path, sort_order, is_primary)
select
  p.id,
  v.url,
  v.storage_path,
  v.sort_order,
  v.is_primary
from products p
cross join (
  values
    ('/products/collagen-glow/01-before-after-hero.webp', 'products/collagen-glow/01-before-after-hero.webp', 1, true),
    ('/products/collagen-glow/02-lifestyle-hijabi.webp', 'products/collagen-glow/02-lifestyle-hijabi.webp', 2, false),
    ('/products/collagen-glow/03-benefits-infographic.webp', 'products/collagen-glow/03-benefits-infographic.webp', 3, false),
    ('/products/collagen-glow/04-transformation.webp', 'products/collagen-glow/04-transformation.webp', 4, false)
) as v(url, storage_path, sort_order, is_primary)
where p.slug = 'glow';

-- Reset page builder cache so hero gallery matches database defaults
delete from product_page_configs where slug = 'glow';
