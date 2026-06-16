import React from 'react';

/**
 * KpiStat — large impact number (PDF §3/§4). Teal or blue, 36–56px bold.
 * Used for proof points: anos, países, diluição, etc.
 */
export function KpiStat({ value, label, tone = 'teal', align = 'left', style, ...rest }) {
  const color = tone === 'blue' ? 'var(--nerta-blue)' : tone === 'gold' ? 'var(--provisao-gold)' : 'var(--teal)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align, ...style }} {...rest}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em', color }}>
        {value}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted-text)', letterSpacing: '0.02em', maxWidth: 200 }}>
        {label}
      </span>
    </div>
  );
}
