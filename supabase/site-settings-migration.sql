-- Site settings: domain, branding, and SEO fields
alter table settings add column if not exists site_url text;
alter table settings add column if not exists site_domain text;
alter table settings add column if not exists site_name text default 'LIMORA';
alter table settings add column if not exists logo_url text;
alter table settings add column if not exists favicon_url text;
alter table settings add column if not exists seo_title text;
alter table settings add column if not exists seo_description text;
alter table settings add column if not exists seo_keywords text;
alter table settings add column if not exists og_image_url text;
alter table settings add column if not exists twitter_handle text;
