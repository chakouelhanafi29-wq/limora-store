-- Ensures all 3 official LIMORA products exist (including Feminine Balance).
-- Safe to run multiple times. Also migrates legacy detox-cleanse slug when needed.

create or replace function ensure_official_limora_products()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  detox_id uuid;
  feminine_id uuid;
  product_row record;
begin
  select id into detox_id from products where slug = 'detox-cleanse' limit 1;
  select id into feminine_id from products where slug = 'feminine-balance' limit 1;

  if detox_id is not null and feminine_id is null then
    update products
    set
      slug = 'feminine-balance',
      name_ar = 'LIMORA Feminine Balance',
      name_en = 'LIMORA Feminine Balance',
      subtitle = 'دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم',
      description = 'بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — عناية أنثوية يومية فاخرة.',
      price = 229,
      original_price = 299,
      badge = 'حصري',
      is_featured = true,
      is_active = true,
      sort_order = 3,
      bullets = '["دعم يومي للتوازن الأنثوي","انتعاش وثقة طوال اليوم","عناية أنثوية لطيفة وفاخرة","بريبيوتيك + بروبيوتيك + Cranberry"]'::jsonb,
      urgency_text = '✨ عرض قطعتين بـ 329 ر.س + شحن مجاني',
      updated_at = now()
    where id = detox_id;

    update product_page_configs
    set slug = 'feminine-balance', updated_at = now()
    where slug = 'detox-cleanse';
  end if;

  insert into products (
    slug, name_ar, name_en, subtitle, description, price, original_price,
    badge, is_featured, is_active, sort_order, bullets, urgency_text
  )
  values
    (
      'collagen-glow',
      'LIMORA Collagen Glow',
      'LIMORA Collagen Glow',
      'كولاجين بحري فاخر — لبشرة متوهجة، أكثر تماسكاً وشباباً ✨',
      'كولاجين بحري فاخر + فيتامين C + بيوتين + هيالورونيك أسيد — لبشرة متوهجة، مرنة، وأكثر شباباً.',
      199, 289, 'الأكثر طلباً', true, true, 1,
      '["بشرة متوهجة ومرنة","كولاجين بحري فاخر","فيتامين C + بيوتين + هيالورونيك","سهل الاستخدام يومياً"]'::jsonb,
      '✨ العرض الأقوى — عرض قطعتين بـ 249 ر.س + شحن مجاني'
    ),
    (
      'hair-revive',
      'LIMORA Hair Revive',
      'LIMORA Hair Revive',
      'تركيبة لنمو الشعر وتقويته — لشعر أكثر كثافة، قوة وصحة',
      'كولاجين + بيوتين + كيراتين + زنك + سيليكا + فيتامين E — لنمو الشعر وتقويته.',
      249, 329, 'الأكثر مبيعاً', true, true, 2,
      '["تحفيز نمو الشعر","شعر أقوى وأقل تساقطاً","كثافة ولمعان طبيعي","كولاجين + بيوتين + كيراتين"]'::jsonb,
      '✨ عرض قطعتين بـ 349 ر.س + شحن مجاني'
    ),
    (
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
    is_active = excluded.is_active,
    is_featured = excluded.is_featured,
    sort_order = excluded.sort_order,
    updated_at = now();

  for product_row in
    select id, slug from products
    where slug in ('collagen-glow', 'hair-revive', 'feminine-balance')
  loop
    if not exists (
      select 1 from product_images pi where pi.product_id = product_row.id
    ) then
      if product_row.slug = 'collagen-glow' then
        insert into product_images (product_id, url, storage_path, sort_order, is_primary)
        values
          (product_row.id, '/products/collagen-glow/hero.webp', 'products/collagen-glow/hero.webp', 1, true),
          (product_row.id, '/products/collagen-glow/01-before-after-hero.webp', 'products/collagen-glow/01-before-after-hero.webp', 2, false);
      elsif product_row.slug = 'hair-revive' then
        insert into product_images (product_id, url, storage_path, sort_order, is_primary)
        values (product_row.id, '/products/hair-revive/hero.webp', 'products/hair-revive/hero.webp', 1, true);
      else
        insert into product_images (product_id, url, storage_path, sort_order, is_primary)
        values (product_row.id, '/products/feminine-balance/hero.webp', 'products/feminine-balance/hero.webp', 1, true);
      end if;
    end if;

    if not exists (
      select 1 from product_offers po where po.product_id = product_row.id
    ) then
      if product_row.slug = 'collagen-glow' then
        insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
        select product_row.id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 199, null, false, 1
        union all select product_row.id, 'قطعتان', 'عرض قطعتين', 2, 249, 'الأكثر طلباً', true, 2
        union all select product_row.id, '3 قطع', 'عرض 3 قطع', 3, 299, 'أفضل قيمة', false, 3;
      elsif product_row.slug = 'hair-revive' then
        insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
        select product_row.id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 249, null, false, 1
        union all select product_row.id, 'قطعتان', 'عرض قطعتين', 2, 349, 'الأكثر طلباً', true, 2
        union all select product_row.id, '3 قطع', 'عرض 3 قطع', 3, 449, 'أفضل قيمة', false, 3;
      else
        insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
        select product_row.id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 229, null, false, 1
        union all select product_row.id, 'قطعتان', 'عرض قطعتين', 2, 329, 'الأكثر طلباً', true, 2
        union all select product_row.id, '3 قطع', 'عرض 3 قطع', 3, 429, 'أفضل قيمة', false, 3;
      end if;
    end if;
  end loop;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function ensure_official_limora_products() from public;
grant execute on function ensure_official_limora_products() to authenticated;

select ensure_official_limora_products();
