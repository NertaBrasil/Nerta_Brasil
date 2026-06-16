import React from 'react';

/**
 * Nerta Button — primary action component.
 * Variants follow the brand: blue = primary CTA, gold = Provisão/partner,
 * secondary = outlined on navy, ghost = quiet. The "Comprar no Mercado Livre"
 * CTA is a primary button rendered as an external link.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  disabledLabel,
  leftIcon,
  rightIcon,
  href,
  external = false,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { height: 36, padding: '0 16px', font: 13 },
    md: { height: 44, padding: '0 22px', font: 14 },
    lg: { height: 52, padding: '0 30px', font: 15 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: { background: 'var(--action-primary)', color: '#fff', border: '1px solid transparent' },
    partner: { background: 'var(--action-partner)', color: '#15233A', border: '1px solid transparent' },
    secondary: { background: 'transparent', color: 'var(--white)', border: '1px solid var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--sky-blue)', border: '1px solid transparent' },
    danger: { background: '#D64C39', color: '#fff', border: '1px solid transparent' },
    'danger-ghost': { background: 'transparent', color: '#E5634D', border: '1px solid rgba(214,76,57,0.45)' },
  };
  const v = variants[variant] || variants.primary;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: fullWidth ? '100%' : 'auto',
    height: s.height,
    padding: s.padding,
    fontFamily: 'var(--font-display)',
    fontSize: s.font,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), opacity var(--duration-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...v,
    ...(disabled
      ? { background: 'var(--action-disabled-bg)', color: 'var(--action-disabled-text)', border: '1px solid var(--navy-border)' }
      : {}),
    ...style,
  };

  const hoverHandlers = disabled
    ? {}
    : {
        onMouseEnter: (e) => {
          if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';
          else if (variant === 'partner') e.currentTarget.style.background = 'var(--action-partner-hover)';
          else if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-raised)';
          else if (variant === 'danger') e.currentTarget.style.background = '#E0573F';
          else if (variant === 'danger-ghost') e.currentTarget.style.background = 'rgba(214,76,57,0.12)';
          else e.currentTarget.style.background = 'var(--blue-soft)';
        },
        onMouseLeave: (e) => { e.currentTarget.style.background = v.background; },
        onMouseDown: (e) => { e.currentTarget.style.transform = 'scale(0.97)'; },
        onMouseUp: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
      };

  const label = disabled && disabledLabel ? disabledLabel : children;
  const content = (
    <>
      {leftIcon}
      {label}
      {rightIcon}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        style={base}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...hoverHandlers}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" style={base} disabled={disabled} {...hoverHandlers} {...rest}>
      {content}
    </button>
  );
}
