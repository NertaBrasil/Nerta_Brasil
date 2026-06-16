Card de produto do catálogo Nerta — navy, imagem flutuante sem sombra, CTA Mercado Livre.

```jsx
<ProductCard
  lineLabel="Tecnologia Alcalina"
  name="Active Diamond Foam"
  category="Detergente Espuma Ativa"
  dilution="3–5%"
  attributes={["Touchless", "Agro"]}
  description="Formulação alcalina superconcentrada para frotas e máquinas agrícolas."
  imageSrc="/produtos/diamond-foam.png"
  mlUrl="https://mercadolivre.com.br/..."
  stock={1}
  featured
  onBuy={() => trackPixel('comprar_ml')}
/>
```

Regra de negócio: `stock === 0` troca o CTA por um botão desabilitado "Produto Indisponível" (sem link).
`featured` mostra o selo dourado "Destaque". `onBuy` é onde você dispara o evento GA/Pixel.
A imagem deve ser PNG com fundo removido (float sobre navy, sem sombra).
