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
