import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

/** Campo de texto escuro para a área /admin. */
export function Input(props: InputProps): JSX.Element;
