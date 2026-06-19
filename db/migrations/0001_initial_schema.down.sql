-- Rollback do schema inicial — Nerta Brasil

drop policy if exists "product_images_storage_public_read" on storage.objects;
delete from storage.buckets where id = 'product-images';

drop policy if exists "admin_profiles_select_authenticated" on admin_profiles;
drop table if exists admin_profiles;

drop policy if exists "product_images_select_authenticated_all" on product_images;
drop policy if exists "product_images_select_public_active_product" on product_images;
drop table if exists product_images;

drop trigger if exists products_updated_at on products;
drop function if exists update_updated_at();
drop policy if exists "products_select_authenticated_all" on products;
drop policy if exists "products_select_public_active" on products;
drop table if exists products;

drop policy if exists "categories_select_public" on categories;
drop table if exists categories;
