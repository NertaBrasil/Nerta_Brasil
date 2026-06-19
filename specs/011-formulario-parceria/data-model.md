# Data Model: Formulário de Parceria + Modo de Compra por Produto

**Date**: 2026-06-19
**Feature**: [spec.md](./spec.md)

## Alteração em entidade existente

### `products` (extensão — dono: `features/products/types.ts`)

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `purchase_mode` | `text` | NOT NULL, DEFAULT `'mercado_livre'`, CHECK (`purchase_mode IN ('mercado_livre', 'formulario_parceria')`) | Define o comportamento do botão de compra na página do produto |

**Regras**:
- Produtos existentes recebem `'mercado_livre'` por padrão — comportamento atual preservado sem ação manual (FR-002).
- `purchase_mode = 'mercado_livre'` → comportamento já definido pela spec 003 (link em nova aba, ou "Produto Indisponível" conforme `stock`/`ml_url`).
- `purchase_mode = 'formulario_parceria'` → botão navega para `/produtos/[slug]/parceria`, independentemente de `stock`.
- Não há validação cruzada obrigatória entre `purchase_mode` e `ml_url` no banco (ex: exigir `ml_url` preenchido apenas quando `mercado_livre`) — essa regra é de UI/validação de formulário no admin (`schemas.ts` do admin de produtos), não de schema de banco.

---

## Nova entidade

### `partner_applications`

Candidatura de um visitante ao Programa de Qualificação de Parceiros Nerta Brasil, originada pelo botão de compra de um produto em modo "Formulário de Parceria".

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Identificador único |
| `product_id` | `uuid` | FK → `products.id`, ON DELETE SET NULL | Produto que originou o clique no botão de compra |
| `product_name_snapshot` | `text` | NOT NULL | Nome do produto no momento do envio — preserva a referência mesmo se o produto for renomeado/excluído depois |
| `document_type` | `text` | NOT NULL, CHECK (`document_type IN ('cnpj', 'cpf')`) | Tipo de pessoa escolhido na etapa de identificação |
| `document_number` | `text` | NOT NULL | CNPJ ou CPF (apenas dígitos), conforme `document_type` |
| `legal_name` | `text` | NOT NULL | "Razão Social" (CNPJ) ou "Nome Completo" (CPF) |
| `trade_name` | `text` | | "Nome Fantasia" — preenchido apenas quando `document_type = 'cnpj'` |
| `city` | `text` | NOT NULL | Cidade |
| `state` | `text` | NOT NULL | Estado (UF) |
| `website` | `text` | | Website (opcional na prática, não obrigatório no material de referência) |
| `contact_name` | `text` | NOT NULL | Nome do responsável |
| `contact_role` | `text` | NOT NULL | Cargo do responsável |
| `phone` | `text` | NOT NULL | Telefone de contato |
| `email` | `text` | NOT NULL | E-mail de contato |
| `linkedin_url` | `text` | | LinkedIn — explicitamente opcional no material de referência |
| `relationship_interest` | `text` | NOT NULL, CHECK (`IN ('consumidor_final','revendedor_autorizado','distribuidor_regional','parceiro_tecnico_aplicador','conhecendo_marca','outro')`) | Área de interesse principal (Etapa 2) |
| `relationship_interest_other` | `text` | | Detalhe livre quando `relationship_interest = 'outro'` |
| `interest_reason` | `text` | | "O que despertou seu interesse" — opcional |
| `market_segment` | `text` | NOT NULL, CHECK (`IN ('transporte','logistica','lavagem_profissional','agricultura','construcao','industria','oficina_mecanica','comercio','outro')`) | Segmento principal (Etapa 3) |
| `market_segment_other` | `text` | | Detalhe livre quando `market_segment = 'outro'` |
| `years_in_market` | `text` | NOT NULL, CHECK (`IN ('menos_2','2_a_5','5_a_10','mais_10')`) | Tempo de atuação no mercado |
| `employee_count` | `text` | NOT NULL, CHECK (`IN ('até_5','6_a_20','21_a_50','51_a_100','mais_100')`) | Número de colaboradores |
| `main_challenges` | `text[]` | NOT NULL, DEFAULT `'{}'` | Maiores desafios em limpeza/manutenção (múltipla escolha; valores: `alto_consumo`, `custos_elevados`, `baixa_eficiencia`, `tempo_excessivo`, `falta_assistencia`, `problemas_ambientais`, `outro`) |
| `main_challenges_other` | `text` | | Detalhe livre quando `main_challenges` inclui `'outro'` |
| `supplier_priorities` | `text[]` | NOT NULL, DEFAULT `'{}'` | O que mais valoriza num fornecedor (múltipla escolha; valores: `qualidade`, `preco`, `suporte_tecnico`, `disponibilidade_estoque`, `formacao`, `inovacao`, `sustentabilidade`) |
| `works_with_professional_products` | `boolean` | NOT NULL | Já trabalha com produtos profissionais |
| `current_brands` | `text` | | Marcas que comercializa/utiliza atualmente — opcional |
| `geographic_scope` | `text` | NOT NULL, CHECK (`IN ('local','regional','estadual','nacional')`) | Área geográfica de atuação |
| `has_sales_team` | `boolean` | NOT NULL | Possui equipe comercial |
| `has_logistics_structure` | `boolean` | NOT NULL | Possui estrutura logística |
| `initial_purchase_potential` | `text` | NOT NULL, CHECK (`IN ('até_5000','5000_a_20000','20000_a_50000','acima_50000','nao_consigo_estimar')`) | Potencial inicial de compra mensal |
| `interested_in_training` | `boolean` | NOT NULL | Interesse em demonstrações/treinamentos |
| `pioneer_partners_interest` | `text` | NOT NULL, CHECK (`IN ('sim_tenho_interesse','quero_mais_detalhes','apenas_acompanhar')`) | Interesse no programa Pioneer Partners |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Data/hora do envio |

**Regras**:
- `document_number` validado pela aplicação (checksum de CNPJ ou CPF conforme `document_type`) antes do INSERT — o banco não reimplementa o algoritmo, apenas armazena o valor já validado.
- `trade_name` só é relevante quando `document_type = 'cnpj'`; quando `document_type = 'cpf'`, `legal_name` representa o "Nome Completo" e `trade_name` permanece `NULL`.
- Sem UPDATE ou DELETE expostos por nenhuma Server Action ou política RLS — submissão é somente leitura após o envio (FR-015).
- `product_id` pode ficar `NULL` se o produto de origem for excluído; `product_name_snapshot` preserva a referência legível mesmo nesse caso.

---

## Relacionamentos

```text
products
  └── partner_applications (product_id FK, SET NULL on delete)
```

---

## RLS (Row Level Security)

| Tabela | Acesso público (`anon`) | Acesso autenticado (`authenticated`) |
|--------|------------------------|--------------------------------------|
| `partner_applications` | INSERT apenas (sem SELECT/UPDATE/DELETE) | SELECT apenas (sem UPDATE/DELETE — nenhuma política para essas ações) |

**Nota**: o INSERT público é feito pelo visitante anônimo ao enviar o formulário (sem necessidade de `service_role`, já que é exatamente o caso de uso que RLS+GRANT existem para suportar). A ausência de políticas de UPDATE/DELETE para qualquer role é a camada de defesa em profundidade do FR-015 — mesmo que uma Server Action futura tentasse alterar/excluir, o banco rejeitaria.
