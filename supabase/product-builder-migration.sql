-- LIMORA Product Page Builder Migration
-- Run in Supabase SQL Editor

create table if not exists product_page_configs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists product_page_configs_slug_idx
  on product_page_configs (slug);

create or replace function update_product_page_configs_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists product_page_configs_updated_at on product_page_configs;
create trigger product_page_configs_updated_at
  before update on product_page_configs
  for each row execute function update_product_page_configs_updated_at();

alter table product_page_configs enable row level security;

create policy "Public read product page configs" on product_page_configs
  for select using (true);

create policy "Admin manage product page configs" on product_page_configs
  for all using (is_admin()) with check (is_admin());
