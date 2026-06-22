-- Mesma lacuna corrigida em categories/products/product_images (specs 006-008):
-- service_role nao recebe privilegios de tabela por padrao (so RLS bypass).
-- Sem este GRANT, createUser/deleteUser falham com 42501 ao inserir/excluir
-- linhas de admin_profiles a partir de Server Actions do admin.
-- Equivalente CLI-tracked: supabase/migrations/<timestamp>_grant_service_role_admin_profiles.sql

grant select, insert, update, delete on admin_profiles to service_role;
