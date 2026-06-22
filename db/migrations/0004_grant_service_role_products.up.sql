-- Mesma lacuna de 0003 (categories), agora para products — necessario para
-- createProduct/updateProduct/deleteProduct/toggleProductActive via service_role.
-- Equivalente CLI-tracked: supabase/migrations/<timestamp>_grant_service_role_products.sql

grant select, insert, update, delete on products to service_role;
