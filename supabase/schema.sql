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

-- Orders: public insert, admin read/update
create policy "Public insert orders" on orders
  for insert with check (true);
create policy "Admin all orders" on orders
  for all using (is_admin()) with check (is_admin());

-- Reviews: public read active, admin full
create policy "Public read active reviews" on reviews
  for select using (is_active = true);
create policy "Admin all reviews" on reviews
  for all using (is_admin()) with check (is_admin());

-- Settings: public read (for storefront), admin write
create policy "Public read settings" on settings for select using (true);
create policy "Admin update settings" on settings
  for update using (is_admin()) with check (is_admin());

-- Analytics events: public insert, admin read
create policy "Public insert analytics events" on analytics_events
  for insert with check (true);
create policy "Admin read analytics events" on analytics_events
  for select using (is_admin());

-- Product page builder configs
create table if not exists product_page_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

-- Seed default product
insert into products (slug, name_ar, name_en, subtitle, description, price, original_price, badge, is_featured, bullets, urgency_text)
values (
  'glow',
  'LIMORA Collagen Glow',
  'LIMORA Collagen Glow',
  'كولاجين بحري فاخر لبشرة أكثر إشراقًا، مرونة وشبابًا ✨',
  'كولاجين بحري فاخر غني بالهيالورونيك أسيد والبيوتين — لبشرة متوهجة، مرنة، وأكثر شبابًا.',
  199, 289, 'الأكثر طلباً', true,
  '["جمالك يبدأ من الداخل","بشرة أكثر إشراقًا ونضارة","تركيبة بحرية فاخرة","سهل الاستخدام يومياً"]'::jsonb,
  '✨ العرض الأقوى — الأكثر طلباً: عرض قطعتين بـ 249 ر.س'
) on conflict (slug) do nothing;

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
where p.slug = 'glow'
and not exists (
  select 1 from product_images pi
  join products pr on pr.id = pi.product_id
  where pr.slug = 'glow'
);

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, 'قطعة واحدة', 'عرض قطعة واحدة', 1, 199, null, false, 1
from products where slug = 'glow'
and not exists (
  select 1 from product_offers po
  join products p on p.id = po.product_id
  where p.slug = 'glow' and po.quantity = 1
);

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, 'قطعتان', 'عرض قطعتين', 2, 249, 'الأكثر طلباً', true, 2
from products where slug = 'glow'
and not exists (
  select 1 from product_offers po
  join products p on p.id = po.product_id
  where p.slug = 'glow' and po.quantity = 2
);

insert into product_offers (product_id, label, display_label, quantity, price, badge, is_recommended, sort_order)
select id, '3 قطع', 'عرض 3 قطع', 3, 299, 'أفضل قيمة', false, 3
from products where slug = 'glow'
and not exists (
  select 1 from product_offers po
  join products p on p.id = po.product_id
  where p.slug = 'glow' and po.quantity = 3
);

-- Seed homepage reviews
insert into reviews (customer_name, location, product_label, rating, content, image_url, sort_order)
select * from (values
  ('نورة العتيبي', 'الرياض', 'LIMORA Collagen Glow', 5, 'بشرتي صارت أهدأ وأكثر إشراقًا… الإشراقة طبيعية مو مبالغ فيها. أحس بثقة مختلفة كل صباح.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 1),
  ('ريم الشمري', 'جدة', 'Limora Hair', 5, 'شعري صار أقوى وأكثف… والأهم إني حسيت إنه من الداخل مو بس من الخارج.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', 2),
  ('دانة القحطاني', 'الدمام', 'Limora Radiance', 5, 'تفتيح طبيعي بدون مبالغة… بشرتي موحّدة وناعمة. LIMORA فعلاً مختلفة.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 3)
) as seed(customer_name, location, product_label, rating, content, image_url, sort_order)
where not exists (select 1 from reviews limit 1);
