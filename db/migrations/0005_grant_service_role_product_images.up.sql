-- Mesma lacuna de 0003/0004, agora para product_images — necessario para
-- uploadProductImage/deleteProductImage/reorderProductImages via service_role.
-- Equivalente CLI-tracked: supabase/migrations/<timestamp>_grant_service_role_product_images.sql

grant select, insert, update, delete on product_images to service_role;
