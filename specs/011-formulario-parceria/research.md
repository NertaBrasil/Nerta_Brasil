# Research: Formulário de Parceria + Modo de Compra por Produto

**Date**: 2026-06-19
**Feature**: [spec.md](./spec.md)

## 1. Onde o Formulário de Parceria vive na navegação

**Decision**: rota dedicada `app/produtos/[slug]/parceria/page.tsx`, em vez de modal/overlay sobre a página do produto.

**Rationale**: o formulário tem ~30 campos em 7 etapas — embuti-lo como modal client-side faria toda página de produto carregar esse bundle, mesmo para os produtos (provavelmente a maioria) que usam o modo "Link Mercado Livre" (Princípio V — Simplicidade/YAGNI, e Princípio II — RSC por padrão, já que isolar o formulário em rota própria mantém a página de produto majoritariamente Server Component). Uma rota própria também dá URL estável, sem necessidade de gerenciar estado de modal sobre uma página que já é RSC.

**Alternatives considered**: modal/drawer sobre `/produtos/[slug]` — rejeitado por inflar o bundle client-side de toda página de produto e complicar o isolamento Server/Client já estabelecido pelo `BuyButton` (spec 003).

## 2. Navegação ao clicar em "Comprar" quando o modo é Formulário de Parceria

**Decision**: navegação na mesma aba (link interno padrão do Next.js), sem `target="_blank"`.

**Rationale**: o link para o Mercado Livre abre em nova aba porque é uma saída do site para um domínio externo (regra existente, Princípio I). O Formulário de Parceria é uma rota interna do próprio site — manter na mesma aba é o padrão esperado para navegação interna e evita duas abas abertas redundantes.

**Alternatives considered**: nova aba, por simetria com o botão atual — rejeitada por não haver razão de UX para abrir rota interna em nova aba.

## 3. Validação de CNPJ/CPF

**Decision**: implementar os algoritmos de checksum (módulo 11) como funções puras dentro da própria feature (`features/partner-applications/schemas.ts` ou um helper co-localizado), usadas via `.refine()` do Zod.

**Rationale**: o algoritmo de validação de CNPJ/CPF é curto (dígitos verificadores via módulo 11) e bem documentado — não há ganho real em adicionar uma dependência nova só para isso (Princípio V — Simplicidade/YAGNI). Mantém a superfície de dependências do projeto (hoje sem nenhuma lib de validação de documento) inalterada.

**Alternatives considered**: bibliotecas como `@fnando/cpf-cnpj-validator` — rejeitadas por adicionarem uma dependência de supply-chain para um algoritmo trivial de implementar e testar diretamente.

## 4. Armazenamento das respostas do formulário

**Decision**: tabela relacional `partner_applications` com uma coluna por campo do formulário (incluindo `text[]` para os campos de múltipla escolha), em vez de um blob JSON com as respostas.

**Rationale**: o conjunto de campos é finito e conhecido (deriva diretamente do material de referência da spec) — colunas tipadas permitem que o admin (US3) liste e eventualmente filtre/ordene candidaturas por campo (ex: segmento, potencial de compra) sem parsing de JSON. Segue o padrão já estabelecido em `001-vitrine-catalogo/data-model.md`, que não usa nenhum campo JSONB.

**Alternatives considered**: coluna `answers jsonb` única — rejeitada por dificultar consultas/relatórios futuros e por não haver necessidade de schema dinâmico (o formulário não é configurável pelo admin nesta versão).

## 5. Vínculo entre submissão e produto quando o produto é alterado ou excluído

**Decision**: `partner_applications.product_id` é uma FK nullable (`ON DELETE SET NULL`) para `products.id`, complementada por uma coluna `product_name_snapshot` (texto, preenchida no momento do envio com o nome do produto).

**Rationale**: a spec (Edge Cases) exige que a submissão continue "associada ao produto original" mesmo que o produto seja desativado ou excluído depois. Bloquear a exclusão de produtos com submissões vinculadas (como já existe para categorias com produtos) adicionaria uma regra de negócio não pedida pela spec; capturar um snapshot do nome do produto no momento do envio resolve o requisito sem essa restrição adicional.

**Alternatives considered**: bloquear `deleteProduct` quando existirem submissões vinculadas — rejeitado por não ser um requisito desta spec e por ampliar o escopo de uma feature já implementada (spec 007).

## 6. Gerenciamento de estado do formulário multi-etapas

**Decision**: Client Component único controlando um objeto de respostas via `useState`/`useReducer`, sem biblioteca de formulários. Validação por etapa usa o mesmo `schema.ts` (Zod) que valida o payload completo no envio final, conforme a convenção já estabelecida (schema único client/server).

**Rationale**: o projeto não tem `react-hook-form` ou equivalente instalado, e a complexidade de 7 etapas com objeto único de estado não justifica introduzir uma dependência nova (Princípio V). Não há requisito de rascunho/retomada entre sessões (ver Assumptions do spec), então estado em memória no Client Component é suficiente.

**Alternatives considered**: `react-hook-form` — rejeitado por não haver necessidade que justifique a dependência adicional; gerenciamento de estado via URL/query params por etapa — rejeitado por adicionar complexidade sem benefício para um formulário sem retomada.
