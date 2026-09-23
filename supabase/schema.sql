-- ============================================
-- SABA COSMETICS - Database Schema
-- Run this entire file in Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query > paste this > Run)
-- ============================================

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  image_url text,
  images text[] default '{}',
  category text default 'General',
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homepage hero banner slides
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text default '',
  subtitle text default '',
  product_id uuid references products(id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_phone_alt text,
  shipping_address text not null,
  area text not null default '',
  city text not null,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();

-- Indexes
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_category on products(category);
create index if not exists idx_orders_status on orders(order_status);
create index if not exists idx_orders_number on orders(order_number);

-- ============================================
-- ROW LEVEL SECURITY
-- Public can READ active products only.
-- Public can INSERT orders (to place an order) but not read/edit others' orders.
-- All WRITE access to products happens via server-side API using the service role key,
-- which bypasses RLS entirely (that's how the admin panel manages products securely).
-- ============================================

alter table products enable row level security;
alter table orders enable row level security;
alter table banners enable row level security;

drop policy if exists "Public can view active banners" on banners;
create policy "Public can view active banners"
  on banners for select
  using (is_active = true);

drop policy if exists "Public can view active products" on products;
create policy "Public can view active products"
  on products for select
  using (is_active = true);

drop policy if exists "Public can create orders" on orders;
create policy "Public can create orders"
  on orders for insert
  with check (true);

-- No public select/update/delete policies on orders => only accessible via
-- server-side service role key (used by the admin panel APIs). This keeps
-- customer names, phone numbers and addresses private from other visitors.
-- No public insert/update/delete policies on products => only accessible via
-- server-side service role key (used by the admin panel APIs).

-- ============================================
-- STORAGE BUCKET for product images
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Uploads/deletes to storage happen server-side via service role key (admin panel),
-- so no public insert/update/delete policy is needed here.

-- ============================================
-- Seed sample products (optional - delete if you don't want demo data)
-- ============================================
insert into products (name, slug, description, price, compare_at_price, image_url, category, stock, is_active)
values
  ('Radiance Glow Serum', 'radiance-glow-serum', 'A lightweight vitamin C serum that brightens skin tone and softens fine lines over time.', 2800, 3400, null, 'Skincare', 25, true),
  ('Gentle Hydration Cleanser', 'gentle-hydration-cleanser', 'A sulphate-free cleanser that lifts away makeup and impurities without stripping moisture.', 1900, null, null, 'Skincare', 40, true),
  ('Elegant Foundation', 'elegant-foundation', 'Buildable, breathable coverage with a natural matte finish that lasts all day.', 3200, null, null, 'Makeup', 18, true)
on conflict (slug) do nothing;

-- ============================================
-- MIGRATION: if you already ran this schema before, run just this part below
-- to add the new columns/table without losing existing data.
-- ============================================
-- alter table products add column if not exists images text[] default '{}';
-- create table if not exists banners (
--   id uuid primary key default gen_random_uuid(),
--   image_url text not null,
--   title text default '',
--   subtitle text default '',
--   product_id uuid references products(id) on delete set null,
--   sort_order integer not null default 0,
--   is_active boolean not null default true,
--   created_at timestamptz not null default now()
-- );
-- alter table banners enable row level security;
-- create policy "Public can view active banners" on banners for select using (is_active = true);
