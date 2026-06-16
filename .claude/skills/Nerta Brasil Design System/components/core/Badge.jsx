import React from 'react';

/**
 * Nerta Badge / pill label. Uppercase, +0.08em tracking, thin border.
 * Tones: blue (default product), gold (Provisão), teal (benefit), solid (filled blue).
 */
export function Badge({ tone = 'blue', solid = false, children, style, ...rest }) {
  const tones = {
    blue: { color: 'var(--sky-blue)', border: 'rgba(30,127,200,0.5)', bg: 'rgba(30,127,200,0.1)' },
    gold: { color: 'var(--gold-light)', border: 'rgba(201,149,26,0.55)', bg: 'rgba(201,149,26,0.1)' },
    teal: { color: 'var(--teal)', border: 'rgba(29,184,126,0.5)', bg: 'rgba(29,184,126,0.1)' },
    neutral: { color: 'var(--light-gray)', border: 'var(--navy-border)', bg: 'var(--surface-raised)' },
  };
  const t = tones[tone] || tones.blue;

  const solidMap = {
    blue: { background: 'var(--nerta-blue)', color: '#fff' },
    gold: { background: 'var(--provisao-gold)', color: '#15233A' },
    teal: { background: 'var(--teal)', color: '#0B2018' },
    neutral: { background: 'var(--surface-raised)', color: 'var(--white)' },
  };

  const styleObj = solid
    ? { ...solidMap[tone], border: '1px solid transparent' }
    : { color: t.color, background: t.bg, border: `1px solid ${t.border}` };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: '0 11px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...styleObj,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
