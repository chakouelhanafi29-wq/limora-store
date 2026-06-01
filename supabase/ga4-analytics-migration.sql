-- LIMORA: GA4 admin analytics (Data API)
-- Run in Supabase SQL Editor (idempotent).

alter table settings add column if not exists ga4_property_id text;

alter table tracking_secrets add column if not exists ga4_service_account_json text;

comment on column settings.ga4_property_id is
  'Numeric GA4 property ID for Google Analytics Data API (not G- measurement ID)';

comment on column tracking_secrets.ga4_service_account_json is
  'Google service account JSON for Analytics Data API (admin-only)';

notify pgrst, 'reload schema';
