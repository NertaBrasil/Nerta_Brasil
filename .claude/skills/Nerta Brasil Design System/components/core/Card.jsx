import React from 'react';

/**
 * Nerta Card — dark navy surface with thin border. Optional left-accent bar
 * (the brand's most recurrent motif). Never light/white.
 */
export function Card({ accent, raised = false, interactive = false, padding = 20, children, style, ...rest }) {
  const accentColor = {
    blue: 'var(--nerta-blue)',
    gold: 'var(--provisao-gold)',
    teal: 'var(--teal)',
  }[accent];

  const [hover, setHover] = React.useState(false);

  return (
    <div
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        background: raised ? 'var(--surface-raised)' : 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: accentColor ? `var(--border-accent-width-lg) solid ${accentColor}` : undefined,
        borderRadius: 'var(--radius-lg)',
        padding,
        transition: 'border-color var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        ...(interactive && hover
          ? { borderColor: 'var(--border-strong)', transform: 'translateY(-2px)' }
          : {}),
        ...(accentColor && interactive && hover ? { borderLeftColor: accentColor } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * AccentBlock — the signature left-border accent applied to a highlight block.
 * blue = performance, gold = Provisão, teal = technology/benefit.
 */
export function AccentBlock({ accent = 'blue', title, children, style, ...rest }) {
  const color = { blue: 'var(--nerta-blue)', gold: 'var(--provisao-gold)', teal: 'var(--teal)' }[accent];
  return (
    <div
      style={{
        borderLeft: `var(--border-accent-width-lg) solid ${color}`,
        paddingLeft: 'var(--space-4)',
        ...style,
      }}
      {...rest}
    >
      {title && (
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--white)', marginBottom: 4 }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 13, color: 'var(--muted-text)', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}
