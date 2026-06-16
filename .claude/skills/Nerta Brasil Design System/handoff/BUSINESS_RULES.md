# Nerta Brasil — Regras de Negócio (críticas)

Implementar à risca. O site é **vitrine + SEO**; o checkout é 100% Mercado Livre.

## Autenticação
- **Usuário final NÃO faz login.** Não existe área logada para cliente, carrinho ou checkout próprio.
- **Apenas `/admin` é protegido** via **Supabase Auth**. Proteger via middleware do App Router (redirect para login se não autenticado).

## Botão "Comprar no Mercado Livre"
- Renderiza como `<a href={mlUrl} target="_blank" rel="noopener noreferrer">`.
- **Dispara evento GA/Pixel** no clique (ex: `gtag('event','comprar_ml',{ slug })` e `fbq('track','InitiateCheckout')`). Usar o callback `onBuy` do `ProductCard`/`Button`.
- **Nunca** faz checkout interno nem redireciona na mesma aba.

## Estoque
- Quando `stock === 0`: botão **desabilitado** com texto **"Produto Indisponível"**. Sem link, sem redirecionamento.
- `stock > 0`: CTA normal para o Mercado Livre.

## Flags de produto
- `featured: boolean` → produto aparece no **carrossel/destaques da home**.
- `active: boolean` → produto **visível no catálogo**. Inativo não aparece na vitrine pública (mas existe no admin).

## Modelo de dados (Supabase — sugestão)
Espelhar os campos de `../ui_kits/site/data.js`:
```
products(
  id uuid pk,
  slug text unique,
  line text,            -- "Linha Frotas" | "Linha Agro" | ...
  name text,
  category text,
  dilution text,        -- "3–5%"
  attributes text[],    -- ["Touchless","Agro"]
  short text,
  description text,
  image_url text,       -- PNG fundo removido (Supabase Storage)
  stock int default 0,
  featured boolean default false,
  active boolean default true,
  ml_url text,          -- link do Mercado Livre
  created_at timestamptz default now()
)
```

## MVP (escopo fechado)
`landing → catálogo → página de produto → redirect Mercado Livre`. **Não** adicionar: login de cliente, carrinho, checkout próprio.

---

# Painel administrativo — regras (novas)

## Papéis e permissões
Dois papéis: **admin** e **editor**.

| Seção | Admin | Editor |
|---|---|---|
| Produtos | criar / editar / excluir | criar / editar / excluir |
| Categorias | criar / editar / excluir | criar / editar / excluir |
| Destaques | acesso total | acesso total |
| Usuários | acesso total | **SEM ACESSO** (oculto na sidebar) |

- **Nenhum usuário se auto-registra.** Apenas um admin cria novos usuários.
- Um admin **não pode excluir a própria conta** (botão de excluir desabilitado na própria linha).
- Na edição de usuário: nome e papel são editáveis; **e-mail e senha não** (senha via redefinição por e-mail).

## Categorias
- Slug é **gerado automaticamente** a partir do nome (editável).
- **Excluir categoria com produtos vinculados é bloqueado** — o modal avisa para remover/reclassificar os produtos antes.

## Imagens de produto
- **Sem limite** de imagens por produto.
- Cada imagem passa por **recorte 1:1 obrigatório** antes de salvar (cropper inline com zoom + posicionamento).
- Galeria **reordenável por drag-and-drop**; a **primeira imagem é a "Principal"** (capa usada no card do catálogo).
- Cada imagem tem exclusão individual. Armazenar no Supabase Storage; salvar a ordem.

## Confirmações destrutivas
Toda exclusão (produto, categoria, usuário) abre um **modal de confirmação** com scrim escuro e botão **vermelho** (`danger`) — nunca o azul da marca. A ação só ocorre após confirmar.

## Slug de produto
Gerado automaticamente a partir do nome (editável). Usado em `/produto/[slug]`.
