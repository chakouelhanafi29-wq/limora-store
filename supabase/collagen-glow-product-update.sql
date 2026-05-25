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
