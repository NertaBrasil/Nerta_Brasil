# Procedimento de Migrations DDL — Nerta Brasil

Este documento descreve o processo para criar, validar e aplicar scripts de migration DDL neste projeto.

> **Contexto:** o banco de dados é Postgres via Supabase. Não existe ferramenta de governança externa com validação automática de chamados — o controle de execução é feito manualmente através do arquivo [MIGRATIONS.md](./MIGRATIONS.md). A aplicação efetiva no banco (local e remoto) continua sendo feita pela Supabase CLI (`supabase/migrations/`, `supabase db reset`, `supabase db push`); os arquivos `.up.sql`/`.down.sql` em `db/migrations/` são a camada de nomenclatura sequencial, revisão e rollback documentado que precede a criação da migration equivalente para a CLI.

---

## 1. Estrutura de arquivos

```
db/
├── migrations/
│   ├── NNNN_descricao.up.sql      ← script de aplicação
│   └── NNNN_descricao.down.sql    ← script de rollback
└── controle/
    ├── MIGRATIONS.md              ← registro de execução por ambiente
    └── PROCEDURE.md               ← este arquivo
```

---

## 2. Convenção de nomenclatura

O nome do arquivo segue o padrão:

```
NNNN_descricao_da_migration.up.sql
NNNN_descricao_da_migration.down.sql
```

- **NNNN**: número sequencial com 4 dígitos e zero-padding (ex: `0001`, `0002`, `0042`)
- **descricao**: nome em snake_case descrevendo a operação (ex: `create_audit_records`)
- **.up.sql**: script de aplicação (forward)
- **.down.sql**: script de reversão (rollback)

Exemplos:

```
0001_create_audit_records.up.sql
0001_create_audit_records.down.sql
```

---

## 3. Regras obrigatórias de DDL

### 3.1 Segurança de schema

1. **Sem prefixo de schema:** objetos são referenciados apenas pelo nome, usando o schema `public` por padrão (é o schema padrão do Postgres/Supabase, não precisa — e não deve — ser escrito explicitamente).
   - Correto: `create table audit_records (...)`
   - Errado: `create table public.audit_records (...)`

### 3.2 Operações permitidas (DDL)

Apenas `CREATE`, `ALTER`, `DROP`, `RENAME` e `TRUNCATE` sobre os seguintes objetos são permitidos em um arquivo de migration:

| Objeto |
|--------|
| TABLE |
| VIEW |
| SEQUENCE |
| INDEX |

`COMMENT` em tabelas e colunas também é permitido. Políticas de RLS (`CREATE POLICY`) e `GRANT`/`REVOKE` também são tratados como DDL de schema e podem viver em migrations.

### 3.3 Operações proibidas

| Categoria | Operações proibidas |
|-----------|---------------------|
| DML | `INSERT`, `UPDATE`, `DELETE`, `SELECT` — dados de seed pertencem a `supabase/seed.sql`, nunca a uma migration |
| Tabelas temporárias | palavra-chave `TEMPORARY` é proibida |

### 3.4 Regras de tipo e estrutura

1. **PRIMARY KEY obrigatória:** todo `CREATE TABLE` deve incluir uma definição de `PRIMARY KEY`.
2. **Tipo da PRIMARY KEY:**
   - **PK simples (uma coluna):** a coluna deve ser do tipo `BIGINT`, `BIGSERIAL` ou `UUID`.
   - **PK composta (múltiplas colunas):** ao menos **uma** das colunas deve ser do tipo `BIGINT`, `BIGSERIAL` ou `UUID`. As demais podem ser de outros tipos (ex: `VARCHAR`).
3. **Colunas auto-incrementadas:** devem ser `BIGSERIAL` (ou `IDENTITY` com tipo `BIGINT`). `SERIAL`/`INTEGER` são violações para colunas de ID.

### 3.5 Regras especiais para `CREATE INDEX`

1. **Ordem lógica:** um `CREATE INDEX` que referencia uma tabela não criada no mesmo script é aceitável desde que essa tabela já exista no banco antes da execução da migration.
2. **`CREATE INDEX CONCURRENTLY`:** permitido **somente** quando o script inteiro contiver **exatamente esse único statement** — não pode rodar dentro de uma transação junto com outros comandos.

---

## 4. Passo a passo para criar uma nova migration

### 4.1 Criar os arquivos

1. Determine o próximo número sequencial consultando os arquivos em `db/migrations/`.
2. Crie o arquivo `.up.sql` com o DDL de aplicação.
3. Crie o arquivo `.down.sql` com o DDL de reversão (geralmente o inverso: `DROP TABLE`, `DROP INDEX`, etc.).
4. Verifique que o script atende a todas as regras da seção 3.

### 4.2 Validar localmente

1. Suba o stack local do Supabase (se ainda não estiver rodando):
   ```bash
   npx supabase start
   ```
2. Aplique o script UP diretamente no Postgres local (ex: via `psql` ou `docker exec` no container `supabase_db_*`) e confirme que a estrutura foi criada corretamente.
3. Valide o rollback aplicando o `.down.sql` e confirme que os objetos foram removidos sem erro.
4. Reaplique o UP para deixar o ambiente local provisionado.

### 4.3 Registrar no controle

Após validação local, adicione as entradas correspondentes em [MIGRATIONS.md](./MIGRATIONS.md):

```markdown
| NNNN | UP   | descricao_da_migration | local | — | YYYY-MM-DD | responsável | validado ✅ |
| NNNN | DOWN | descricao_da_migration | local | — | YYYY-MM-DD | responsável | rollback validado ✅ |
```

### 4.4 Criar a migration equivalente na Supabase CLI

1. Rode `supabase migration new <descricao_da_migration>`.
2. Cole o conteúdo do `.up.sql` validado no arquivo gerado em `supabase/migrations/`.
3. Rode `npx supabase db reset` (local) para confirmar que a migration se aplica de forma limpa junto com as demais.
4. Quando for para o ambiente remoto, use `npx supabase db push`.

### 4.5 Registrar execução no ambiente

Após aplicar em cada ambiente (local, produção), atualize [MIGRATIONS.md](./MIGRATIONS.md) com a entrada correspondente:

```markdown
| NNNN | UP | descricao_da_migration | produção | <link do PR/deploy> | YYYY-MM-DD | responsável | executado ✅ |
```

---

## 5. Provisionar um ambiente local limpo

Para provisionar o ambiente local do zero (ex: troubleshooting, onboarding):

```bash
npx supabase start
npx supabase db reset
```

Isso aplica, em ordem, todas as migrations existentes em `supabase/migrations/` (a versão CLI-tracked dos arquivos `.up.sql` em `db/migrations/`) e depois `supabase/seed.sql`.

---

## 6. Referências

- [Controle de execuções](./MIGRATIONS.md)
