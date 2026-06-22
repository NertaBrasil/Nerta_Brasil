# Registro de Execuções de Migrations

Controle manual de execução por ambiente. Ver [PROCEDURE.md](./PROCEDURE.md) para o processo completo.

| NNNN | Tipo | Descrição | Ambiente | Referência | Data | Responsável | Status |
|------|------|-----------|----------|------------|------------|--------------|--------|
| 0001 | UP | initial_schema | local | supabase/migrations/20260617221247_initial_schema.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | local | supabase/migrations/20260617232437_grant_data_api_access.sql | 2026-06-17 | Matheus Dias Campos | executado ✅ |
| 0001 | UP | initial_schema | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0002 | UP | grant_data_api_access | produção (Supabase) | projeto `wcouxyjezwmabeapvbsq` | 2026-06-19 | Matheus Dias Campos | executado ✅ |
| 0003 | UP | products_featured_position | local | supabase/migrations/20260622183450_products_featured_position.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0003 | DOWN | products_featured_position | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0004 | UP | products_purchase_mode | local | supabase/migrations/20260622190140_products_purchase_mode.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0004 | DOWN | products_purchase_mode | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
| 0005 | UP | partner_applications | local | supabase/migrations/20260622190143_partner_applications.sql | 2026-06-22 | Matheus Dias Campos | validado ✅ |
| 0005 | DOWN | partner_applications | local | — | 2026-06-22 | Matheus Dias Campos | rollback validado ✅ |
