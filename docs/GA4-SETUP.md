# Google Analytics 4 — LIMORA setup guide

## Part 1: Create GA4 property

1. Open [Google Analytics](https://analytics.google.com/).
2. **Admin** (gear) → **Create** → **Property**.
3. Name: `LIMORA Shop` · Time zone: `Saudi Arabia` · Currency: `SAR`.
4. Create a **Web** data stream:
   - URL: `https://www.limorashop.co`
   - Stream name: `LIMORA Storefront`
5. Copy the **Measurement ID** (format `G-XXXXXXXXXX`).

## Part 2: Enable measurement on the store

1. LIMORA Admin → **Settings** → **GA4 + Data API**.
2. Paste **GA4 Measurement ID** → **Save GA4**.
3. Deploy the site (or wait for next Vercel deploy).
4. Visit the storefront and confirm in GA4 **Reports → Realtime** that users appear.

### Events tracked automatically

| Store event        | GA4 event          |
|--------------------|--------------------|
| PageView           | `page_view`        |
| ViewContent        | `view_item`        |
| AddToCart          | `add_to_cart`      |
| InitiateCheckout   | `begin_checkout`   |
| Lead (COD submit)  | `generate_lead`    |
| Purchase           | `purchase`         |

## Part 3: Google Cloud + Data API (admin dashboard)

The admin analytics page reads from **Google Analytics Data API**, not only gtag.

### 3.1 Google Cloud project

1. [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. **APIs & Services** → **Library** → enable **Google Analytics Data API**.

### 3.2 Service account

1. **IAM & Admin** → **Service Accounts** → **Create**.
2. Name: `limora-ga4-reader` → Create.
3. Open the account → **Keys** → **Add key** → **JSON** → download the file.

### 3.3 Grant access in GA4

1. GA4 **Admin** → **Property access management**.
2. **+** → **Add users**.
3. Email: `...@....iam.gserviceaccount.com` from the JSON (`client_email`).
4. Role: **Viewer** (minimum).

### 3.4 Property ID (numeric)

1. GA4 **Admin** → **Property settings**.
2. Copy **Property ID** (digits only, e.g. `123456789`) — **not** the `G-` Measurement ID.

### 3.5 LIMORA Admin

1. **Settings** → **GA4 + Data API**:
   - Measurement ID: `G-...`
   - Property ID: `123456789`
   - Service Account JSON: paste full contents of the downloaded JSON file
2. **Save GA4** → **Test Data API** (should show sessions for last 7 days).
3. Open **Admin → Analytics** and confirm charts populate.

## Part 4: Environment variables (Vercel)

Set in **Production** (optional if everything is in Admin DB):

```env
SUPABASE_SERVICE_ROLE_KEY=...          # required for reading service account from DB
NEXT_PUBLIC_SITE_URL=https://www.limorashop.co
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX       # optional fallback
GA4_PROPERTY_ID=123456789               # optional fallback
GA4_SERVICE_ACCOUNT_JSON={"type":"service_account",...}  # optional fallback (single line)
```

Run SQL migration if new columns are missing:

`supabase/ga4-analytics-migration.sql`

## Part 5: Verify dashboard metrics

| Dashboard metric      | Source                          |
|-----------------------|---------------------------------|
| Total visitors        | GA4 `totalUsers` / `activeUsers`|
| Sessions              | GA4 `sessions`                  |
| Unique users          | GA4 `activeUsers`               |
| Conversion rate       | Orders (DB) ÷ GA4 sessions      |
| Traffic sources       | GA4 channel group               |
| Devices               | GA4 `deviceCategory`            |
| Top countries         | GA4 `countryId`                 |
| Top pages             | GA4 `pagePath`                  |
| Daily visitors chart  | GA4 by `date`                   |
| Daily orders chart    | Supabase `orders`               |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Realtime empty | Check Measurement ID, ad blockers, deploy |
| Data API test fails | Viewer role on service account email, enable API, correct Property ID |
| `PERMISSION_DENIED` | Re-add service account to GA4 property |
| Dashboard shows zeros | Run migration SQL; set Property ID + JSON; check date range filter |
| Orders chart empty | Normal if no orders in range — traffic still from GA4 |
