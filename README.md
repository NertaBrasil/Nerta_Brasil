# Nerta Brasil

Site institucional e vitrine de produtos da **Nerta Brasil** — marca belga líder global em limpeza química para Car & Truckwash, distribuída com exclusividade no Brasil pela **Provisão Comércio Internacional**.

> *"Tecnologia química europeia de alta performance para um mercado que ainda utiliza soluções inferiores."*

---

## Sobre o projeto

Plataforma **vitrine + SEO** que apresenta o catálogo de detergentes concentrados da Nerta para os segmentos **Frotas**, **Agro**, **Detailing** e **Animal**. O posicionamento é de química de laboratório premium — credibilidade técnica antes de catálogo.

O **checkout é 100% no Mercado Livre**: o site não possui carrinho nem checkout próprio. Cada produto leva o usuário ao anúncio correspondente no Mercado Livre.

- **Quem:** Nerta (Bélgica) × Provisão (distribuidor exclusivo Brasil)
- **Lançamento nacional:** 2026
- **Produtos:** detergentes concentrados em bombonas de 25L (diluição 3–20%)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Backend | Supabase (auth + banco + storage) |
| Checkout | Mercado Livre (externo) |

---

## Regras de negócio (MVP)

- Usuário final **não faz login** — apenas a rota `/admin` é protegida (Supabase Auth).
- Botão **"Comprar no Mercado Livre"** abre em nova aba e dispara eventos de GA/Pixel.
- Produto com `stock === 0` → botão desabilitado **"Produto Indisponível"** (sem redirect).
- Flag `featured` → carrossel da home. Flag `active` → visível no catálogo.
- **Sem carrinho. Sem checkout próprio.**

---

## Identidade visual

O projeto segue o **Nerta Brasil Design System**. Princípios não-negociáveis:

- Fundo **navy `#0D1B2E`** em toda a interface (nunca claro).
- **Azul `#1E7FC8`** para CTAs e links.
- **Dourado `#C9951A`** exclusivo da parceria com a Provisão.
- **Teal `#1DB87E`** apenas para ícones de benefício.
- Tipografia: **Plus Jakarta Sans** (títulos) + **Inter** (corpo).
- Tom técnico e premium, sempre com dado (diluição, custo/lavagem, certificações). Sem emoji.

A fonte canônica da marca é o guia de identidade visual `Nerta_Identidade_Visual_2026.pdf`.

---

## Fluxo de contribuição

O repositório segue o modelo **Gitflow**. Antes de contribuir, leia o [CONTRIBUTING.md](./CONTRIBUTING.md).

```
feature/* ─┐
fix/*      ├──► develop ──► release/* ──► main
chore/*    ┘
hotfix/* ──────────────────────────────► main (emergência)
```

- Nenhum push direto em `main` ou `develop` — tudo via Pull Request.
- Branches seguem a convenção `tipo/descricao-curta` (ex.: `feature/catalogo-filtros`).

---

## Licença

Projeto proprietário — Provisão Comércio Internacional. Todos os direitos reservados.
