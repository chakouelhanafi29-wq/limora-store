-- LIMORA Ecommerce Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Order status enum
create type order_status as enum (
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

-- Admins (linked to Supabase Auth)
create table if not exists admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  subtitle text,
  description text,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  badge text,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order int default 0,
  bullets jsonb default '[]'::jsonb,
  urgency_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product images
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Product offers (COD bundles)
create table if not exists product_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  display_label text,
  quantity int not null default 1,
  price numeric(10,2) not null,
  badge text,
  is_recommended boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Orders (COD)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  city text not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_slug text,
  offer_id uuid references product_offers(id) on delete set null,
  offer_label text not null,
  offer_quantity int default 1,
  total_price numeric(10,2) not null,
  status order_status default 'pending',
  notes text,
  traffic_source text,
  traffic_platform text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  device_type text,
  landing_page text,
  session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  customer_name text not null,
  location text,
  product_label text,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  content text not null,
  image_url text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Site settings (single row)
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  facebook_pixel_id text,
  tiktok_pixel_id text,
  snapchat_pixel_id text,
  google_analytics_id text,
  google_tag_manager_id text,
  whatsapp_number text,
  free_shipping boolean default true,
  cod_enabled boolean default true,
  announcement_1 text default 'شحن مجاني + الدفع عند الاستلام داخل السعودية',
  announcement_2 text default 'ضمان الجودة على جميع منتجات LIMORA',
  announcement_3 text default 'تخفيضات حصرية لفترة محدودة',
  site_url text,
  site_domain text,
  site_name text default 'LIMORA',
  logo_url text,
  favicon_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,
  twitter_handle text,
  updated_at timestamptz default now()
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- Server-side tracking credentials (admin-only; never exposed to storefront)
create table if not exists tracking_secrets (
  id int primary key default 1 check (id = 1),
  meta_capi_access_token text,
  meta_test_event_code text,
  tiktok_events_access_token text,
  tiktok_test_event_code text,
  snapchat_capi_access_token text,
  snapchat_test_event_code text,
  updated_at timestamptz default now()
);

insert into tracking_secrets (id) values (1) on conflict (id) do nothing;

alter table tracking_secrets enable row level security;

-- Analytics events
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  product_name text,
  product_slug text,
  offer_label text,
  value numeric(10,2),
  currency text default 'SAR',
  order_id text,
  traffic_source text,
  traffic_platform text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  device_type text,
  session_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists analytics_events_created_at_idx
  on analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx
  on analytics_events (event_name);
create index if not exists analytics_events_session_id_idx
  on analytics_events (session_id);
create index if not exists analytics_events_traffic_platform_idx
  on analytics_events (traffic_platform);
create index if not exists orders_traffic_platform_idx
  on orders (traffic_platform);

-- Helper: check admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admins where id = auth.uid()
  );
$$ language sql security definer stable;

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();
create trigger reviews_updated_at before update on reviews
  for each row execute function update_updated_at();
create trigger settings_updated_at before update on settings
  for each row execute function update_updated_at();

-- RLS
alter table admins enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_offers enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table settings enable row level security;
alter table analytics_events enable row level security;

-- Admins: only admins can read admins table
create policy "Admins read own" on admins for select using (is_admin());

-- Products: public read active, admin full
create policy "Public read active products" on products
  for select using (is_active = true);
create policy "Admin all products" on products
  for all using (is_admin()) with check (is_admin());

-- Product images
create policy "Public read images" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_id and p.is_active = true)
  );
create policy "Admin all images" on product_images
  for all using (is_admin()) with check (is_admin());

-- Product offers
create policy "Public read offers" on product_offers
  for select using (
    exists (select 1 from products p where p.id = product_id and p.is_active = true)
  );
create policy "Admin all offers" on product_offers
  for all using (is_admin()) with check (is_admin());

-- Orders: public insert only, admin read/update/delete
create policy "Public insert orders" on orders
  for insert
  to anon, authenticated
  with check (true);
create policy "Admin read orders" on orders
  for select
  to authenticated
  using (is_admin());
create policy "Admin update orders" on orders
  for update
  to authenticated
  using (is_admin())
  with check (is_admin());
create policy "Admin delete orders" on orders
  for delete
  to authenticated
  using (is_admin());

-- Reviews: public read active, admin full
create policy "Public read active reviews" on reviews
  for select using (is_active = true);
create policy "Admin all reviews" on reviews
  for all using (is_admin()) with check (is_admin());

-- Settings: public read (for storefront), admin write
create policy "Public read settings" on settings for select using (true);
create policy "Admin update settings" on settings
  for update using (is_admin()) with check (is_admin());

create policy "Admin read tracking secrets" on tracking_secrets
  for select using (is_admin());
create policy "Admin insert tracking secrets" on tracking_secrets
  for insert with check (is_admin());
create policy "Admin update tracking secrets" on tracking_secrets
  for update using (is_admin()) with check (is_admin());

-- Analytics events: public insert, admin read
create policy "Public insert analytics events" on analytics_events
  for insert with check (true);
create policy "Admin read analytics events" on analytics_events
  for select using (is_admin());

-- Product page builder configs
create table if not exists product_page_configs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  slug text not null unique,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists product_page_configs_product_id_idx
  on product_page_configs (product_id);

create index if not exists product_page_configs_slug_idx
  on product_page_configs (slug);

alter table product_page_configs enable row level security;

create policy "Public read product page configs" on product_page_configs
  for select using (true);
create policy "Admin manage product page configs" on product_page_configs
  for all using (is_admin()) with check (is_admin());

-- Homepage builder configs
create table if not exists home_page_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique default 'home',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists home_page_configs_slug_idx
  on home_page_configs (slug);

alter table home_page_configs enable row level security;

create policy "Public read home page configs" on home_page_configs
  for select using (true);
create policy "Admin manage home page configs" on home_page_configs
  for all using (is_admin()) with check (is_admin());

-- Storage bucket for product images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

create policy "Public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admin upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and is_admin());

create policy "Admin update product images"
on storage.objects for update
using (bucket_id = 'product-images' and is_admin());

create policy "Admin delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and is_admin());

create policy "Admin delete orders" on orders
  for delete
  to authenticated
  using (is_admin());

-- Storefront order RPC (bypasses SELECT RLS on RETURNING for anonymous checkout)
create or replace function create_storefront_order(
  p_customer_name text,
  p_phone text,
  p_product_name text,
  p_offer_label text,
  p_total_price numeric,
  p_city text default 'يتم التأكيد هاتفياً',
  p_product_id uuid default null,
  p_product_slug text default null,
  p_offer_id uuid default null,
  p_offer_quantity int default 1,
  p_notes text default null,
  p_traffic_source text default null,
  p_traffic_platform text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null,
  p_utm_term text default null,
  p_referrer text default null,
  p_device_type text default null,
  p_landing_page text default null,
  p_session_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into orders (
    customer_name, phone, city, product_id, product_name, product_slug,
    offer_id, offer_label, offer_quantity, total_price, status, notes,
    traffic_source, traffic_platform, utm_source, utm_medium, utm_campaign,
    utm_content, utm_term, referrer, device_type, landing_page, session_id
  ) values (
    p_customer_name,
    p_phone,
    coalesce(nullif(trim(p_city), ''), 'يتم التأكيد هاتفياً'),
    p_product_id,
    p_product_name,
    p_product_slug,
    p_offer_id,
    p_offer_label,
    coalesce(p_offer_quantity, 1),
    p_total_price,
    'pending',
    p_notes,
    p_traffic_source,
    p_traffic_platform,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_content,
    p_utm_term,
    p_referrer,
    p_device_type,
    p_landing_page,
    p_session_id
  )
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text,
  text, text, text, text, text, text, text, text, text, text, text
) from public;

grant execute on function create_storefront_order(
  text, text, text, text, numeric, text, uuid, text, uuid, int, text,
  text, text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

-- Realtime for live order updates in admin
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
end $$;

-- Seed official LIMORA products
insert into products (slug, name_ar, name_en, subtitle, description, price, original_price, badge, is_featured, sort_order, bullets, urgency_text)
values
  (
    'collagen-glow',
    'LIMORA Collagen Glow',
    'LIMORA Collagen Glow',
    'كولاجين بحري فاخر — لبشرة متوهجة، أكثر تماسكاً وشباباً ✨',
    'كولاجين بحري فاخر + فيتامين C + بيوتين + هيالورونيك أسيد — لبشرة متوهجة، مرنة، وأكثر شباباً.',
    199, 289, 'الأكثر طلباً', true, 1,
    '["بشرة متوهجة ومرنة","كولاجين بحري فاخر","فيتامين C + بيوتين + هيالورونيك","سهل الاستخدام يومياً"]'::jsonb,
    '✨ العرض الأقوى — عرض قطعتين بـ 249 ر.س + شحن مجاني'
  ),
  (
    'hair-revive',
    'LIMORA Hair Revive',
    'LIMORA Hair Revive',
    'تركيبة لنمو الشعر وتقويته — لشعر أكثر كثافة، قوة وصحة',
    'كولاجين + بيوتين + كيراتين + زنك + سيليكا + فيتامين E — لنمو الشعر وتقويته.',
    249, 329, 'الأكثر مبيعاً', true, 2,
    '["تحفيز نمو الشعر","شعر أقوى وأقل تساقطاً","كثافة ولمعان طبيعي","كولاجين + بيوتين + كيراتين"]'::jsonb,
    '✨ عرض قطعتين بـ 349 ر.س + شحن مجاني'
  ),
  (
    'feminine-balance',
    'LIMORA Feminine Balance',
    'LIMORA Feminine Balance',
    'دعم يومي للتوازن الأنثوي والانتعاش — لثقة وراحة كل يوم',
    'بريبيوتيك + بروبيوتيك + Cranberry + فيتامين C + مستخلصات طبيعية — عناية أنثوية يومية فاخرة.',
    229, 299, 'حصري', true, 3,
    '["دعم يومي للتوازن الأنثوي","انتعاش وثقة طوال اليوم","عناية أنثوية لطيفة وفاخرة","بريبيوتيك + بروبيوتيك + Cranberry"]'::jsonb,
    '✨ عرض قطعتين بـ 329 ر.س + شحن مجاني'
  )
on conflict (slug) do nothing;

insert into product_images (product_id, url, storage_path, sort_order, is_primary)
select p.id, v.url, v.storage_path, v.sort_order, v.is_primary
from products p
cross join (
  values
    ('collagen-glow', '/products/collagen-glow/hero.webp', 'products/collagen-glow/hero.webp', 1, true),
    ('collagen-glow', '/products/collagen-glow/01-before-after-hero.webp', 'products/collagen-glow/01-before-after-hero.webp', 2, false),
    ('hair-revive', '/products/hair-revive/hero.webp', 'products/hair-revive/hero.webp', 1, true),
    ('feminine-balance', '/products/feminine-balance/hero.webp', 'products/feminine-balance/hero.webp', 1, true)
) as v(slug, url, storage_path, sort_order, is_primary)
where p.slug = v.slug
and not exists (
  select 1 from product_images pi where pi.product_id = p.id
);

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select p.id, v.label, v.display_label, v.quantity, v.price, v.badge, v.is_recommended, v.sort_order
from products p
cross join (
  values
    ('collagen-glow', 'قطعة واحدة', 'عرض قطعة واحدة', 1, 199, null::text, false, 1),
    ('collagen-glow', 'قطعتان', 'عرض قطعتين', 2, 249, 'الأكثر طلباً', true, 2),
    ('collagen-glow', '3 قطع', 'عرض 3 قطع', 3, 299, 'أفضل قيمة', false, 3),
    ('hair-revive', 'قطعة واحدة', 'عرض قطعة واحدة', 1, 249, null::text, false, 1),
    ('hair-revive', 'قطعتان', 'عرض قطعتين', 2, 349, 'الأكثر طلباً', true, 2),
    ('hair-revive', '3 قطع', 'عرض 3 قطع', 3, 449, 'أفضل قيمة', false, 3),
    ('feminine-balance', 'قطعة واحدة', 'عرض قطعة واحدة', 1, 229, null::text, false, 1),
    ('feminine-balance', 'قطعتان', 'عرض قطعتين', 2, 329, 'الأكثر طلباً', true, 2),
    ('feminine-balance', '3 قطع', 'عرض 3 قطع', 3, 429, 'أفضل قيمة', false, 3)
) as v(slug, label, display_label, quantity, price, badge, is_recommended, sort_order)
where p.slug = v.slug
and not exists (
  select 1 from product_offers po
  where po.product_id = p.id and po.quantity = v.quantity
);

-- Seed homepage reviews
insert into reviews (customer_name, location, product_label, rating, content, image_url, sort_order)
select * from (values
  ('نورة العتيبي', 'الرياض', 'LIMORA Collagen Glow', 5, 'Collagen Glow غيّر بشرتي فعلاً. الإشراقة ظهرت خلال أسبوعين — اليوم أخرج بدون تغطية كثيرة.', '/reviews/noura-alotaibi.webp', 1),
  ('فاطمة الدوسري', 'جدة', 'LIMORA Hair Revive', 5, 'تساقط شعري كان يقلقني. Hair Revive خلّاني أشوف كثافة حقيقية خلال شهر — والدفع عند الاستلام خلّاني أجرب بدون تردد.', '/reviews/fatima-aldosari.webp', 2),
  ('مريم القحطاني', 'الدمام', 'LIMORA Feminine Balance', 5, 'Feminine Balance هو اللي كنت أدور عليه — انتعاش يومي وثقة في كل لحظة. المجموعة الثلاثية صارت روتيني الكامل.', '/reviews/maryam-alqahtani.webp', 3)
) as seed(customer_name, location, product_label, rating, content, image_url, sort_order)
where not exists (select 1 from reviews limit 1);
