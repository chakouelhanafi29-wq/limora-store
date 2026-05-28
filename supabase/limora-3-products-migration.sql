-- LIMORA: migrate store to 3 official products only
-- Run in Supabase SQL Editor after backing up your database.

begin;

-- 1) Rename legacy glow slug to collagen-glow
update products
set
  slug = 'collagen-glow',
  name_ar = 'LIMORA Collagen Glow',
  name_en = 'LIMORA Collagen Glow',
  subtitle = 'كولاجين بحري فاخر — لبشرة متوهجة، أكثر تماسكاً وشباباً ✨',
  description = 'كولاجين بحري فاخر + فيتامين C + بيوتين + هيالورونيك أسيد — لبشرة متوهجة، مرنة، وأكثر شباباً.',
  price = 199,
  original_price = 289,
  badge = 'الأكثر طلباً',
  is_featured = true,
  sort_order = 1,
  bullets = '["بشرة متوهجة ومرنة","كولاجين بحري فاخر","فيتامين C + بيوتين + هيالورونيك","سهل الاستخدام يومياً"]'::jsonb,
  urgency_text = '✨ العرض الأقوى — عرض قطعتين بـ 249 ر.س + شحن مجاني'
where slug = 'glow';

update product_page_configs
set slug = 'collagen-glow'
where slug = 'glow';

-- 2) Insert Hair Revive
insert into products (
  slug, name_ar, name_en, subtitle, description, price, original_price,
  badge, is_featured, is_active, sort_order, bullets, urgency_text
)
values (
  'hair-revive',
  'LIMORA Hair Revive',
  'LIMORA Hair Revive',
  'تركيبة لنمو الشعر وتقويته — لشعر أكثر كثافة، قوة وصحة',
  'كولاجين + بيوتين + كيراتين + زنك + سيليكا + فيتامين E — لنمو الشعر وتقويته.',
  249, 329, 'الأكثر مبيعاً', true, true, 2,
  '["تحفيز نمو الشعر","شعر أقوى وأقل تساقطاً","كثافة ولمعان طبيعي","كولاجين + بيوتين + كيراتين"]'::jsonb,
  '✨ عرض قطعتين بـ 349 ر.س + شحن مجاني'
)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price = excluded.price,
  original_price = excluded.original_price,
  badge = excluded.badge,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  bullets = excluded.bullets,
  urgency_text = excluded.urgency_text;

-- 3) Insert Feminine Balance
insert into products (
  slug, name_ar, name_en, subtitle, description, price, original_price,
  badge, is_featured, is_active, sort_order, bullets, urgency_text
)
values (
  'feminine-balance',
  'LIMORA Feminine Balance',
  'LIMORA Feminine Balance',
  'دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم',
  'بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — عناية أنثوية يومية فاخرة.',
  229, 299, 'حصري', true, true, 3,
  '["دعم يومي للتوازن الأنثوي","انتعاش وثقة طوال اليوم","عناية أنثوية لطيفة وفاخرة","بريبيوتيك + بروبيوتيك + Cranberry"]'::jsonb,
  '✨ عرض قطعتين بـ 329 ر.س + شحن مجاني'
)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price = excluded.price,
  original_price = excluded.original_price,
  badge = excluded.badge,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  bullets = excluded.bullets,
  urgency_text = excluded.urgency_text;

-- 4) Remove demo / placeholder products
delete from product_page_configs
where slug not in ('collagen-glow', 'hair-revive', 'feminine-balance');

delete from product_offers
where product_id in (
  select id from products
  where slug not in ('collagen-glow', 'hair-revive', 'feminine-balance')
);

delete from product_images
where product_id in (
  select id from products
  where slug not in ('collagen-glow', 'hair-revive', 'feminine-balance')
);

delete from products
where slug not in ('collagen-glow', 'hair-revive', 'feminine-balance');

-- 5) Refresh Collagen Glow images
delete from product_images
where product_id in (select id from products where slug = 'collagen-glow');

insert into product_images (product_id, url, storage_path, sort_order, is_primary)
select p.id, v.url, v.storage_path, v.sort_order, v.is_primary
from products p
cross join (
  values
    ('/products/collagen-glow/hero.webp', 'products/collagen-glow/hero.webp', 1, true),
    ('/products/collagen-glow/01-before-after-hero.webp', 'products/collagen-glow/01-before-after-hero.webp', 2, false)
) as v(url, storage_path, sort_order, is_primary)
where p.slug = 'collagen-glow';

-- 6) Hair Revive images
delete from product_images
where product_id in (select id from products where slug = 'hair-revive');

insert into product_images (product_id, url, storage_path, sort_order, is_primary)
select p.id, '/products/hair-revive/hero.webp', 'products/hair-revive/hero.webp', 1, true
from products p
where p.slug = 'hair-revive';

-- 7) Feminine Balance images
delete from product_images
where product_id in (select id from products where slug = 'feminine-balance');

insert into product_images (product_id, url, storage_path, sort_order, is_primary)
select p.id, '/products/feminine-balance/hero.webp', 'products/feminine-balance/hero.webp', 1, true
from products p
where p.slug = 'feminine-balance';

-- 8) Offers — Collagen Glow
delete from product_offers
where product_id in (select id from products where slug = 'collagen-glow');

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 199, null, false, 1 from products where slug = 'collagen-glow'
union all
select id, 'قطعتان', 'عرض قطعتين', 2, 249, 'الأكثر طلباً', true, 2 from products where slug = 'collagen-glow'
union all
select id, '3 قطع', 'عرض 3 قطع', 3, 299, 'أفضل قيمة', false, 3 from products where slug = 'collagen-glow';

-- 9) Offers — Hair Revive
delete from product_offers
where product_id in (select id from products where slug = 'hair-revive');

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 249, null, false, 1 from products where slug = 'hair-revive'
union all
select id, 'قطعتان', 'عرض قطعتين', 2, 349, 'الأكثر طلباً', true, 2 from products where slug = 'hair-revive'
union all
select id, '3 قطع', 'عرض 3 قطع', 3, 449, 'أفضل قيمة', false, 3 from products where slug = 'hair-revive';

-- 10) Offers — Feminine Balance
delete from product_offers
where product_id in (select id from products where slug = 'feminine-balance');

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 229, null, false, 1 from products where slug = 'feminine-balance'
union all
select id, 'قطعتان', 'عرض قطعتين', 2, 329, 'الأكثر طلباً', true, 2 from products where slug = 'feminine-balance'
union all
select id, '3 قطع', 'عرض 3 قطع', 3, 429, 'أفضل قيمة', false, 3 from products where slug = 'feminine-balance';

-- 11) Reset product page configs so builders pick up new defaults
delete from product_page_configs
where slug in ('collagen-glow', 'hair-revive', 'feminine-balance');

-- 12) Update homepage reviews to official products
update reviews set product_label = 'LIMORA Collagen Glow'
where product_label ilike '%collagen%' or product_label ilike '%glow%' or product_label ilike '%جلو%';

update reviews set product_label = 'LIMORA Hair Revive'
where product_label ilike '%hair%' or product_label ilike '%هير%';

update reviews set product_label = 'LIMORA Feminine Balance'
where product_label ilike '%feminine%' or product_label ilike '%radiance%' or product_label ilike '%رادي%';

commit;
