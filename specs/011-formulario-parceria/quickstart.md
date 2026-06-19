# Quickstart: Formulário de Parceria + Modo de Compra por Produto

**Feature**: [spec.md](./spec.md) | **Date**: 2026-06-19

Validação manual complementar de ponta a ponta — nunca substitui a suite automatizada (Princípio VI). Pressupõe ambiente local já provisionado conforme `specs/001-vitrine-catalogo/quickstart.md` (`supabase start`, `supabase db reset`, `npm run dev`).

## Cenário 1 — Admin configura o modo de compra

1. Logado como admin em `/admin/produtos`, edite um produto existente.
2. Altere "Modo de compra" para "Formulário de Parceria" e salve.
3. **Esperado**: o produto é salvo sem exigir `ml_url`; o campo de link do Mercado Livre fica opcional/oculto na UI quando esse modo está selecionado.
4. Edite um segundo produto e confirme que o modo padrão é "Link Mercado Livre" para produtos criados antes desta feature.

## Cenário 2 — Visitante envia o formulário como Pessoa Jurídica

1. Acesse `/produtos/[slug]` do produto configurado no passo 2 acima.
2. Clique no botão de compra.
3. **Esperado**: navega para `/produtos/[slug]/parceria` na mesma aba (sem nova aba, sem link do Mercado Livre).
4. Na etapa de identificação, escolha "Pessoa Jurídica", preencha CNPJ válido, Razão Social, Nome Fantasia e demais campos.
5. Avance por todas as etapas preenchendo os campos obrigatórios e envie.
6. **Esperado**: confirmação de envio exibida; nenhuma chamada de analytics de e-commerce disparada (verificar rede do browser).

## Cenário 3 — Visitante envia o formulário como Pessoa Física

1. Repita o Cenário 2, mas escolha "Pessoa Física" na etapa de identificação.
2. **Esperado**: campos "Razão Social"/"Nome Fantasia" são substituídos por "Nome Completo"; o campo de documento exige CPF válido (CNPJ é rejeitado nesse modo).

## Cenário 4 — Validação de documento inválido

1. Em qualquer um dos dois caminhos, informe um CNPJ ou CPF com checksum inválido (ex: todos os dígitos iguais).
2. **Esperado**: envio bloqueado, erro indicado no campo, nenhuma submissão criada.

## Cenário 5 — Admin consulta as submissões recebidas

1. Logado como admin ou editor, acesse `/admin/parcerias`.
2. **Esperado**: lista mostra as submissões dos Cenários 2 e 3, mais recente primeiro, com nome/razão social, tipo de documento, produto de origem e data.
3. Abra o detalhe de uma submissão.
4. **Esperado**: todos os campos preenchidos pelo candidato são exibidos, incluindo o produto de origem.
5. Confirme que não existe nenhuma ação de editar ou excluir disponível na tela.

## Cenário 6 — Acesso negado a quem não é admin/editor

1. Sem sessão (ou com sessão que não seja admin/editor), tente acessar `/admin/parcerias` diretamente pela URL.
2. **Esperado**: acesso negado, mesmo comportamento das demais rotas `/admin/*` protegidas.
