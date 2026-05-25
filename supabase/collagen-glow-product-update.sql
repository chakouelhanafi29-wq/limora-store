-- Update LIMORA flagship product to Collagen Glow (safe for existing databases)

update products
set
  name_ar = 'LIMORA Collagen Glow',
  name_en = 'LIMORA Collagen Glow',
  subtitle = 'كولاجين بحري فاخر لبشرة أكثر إشراقًا، مرونة وشبابًا ✨',
  description = 'كولاجين بحري فاخر غني بالهيالورونيك أسيد والبيوتين — لبشرة متوهجة، مرنة، وأكثر شبابًا.',
  price = 199,
  original_price = 289,
  badge = 'الأكثر طلباً',
  bullets = '["جمالك يبدأ من الداخل","بشرة أكثر إشراقًا ونضارة","تركيبة بحرية فاخرة","سهل الاستخدام يومياً"]'::jsonb,
  urgency_text = '✨ العرض الأقوى — الأكثر طلباً: عرض قطعتين بـ 249 ر.س'
where slug = 'glow';

update product_offers po
set badge = 'أفضل قيمة', display_label = 'عرض 3 قطع'
from products p
where p.slug = 'glow'
  and po.product_id = p.id
  and po.quantity = 3;

update product_offers po
set badge = 'الأكثر طلباً', display_label = 'عرض قطعتين', is_recommended = true
from products p
where p.slug = 'glow'
  and po.product_id = p.id
  and po.quantity = 2;

-- Reset saved page builder config so new defaults apply
delete from product_page_configs where slug = 'glow';

update reviews
set product_label = 'LIMORA Collagen Glow'
where product_label ilike '%glow%' or product_label ilike '%جلو%';

-- Official Collagen Glow gallery (local optimized assets)
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
