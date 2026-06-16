import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary=blue CTA, partner=Provisão gold, secondary=outlined, ghost=quiet, danger=red destructive */
  variant?: 'primary' | 'partner' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  /** Label shown when disabled — e.g. "Produto Indisponível" for out-of-stock */
  disabledLabel?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Render as an anchor when set (e.g. Mercado Livre link) */
  href?: string;
  /** Opens in a new tab with rel=noopener — use for Mercado Livre CTA */
  external?: boolean;
  children?: React.ReactNode;
}

/**
 * Primary action button for Nerta interfaces. Blue is the primary CTA,
 * gold is reserved for Provisão/partner actions.
 *
 * @startingPoint section="Core" subtitle="Botões: primário, parceiro, outline, ghost" viewport="700x200"
 */
export function Button(props: ButtonProps): JSX.Element;
