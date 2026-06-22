-- service_role nao recebe privilegios de tabela por padrao (so RLS bypass).
-- Sem este GRANT, createAdminClient() (service_role) falha com 42501 ao
-- inserir/atualizar/excluir categorias a partir de Server Actions do admin.
-- Equivalente CLI-tracked: supabase/migrations/<timestamp>_grant_service_role_categories.sql

grant select, insert, update, delete on categories to service_role;
