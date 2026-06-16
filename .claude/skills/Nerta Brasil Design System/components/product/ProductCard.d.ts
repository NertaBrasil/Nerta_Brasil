import * as React from 'react';

export interface ProductCardProps {
  /** Linha de produto (uppercase, sky blue) — e.g. "Tecnologia Alcalina" */
  lineLabel?: string;
  /** Nome do produto (branco, bold) */
  name: string;
  /** Categoria (dourado) — e.g. "Detergente Espuma Ativa" */
  category?: string;
  /** Faixa de diluição — e.g. "3–5%" */
  dilution?: string;
  /** Atributos em badges teal — e.g. ["Touchless", "Agro"] */
  attributes?: string[];
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** URL do Mercado Livre (abre em nova aba) */
  mlUrl?: string;
  /** stock === 0 desabilita o CTA com "Produto Indisponível" */
  stock?: number;
  /** Mostra selo "Destaque" (carrossel da home) */
  featured?: boolean;
  /** Disparar GA/Pixel ao clicar em comprar */
  onBuy?: () => void;
}

/**
 * Card de produto canônico do catálogo Nerta (anatomia do PDF §10).
 * @startingPoint section="Produto" subtitle="Card de catálogo com CTA Mercado Livre" viewport="380x520"
 */
export function ProductCard(props: ProductCardProps): JSX.Element;
