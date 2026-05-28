-- Auto-sync homepage "before_after" section with latest LIMORA transformation visuals.
-- Safe to run multiple times (idempotent).

create or replace function sync_home_before_after_managed()
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
  updated boolean := false;
  managed_content constant jsonb := $json$
{
  "label": "REAL TRANSFORMATIONS",
  "title": "تحولٌ حقيقي… تستحقينه",
  "subtitle": "وراء كل إشراقة امرأة اختارت نفسها. LIMORA لا تغيّر مظهركِ فقط — بل تُعيد إليكِ ثقتكِ.",
  "contentRevision": 4,
  "transformations": [
    {
      "productName": "LIMORA Collagen Glow",
      "title": "بشرة تتوهج",
      "emotionalLine": "إشراقة تبدأ من الداخل",
      "description": "إشراقة طبيعية ونعومة كالحرير — بشرة أكثر تماسكاً وشباباً من الداخل.",
      "image": "/home/transformations/collagen-glow.webp",
      "stat": "92%",
      "statLabel": "لاحظن إشراقة خلال 14 يوم",
      "href": "/product/collagen-glow",
      "accent": "rose"
    },
    {
      "productName": "LIMORA Hair Revive",
      "title": "شعرٌ أكثر حياة",
      "emotionalLine": "شعر أكثر قوة… وثقة تدوم",
      "description": "كثافة، لمعان، وقوة من الجذور — شعر أقوى وأقل تساقطاً.",
      "image": "/home/transformations/hair-revive.webp",
      "stat": "88%",
      "statLabel": "لاحظن فرقاً في الكثافة",
      "href": "/product/hair-revive",
      "accent": "gold"
    },
    {
      "productName": "LIMORA Feminine Balance",
      "title": "عناية أنثوية يومية",
      "emotionalLine": "انتعاش وثقة… كل يوم",
      "description": "توازن أنثوي يومي — راحة، انتعاش، وثقة في كل لحظة.",
      "image": "/home/transformations/feminine-balance.webp",
      "stat": "90%",
      "statLabel": "لاحظن راحة يومية أكبر",
      "href": "/product/feminine-balance",
      "accent": "rose"
    }
  ]
}
$json$::jsonb;
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
    elem := sections->i;
    if elem->>'type' = 'before_after' then
      if coalesce((elem->'content'->>'contentRevision')::int, 1) < 4
         or lower(elem->'content'::text) like '%detox%'
         or elem->'content'->'transformations'->2->>'image'
            is distinct from '/home/transformations/feminine-balance.webp' then
        elem := jsonb_set(elem, '{content}', managed_content, true);
        updated := true;
      end if;
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

revoke all on function sync_home_before_after_managed() from public;
grant execute on function sync_home_before_after_managed() to anon, authenticated;

-- Run once now for existing databases
select sync_home_before_after_managed();
