# Registro de Execuções de Migrations

Controle manual de execução por ambiente. Ver [PROCEDURE.md](./PROCEDURE.md) para o processo completo.

| NNNN | Tipo | Descrição | Ambiente | Referência | Data | Responsável | Status |
|------|------|-----------|----------|------------|------------|--------------|--------|
| 0001 | UP | initial_schema | local | supabase/migrations/20260617221247_initial_schema.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | local | supabase/migrations/20260617232437_grant_data_api_access.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0001 | UP | initial_schema | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0003 | UP | grant_service_role_categories | local | supabase/migrations/20260622202828_grant_service_role_categories.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0003 | DOWN | grant_service_role_categories | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0004 | UP | grant_service_role_products | local | supabase/migrations/20260622203218_grant_service_role_products.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0004 | DOWN | grant_service_role_products | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0005 | UP | grant_service_role_product_images | local | supabase/migrations/20260622203538_grant_service_role_product_images.sql | 2026-06-22 | Matheus Dias Campos | executado ✅ |
| 0005 | DOWN | grant_service_role_product_images | local | rollback validado via psql (UP→DOWN→UP) | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
