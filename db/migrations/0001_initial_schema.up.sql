-- Schema inicial — Nerta Brasil
-- Fonte: specs/001-vitrine-catalogo/data-model.md
-- Equivalente CLI-tracked: supabase/migrations/20260617221247_initial_schema.sql

create extension if not exists "pgcrypto";

-- ============================================================
-- categories
-- ============================================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "categories_select_public"
  on categories for select
  to anon, authenticated
  using (true);

-- ============================================================
-- products
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  line text not null,
  category_id uuid references categories(id) on delete set null,
  dilution text,
  attributes text[] not null default '{}',
  short_description text,
  description text,
  stock int not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  ml_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "products_select_public_active"
  on products for select
  to anon
  using (active = true);

create policy "products_select_authenticated_all"
  on products for select
  to authenticated
  using (true);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ============================================================
-- product_images
-- ============================================================
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  url text not null,
  position int not null default 1,
  created_at timestamptz not null default now()
);

alter table product_images enable row level security;

create policy "product_images_select_public_active_product"
  on product_images for select
  to anon
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.active = true
    )
  );

create policy "product_images_select_authenticated_all"
  on product_images for select
  to authenticated
  using (true);

-- ============================================================
-- admin_profiles
-- ============================================================
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table admin_profiles enable row level security;

create policy "admin_profiles_select_authenticated"
  on admin_profiles for select
  to authenticated
  using (true);

-- ============================================================
-- Storage bucket: product-images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');
