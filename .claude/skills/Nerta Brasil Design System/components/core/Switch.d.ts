import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Toggle de boolean (ativo / destaque). Preenche azul Nerta quando ligado. */
export function Switch(props: SwitchProps): JSX.Element;
