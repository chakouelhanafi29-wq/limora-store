-- Replace LIMORA Detox Cleanse with LIMORA Feminine Balance
-- Run in Supabase SQL editor after deploying the app update.

begin;

update products
set
  slug = 'feminine-balance',
  name_ar = 'LIMORA Feminine Balance',
  name_en = 'LIMORA Feminine Balance',
  subtitle = 'دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم',
  description = 'بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — عناية أنثوية يومية فاخرة.',
  bullets = '["دعم يومي للتوازن الأنثوي","انتعاش وثقة طوال اليوم","عناية أنثوية لطيفة وفاخرة","بريبيوتيك + بروبيوتيك + Cranberry"]'::jsonb,
  badge = 'حصري',
  price = 229,
  original_price = 299,
  sort_order = 3,
  is_active = true
where slug = 'detox-cleanse';

update product_images
set
  url = '/products/feminine-balance/hero.webp',
  storage_path = 'products/feminine-balance/hero.webp',
  sort_order = 1,
  is_primary = true
where product_id in (select id from products where slug = 'feminine-balance');

update product_page_configs
set slug = 'feminine-balance'
where slug = 'detox-cleanse';

delete from product_page_configs
where slug = 'feminine-balance';

update reviews
set
  product_label = 'LIMORA Feminine Balance',
  text = replace(text, 'Detox Cleanse', 'Feminine Balance')
where product_label ilike '%detox%'
   or product_label ilike '%radiance%'
   or product_label ilike '%رادي%'
   or product_label ilike '%feminine balance%';

commit;
