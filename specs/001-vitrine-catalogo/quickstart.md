# Quickstart — Validação do Ambiente de Desenvolvimento

**Date**: 2026-06-16
**Feature**: [spec.md](./spec.md)

Este guia valida que o ambiente de desenvolvimento está funcional e que os fluxos principais da vitrine e do admin operam corretamente. Não inclui código de produção — apenas comandos e verificações.

---

## Pré-requisitos

- Docker Desktop instalado e rodando
- Node.js 20+ e npm instalados
- Supabase CLI instalado (`npm install -g supabase`)
- Arquivo `.env.local` preenchido (copiar de `.env.example` e preencher)

---

## 1. Subir o ambiente

```bash
make dev
```

Isso deve:
1. Subir o container PostgreSQL via Docker Compose
2. Rodar as migrations pendentes
3. Iniciar o servidor Next.js em `http://localhost:3000`

**Verificar**: `http://localhost:3000` abre sem erro de conexão com o banco.

---

## 2. Validar a vitrine pública

### 2.1 Home

- Acessar `http://localhost:3000`
- **Esperado**: Página carrega com conteúdo da marca e seção de produtos em destaque (se houver produtos com `featured = true` e `active = true` no banco de seed)

### 2.2 Catálogo

- Acessar `http://localhost:3000/produtos`
- **Esperado**: Lista de produtos ativos. Filtros de categoria visíveis.
- Clicar em um filtro de categoria
- **Esperado**: Apenas produtos daquela categoria são exibidos

### 2.3 Página de produto — disponível

- Acessar a página de um produto com `stock > 0` e `ml_url` preenchida
- **Esperado**: Botão "Comprar no Mercado Livre" visível e clicável
- Clicar no botão
- **Esperado**: Abre nova aba com o anúncio no Mercado Livre. Aba atual permanece no site.

### 2.4 Página de produto — indisponível

- Acessar a página de um produto com `stock = 0`
- **Esperado**: Exibe "Produto Indisponível" no lugar do botão. Nenhum link clicável.

### 2.5 Produto inativo

- Tentar acessar a URL de um produto com `active = false`
- **Esperado**: 404 ou redirect para o catálogo. Produto não aparece em nenhuma listagem.

---

## 3. Validar proteção do admin

### 3.1 Redirect sem autenticação

- Acessar `http://localhost:3000/admin` sem estar logado
- **Esperado**: Redirect imediato para `/admin/login`

### 3.2 Login

- Acessar `http://localhost:3000/admin/login`
- Fazer login com credenciais de admin do seed
- **Esperado**: Redirect para `/admin/produtos`

### 3.3 Acesso por papel

- Logar como editor
- **Esperado**: Menu lateral exibe Produtos, Categorias e Destaques. Sem "Usuários".
- Tentar acessar `/admin/usuarios` diretamente
- **Esperado**: 403 ou redirect para `/admin/produtos`

---

## 4. Validar gestão de produtos (admin)

### 4.1 Criar produto

- Acessar `/admin/produtos/novo`
- Preencher todos os campos obrigatórios, fazer upload de uma imagem
- **Esperado**: Cropper 1:1 aparece antes de salvar a imagem
- Salvar produto com `active = true`
- **Esperado**: Produto aparece no catálogo público imediatamente

### 4.2 Reordenar imagens

- Abrir produto existente com múltiplas imagens
- Arrastar segunda imagem para a primeira posição
- Salvar
- **Esperado**: Card do produto no catálogo exibe a nova imagem como capa

### 4.3 Exclusão com confirmação

- Clicar em excluir um produto
- **Esperado**: Modal com scrim escuro e botão vermelho aparece
- Cancelar
- **Esperado**: Produto não foi excluído
- Confirmar exclusão
- **Esperado**: Produto removido da lista e da vitrine

---

## 5. Validar gestão de categorias

- Criar nova categoria "Teste"
- **Esperado**: Slug gerado automaticamente como "teste"
- Tentar excluir categoria com produtos vinculados
- **Esperado**: Mensagem de bloqueio. Categoria permanece.

---

## 6. Validar gestão de usuários (admin only)

- Logar como admin
- Criar novo usuário com papel "editor"
- **Esperado**: Usuário aparece na lista
- Verificar que o botão de excluir está desabilitado na linha do próprio admin logado

---

## Comandos úteis

```bash
make dev          # Sobe banco + inicia Next.js
make db-up        # Sobe apenas o container do banco
make db-down      # Derruba o container do banco
make db-migrate   # Roda as migrations pendentes
make db-reset     # Reseta o banco e recria do zero
make lint         # Roda oxlint (design system + ESLint)
```
