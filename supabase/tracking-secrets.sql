-- Server-side tracking credentials (admin-only, never public)
-- Run in Supabase SQL Editor after schema.sql

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

drop policy if exists "Admin read tracking secrets" on tracking_secrets;
create policy "Admin read tracking secrets" on tracking_secrets
  for select using (is_admin());

drop policy if exists "Admin insert tracking secrets" on tracking_secrets;
create policy "Admin insert tracking secrets" on tracking_secrets
  for insert with check (is_admin());

drop policy if exists "Admin update tracking secrets" on tracking_secrets;
create policy "Admin update tracking secrets" on tracking_secrets
  for update using (is_admin()) with check (is_admin());

notify pgrst, 'reload schema';
