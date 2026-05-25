# LIMORA Supabase Setup

Project: `yhrtnilxwmaterzaefxu`

## Already configured in `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://yhrtnilxwmaterzaefxu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Verify connection:

```bash
npm run verify:supabase
```

## 1. Run database schema (required once)

Open [SQL Editor](https://supabase.com/dashboard/project/yhrtnilxwmaterzaefxu/sql/new) and run the full file:

`supabase/schema.sql`

This creates:
- products, orders, reviews, settings, admins
- product images & COD offers
- RLS security policies
- storage bucket `product-images`
- seed product (Limora Glow) + reviews

## 2. Create admin user

1. **Authentication** → **Users** → **Add user**
2. Copy the user UUID
3. Run in SQL Editor:

```sql
insert into admins (id, email, full_name)
values ('USER-UUID-HERE', 'admin@limora.sa', 'LIMORA Admin');
```

## 3. Login

Visit `/admin/login` — or check status at `/admin/setup`

## What works after setup

| Feature | Route |
|---|---|
| Storefront (live data) | `/` |
| COD product page | `/product` |
| Admin dashboard | `/admin` |
| Orders (realtime) | `/admin/orders` |
| Products + images | `/admin/products` |
| Reviews | `/admin/reviews` |
| Pixels & settings | `/admin/settings` |
