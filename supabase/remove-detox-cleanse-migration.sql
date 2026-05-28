-- Permanently remove LIMORA Detox Cleanse from Supabase.
-- Safe to run after Feminine Balance is live.
-- Does not affect Collagen Glow, Hair Revive, or Feminine Balance.

begin;

-- Remove legacy builder configs
delete from product_page_configs
where slug = 'detox-cleanse';

-- Remove orphaned offers and images
delete from product_offers
where product_id in (select id from products where slug = 'detox-cleanse');

delete from product_images
where product_id in (select id from products where slug = 'detox-cleanse');

-- Remove legacy product row (if still present)
delete from products
where slug = 'detox-cleanse';

-- Normalize any remaining review references
update reviews
set
  product_label = 'LIMORA Feminine Balance',
  content = replace(replace(content, 'Detox Cleanse', 'Feminine Balance'), 'detox cleanse', 'Feminine Balance')
where product_label ilike '%detox%'
   or product_label ilike '%Detox Cleanse%'
   or content ilike '%detox cleanse%'
   or content ilike '%Detox Cleanse%';

commit;

-- Refresh PostgREST schema cache (Supabase)
notify pgrst, 'reload schema';
