import React from 'react';

/**
 * Input — dark form field for the Nerta admin area. Navy surface,
 * thin border, blue focus ring. Supports label, hint and error.
 */
export function Input({ label, hint, error, leftIcon, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--light-gray)' }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          height: 44,
          padding: '0 14px',
          background: 'var(--surface-sunken)',
          border: `1px solid ${error ? '#E5634D' : focus ? 'var(--nerta-blue)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
          transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
        }}
      >
        {leftIcon && <span style={{ display: 'flex', color: 'var(--muted-text)' }}>{leftIcon}</span>}
        <input
          id={inputId}
          onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
          {...rest}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--white)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            ...style,
          }}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: error ? '#E5634D' : 'var(--muted-text)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
