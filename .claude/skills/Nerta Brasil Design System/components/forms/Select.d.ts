import * as React from 'react';

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options?: SelectOption[];
  placeholder?: string;
}

/** Dropdown escuro para a área /admin. */
export function Select(props: SelectProps): JSX.Element;
