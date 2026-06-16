import React from 'react';

/**
 * Switch — toggle for boolean settings (ativo, destaque). Navy track,
 * fills Nerta blue when on. Pairs with an optional label.
 */
export function Switch({ checked = false, onChange, disabled = false, size = 'md', label, id, style, ...rest }) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 20 : 24;
  const knob = h - 6;
  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, userSelect: 'none', ...style,
      }}
      {...rest}
    >
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          position: 'relative', width: w, height: h, flex: 'none',
          borderRadius: 999,
          background: checked ? 'var(--nerta-blue)' : 'var(--navy-light)',
          border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'),
          transition: 'background var(--duration-fast) var(--ease-standard)',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: checked ? w - knob - 3 : 3,
          width: knob, height: knob, borderRadius: 999, background: '#fff',
          transition: 'left var(--duration-fast) var(--ease-standard)',
          boxShadow: '0 1px 2px rgba(8,19,32,0.5)',
        }} />
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--light-gray)' }}>{label}</span>}
    </label>
  );
}
