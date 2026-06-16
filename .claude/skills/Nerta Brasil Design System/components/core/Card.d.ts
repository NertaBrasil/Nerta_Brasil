import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left-accent bar colour — the signature brand motif */
  accent?: 'blue' | 'gold' | 'teal';
  /** Use the raised navy-light surface */
  raised?: boolean;
  /** Lift + brighten border on hover */
  interactive?: boolean;
  padding?: number;
  children?: React.ReactNode;
}

export interface AccentBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'blue' | 'gold' | 'teal';
  title?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Dark navy card surface with thin border and optional accent bar.
 * @startingPoint section="Core" subtitle="Card navy + bloco de destaque com barra lateral" viewport="700x260"
 */
export function Card(props: CardProps): JSX.Element;
/** Signature left-border highlight block. */
export function AccentBlock(props: AccentBlockProps): JSX.Element;
