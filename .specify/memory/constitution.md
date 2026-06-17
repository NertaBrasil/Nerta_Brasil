<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Modified principles: none renamed
Added sections:
  - VI. Test-Driven Development Obrigatório
Removed sections: none
Templates requiring updates:
  ✅ tasks-template.md — seções "Tests for User Story N" e nota de Tests deixam de ser
     OPTIONAL e passam a MANDATORY, alinhadas ao novo Princípio VI
  ✅ plan-template.md — sem mudança estrutural necessária (Constitution Check já é
     derivado dinamicamente do arquivo de constituição)
  ⚠ spec-template.md — sem mudança necessária (TDD é decisão de implementação, fora do
     escopo de spec.md, que permanece tech-agnostic)
  ⚠ specs/001-vitrine-catalogo/plan.md — campo "Testing" no Technical Context ainda
     reflete a premissa antiga ("validação manual, sem suite automatizada"); requer
     atualização manual para refletir o Princípio VI antes de qualquer novo /speckit-plan
     reaproveitar esse documento como referência
Follow-up TODOs: none
-->

# Nerta Brasil Constitution

## Core Principles

### I. Vitrine-First — Sem Checkout Próprio

O site é **vitrine + SEO**. O único caminho de compra é o botão
"Comprar no Mercado Livre", que abre em nova aba (`target="_blank"`)
e dispara eventos GA/Pixel no clique.

- Nunca implementar carrinho, checkout próprio ou área logada para
  o usuário final.
- O usuário final NUNCA faz login. Autenticação existe apenas em
  `/admin/*` via Supabase Auth.
- O MVP é: landing → catálogo → página de produto → redirect ML.
  Qualquer feature fora desse escopo DEVE ser recusada ou justificada
  como extensão explicitamente aprovada.

### II. Server Component por Padrão

SEO é crítico. Todo componente DEVE ser Server Component a menos
que exista razão técnica explícita para ser Client Component.

Client Components são permitidos APENAS para:
- Filtros e busca em tempo real
- Botão "Comprar" (precisa disparar GA/Pixel)
- Formulários do admin
- Cropper de imagem e drag-and-drop de galeria
- Listagens que exigem interatividade imediata

Toda adição de `"use client"` DEVE ser justificada no PR.

### III. Design System Inegociável

O design system da Nerta Brasil (`.claude/skills/Nerta Brasil
Design System/`) define tokens, componentes e regras visuais que
NÃO podem ser sobrescritos sem aprovação explícita.

- Cores, tipografia e espaçamento seguem os tokens — nunca valores
  hardcoded.
- Proporção de imagem de produto DEVE ser 1:1; o crop é obrigatório
  antes de salvar.
- Botões de ação destrutiva (excluir) usam a variante `danger`
  (vermelha) — nunca o azul da marca.
- Todo modal de exclusão DEVE exibir scrim escuro e confirmar antes
  de executar.

### IV. Segurança por Isolamento

A superfície pública não tem autenticação — portanto não pode haver
vazamento de dados privados.

- `NEXT_PUBLIC_*` é exposto ao browser: NUNCA colocar secrets nessas
  variáveis.
- A `service_role` key NUNCA vai para clientes ou Server Components
  públicos — apenas para Server Actions e rotas exclusivas do admin.
- RLS DEVE estar habilitado em todas as tabelas expostas via Data API.
- `.env`, `.env.local` e qualquer arquivo com valores reais NUNCA são
  commitados. Apenas `.env.example` (sem valores) vai ao repositório.
- Admin não pode deletar a própria conta (guard no backend e no UI).
- Nenhum usuário se auto-registra; apenas um admin cria novos usuários.

### V. Simplicidade / YAGNI

Não adicionar abstrações, features ou flexibilidade além do que a
tarefa exige.

- Três linhas semelhantes são melhores que uma abstração prematura.
- Nenhuma feature é implementada para "uso futuro hipotético".
- Tratamento de erro e validação apenas nas fronteiras do sistema
  (input do usuário, APIs externas).
- Comentários de código apenas quando o *porquê* não é óbvio.
- Nenhuma implementação pela metade: ou a feature está completa e
  testável, ou não está no branch.

### VI. Test-Driven Development Obrigatório

Nenhum código de produção é escrito antes de existir um teste que falhe
para o comportamento esperado — ciclo red-green-refactor (vermelho →
verde → refactor) é mandatório para Server Actions, queries e regras
de negócio.

- Stack de testes: Vitest para testes unitários/integração de
  `queries.ts`, `actions.ts` e regras de negócio; React Testing Library
  para componentes com lógica condicional relevante (ex: `ProductCard`
  decidindo se desabilita o botão quando `stock === 0`).
- Componentes puramente apresentacionais (`shared/components/ui/`, sem
  lógica condicional própria) não exigem teste dedicado — a cobertura
  vem do componente de feature que os consome.
- `quickstart.md` continua existindo como validação manual complementar
  de ponta a ponta; NUNCA substitui a suite automatizada.
- Por força do Princípio V (Simplicidade), uma feature "completa" só é
  considerada completa quando os testes que comprovam seu comportamento
  existem e passam — implementação sem teste é implementação pela
  metade.

## Regras de Negócio Críticas

Estas regras derivam diretamente de `BUSINESS_RULES.md` e DEVEM ser
respeitadas em toda feature:

- `stock === 0` → botão desabilitado, texto "Produto Indisponível",
  sem link.
- `featured: true` → produto aparece no carrossel/destaques da home.
- `active: false` → produto invisível na vitrine pública; visível
  apenas no admin.
- Slug de produto e categoria é gerado automaticamente a partir do
  nome (editável).
- Excluir categoria com produtos vinculados é BLOQUEADO — o sistema
  DEVE avisar e pedir reclassificação antes.
- A primeira imagem da galeria é a "Principal" usada no card do
  catálogo. A ordem é persistida.

## Fluxo de Trabalho e Qualidade

- **Gitflow**: `feature/*`, `fix/*`, `chore/*`, `docs/*`,
  `refactor/*`, `test/*` → `develop`; `release/*`, `hotfix/*` → `main`.
  CI rejeita PRs que violem o padrão de branch ou target.
- **Makefile**: todo comando recorrente de desenvolvimento (banco,
  migrations, lint) DEVE ter um target no Makefile.
- **Banco local**: PostgreSQL via Docker Compose. Migrations gerenciadas
  pelo Supabase CLI (`supabase migration new <name>`).
- **Lint**: `make lint` roda o oxlint com as regras de aderência do
  design system (`.claude/skills/Nerta Brasil Design System/
  _adherence.oxlintrc.json`).
- **Feature-based**: cada feature é um módulo isolado em `/features`.
  Server Actions ficam em `features/<domínio>/actions/`.

## Governance

Esta constituição é o documento de referência que supersede qualquer
outra prática. Conflitos entre código existente e a constituição DEVEM
ser resolvidos em favor da constituição.

**Procedimento de emenda**:
1. Abrir PR com justificativa clara.
2. Incrementar a versão seguindo semver (MAJOR: remoção/redefinição
   incompatível; MINOR: novo princípio ou seção; PATCH: clarificação).
3. Atualizar `LAST_AMENDED_DATE`.
4. Verificar impacto nos templates em `.specify/templates/`.

**Revisão de conformidade**: Todo PR DEVE ser verificado contra os
princípios I–VI antes de merge. O Constitution Check no `plan.md` é o
gate formal.

**Version**: 1.1.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
