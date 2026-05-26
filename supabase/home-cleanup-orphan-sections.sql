-- Remove legacy homepage sections that cause blank image blocks after FAQ.
-- Safe to run multiple times.

create or replace function sync_home_cleanup_orphan_sections()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  cfg jsonb;
  sections jsonb;
  next_sections jsonb := '[]'::jsonb;
  elem jsonb;
  i int;
  faq_order int := null;
  updated boolean := false;
  products jsonb;
  cleaned_products jsonb;
  p jsonb;
  j int;
begin
  select config into cfg
  from home_page_configs
  where slug = 'home'
  limit 1;

  if cfg is null then
    return false;
  end if;

  sections := coalesce(cfg->'sections', '[]'::jsonb);

  for i in 0 .. jsonb_array_length(sections) - 1 loop
    if sections->i->>'type' = 'faq' then
      faq_order := coalesce((sections->i->>'order')::int, i);
      exit;
    end if;
  end loop;

  for i in 0 .. jsonb_array_length(sections) - 1 loop
    elem := sections->i;

    if faq_order is not null
       and elem->>'type' = 'brand_story'
       and coalesce((elem->>'order')::int, i) >= faq_order then
      updated := true;
      continue;
    end if;

    if elem->>'type' = 'promo_banner'
       and not coalesce(elem->'content'->>'title', '') like '%مجموعة LIMORA%' then
      elem := elem - 'products';
      elem := jsonb_set(
        elem,
        '{content}',
        (elem->'content') - 'products' - 'priceNote' - 'image',
        true
      );
      updated := true;
    end if;

    if elem->>'type' = 'promo_banner'
       and coalesce(elem->'content'->>'title', '') like '%مجموعة LIMORA%' then
      products := coalesce(elem->'content'->'products', '[]'::jsonb);
      cleaned_products := '[]'::jsonb;
      for j in 0 .. jsonb_array_length(products) - 1 loop
        p := products->j;
        if coalesce(p->>'image', '') <> '' then
          cleaned_products := cleaned_products || jsonb_build_array(p);
        end if;
      end loop;
      elem := jsonb_set(elem, '{content,products}', cleaned_products, true);
      updated := true;
    end if;

    next_sections := next_sections || jsonb_build_array(elem);
  end loop;

  if updated then
    update home_page_configs
    set
      config = jsonb_set(cfg, '{sections}', next_sections, true),
      updated_at = now()
    where slug = 'home';
  end if;

  return updated;
end;
$$;

revoke all on function sync_home_cleanup_orphan_sections() from public;
grant execute on function sync_home_cleanup_orphan_sections() to anon, authenticated;

select sync_home_cleanup_orphan_sections();
