import React from 'react';

/**
 * Select — dark dropdown for the Nerta admin area. Matches Input styling.
 */
export function Select({ label, hint, options = [], placeholder, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
      {label && (
        <label htmlFor={selectId} style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--light-gray)' }}>
          {label}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          height: 44,
          background: 'var(--surface-sunken)',
          border: `1px solid ${focus ? 'var(--nerta-blue)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
        }}
      >
        <select
          id={selectId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            width: '100%',
            height: '100%',
            padding: '0 38px 0 14px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--white)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            cursor: 'pointer',
            ...style,
          }}
        >
          {placeholder && <option value="" disabled style={{ color: '#888' }}>{placeholder}</option>}
          {options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const text = typeof o === 'string' ? o : o.label;
            return <option key={value} value={value} style={{ background: '#112644' }}>{text}</option>;
          })}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-text)', fontSize: 11 }}>▾</span>
      </div>
      {hint && <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted-text)' }}>{hint}</span>}
    </div>
  );
}
