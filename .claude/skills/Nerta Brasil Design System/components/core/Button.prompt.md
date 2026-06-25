Botão de ação da Nerta — azul é o CTA primário, dourado é para CTAs de parceiro/institucional.

```jsx
<Button variant="primary" size="lg" href="https://mercadolivre.com.br/..." external
        onClick={() => trackPixel('comprar_ml')}>
  Comprar no Mercado Livre
</Button>

<Button variant="primary" disabled disabledLabel="Produto Indisponível" />
<Button variant="partner">Solicitar produto</Button>
<Button variant="secondary">Ver ficha técnica</Button>
<Button variant="ghost">Saiba mais</Button>
```

Variants: `primary` (Nerta blue), `partner` (gold parceiro), `secondary` (outline on navy), `ghost`.
Sizes: `sm | md | lg`. Pass `href` + `external` to render as a new-tab link (Mercado Livre CTA).
When `stock === 0`, set `disabled` and `disabledLabel="Produto Indisponível"` — no link, no redirect.
