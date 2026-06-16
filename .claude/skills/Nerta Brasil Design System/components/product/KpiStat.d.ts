import * as React from 'react';

export interface KpiStatProps {
  /** O número de impacto — e.g. "50+", "60", "3–5%" */
  value: React.ReactNode;
  /** Legenda curta abaixo */
  label: React.ReactNode;
  tone?: 'teal' | 'blue' | 'gold';
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}

/** Número grande de impacto (KPI) para provas e métricas. */
export function KpiStat(props: KpiStatProps): JSX.Element;
