/* @ds-bundle: {"format":3,"namespace":"NertaBrasilDesignSystem_82f464","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"AccentBlock","sourcePath":"components/core/Card.jsx"},{"name":"Modal","sourcePath":"components/core/Modal.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"KpiStat","sourcePath":"components/product/KpiStat.jsx"},{"name":"ProductCard","sourcePath":"components/product/ProductCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"5a39a60490ee","components/core/Button.jsx":"e8d0510e48c6","components/core/Card.jsx":"5ce11af82ecb","components/core/Modal.jsx":"ed5574a48456","components/core/Switch.jsx":"ce885aa68f7a","components/forms/Input.jsx":"ff3c906c8e95","components/forms/Select.jsx":"569a950b60da","components/product/KpiStat.jsx":"63fbc70774ba","components/product/ProductCard.jsx":"cd50d704395b","handoff/tailwind.config.js":"7a70ab1e290c","ui_kits/admin/AdminShell.jsx":"bb19db1abe86","ui_kits/admin/CategoriasPage.jsx":"e813c0a676f9","ui_kits/admin/DestaquesPage.jsx":"d4ab3c6f57bc","ui_kits/admin/ProdutoFormPage.jsx":"0f8c64f6347e","ui_kits/admin/ProdutosPage.jsx":"f84ff2a6b262","ui_kits/admin/UsuariosPage.jsx":"7904c3582821","ui_kits/admin/admin-data.js":"8afb9b5740ea","ui_kits/admin/assets-inline.js":"abfe605cd80e","ui_kits/admin/responsive.js":"4047dae59291","ui_kits/admin/widgets.jsx":"d6730581dbcc","ui_kits/site/AboutPage.jsx":"d7ecd4983577","ui_kits/site/CatalogPage.jsx":"f84d33c003e7","ui_kits/site/Footer.jsx":"c94646dda99a","ui_kits/site/Header.jsx":"0be0a98c136c","ui_kits/site/LandingPage.jsx":"1558b96d873a","ui_kits/site/ProductPage.jsx":"9e2ffdb11b09","ui_kits/site/assets-inline.js":"abfe605cd80e","ui_kits/site/data.js":"ce7618126812","ui_kits/site/responsive.js":"4047dae59291"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NertaBrasilDesignSystem_82f464 = window.NertaBrasilDesignSystem_82f464 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nerta Badge / pill label. Uppercase, +0.08em tracking, thin border.
 * Tones: blue (default product), gold (Provisão), teal (benefit), solid (filled blue).
 */
function Badge({
  tone = 'blue',
  solid = false,
  children,
  style,
  ...rest
}) {
  const tones = {
    blue: {
      color: 'var(--sky-blue)',
      border: 'rgba(30,127,200,0.5)',
      bg: 'rgba(30,127,200,0.1)'
    },
    gold: {
      color: 'var(--gold-light)',
      border: 'rgba(201,149,26,0.55)',
      bg: 'rgba(201,149,26,0.1)'
    },
    teal: {
      color: 'var(--teal)',
      border: 'rgba(29,184,126,0.5)',
      bg: 'rgba(29,184,126,0.1)'
    },
    neutral: {
      color: 'var(--light-gray)',
      border: 'var(--navy-border)',
      bg: 'var(--surface-raised)'
    }
  };
  const t = tones[tone] || tones.blue;
  const solidMap = {
    blue: {
      background: 'var(--nerta-blue)',
      color: '#fff'
    },
    gold: {
      background: 'var(--provisao-gold)',
      color: '#15233A'
    },
    teal: {
      background: 'var(--teal)',
      color: '#0B2018'
    },
    neutral: {
      background: 'var(--surface-raised)',
      color: 'var(--white)'
    }
  };
  const styleObj = solid ? {
    ...solidMap[tone],
    border: '1px solid transparent'
  } : {
    color: t.color,
    background: t.bg,
    border: `1px solid ${t.border}`
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nerta Button — primary action component.
 * Variants follow the brand: blue = primary CTA, gold = Provisão/partner,
 * secondary = outlined on navy, ghost = quiet. The "Comprar no Mercado Livre"
 * CTA is a primary button rendered as an external link.
 */
function Button({
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
    sm: {
      height: 36,
      padding: '0 16px',
      font: 13
    },
    md: {
      height: 44,
      padding: '0 22px',
      font: 14
    },
    lg: {
      height: 52,
      padding: '0 30px',
      font: 15
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: '#fff',
      border: '1px solid transparent'
    },
    partner: {
      background: 'var(--action-partner)',
      color: '#15233A',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--white)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--sky-blue)',
      border: '1px solid transparent'
    },
    danger: {
      background: '#D64C39',
      color: '#fff',
      border: '1px solid transparent'
    },
    'danger-ghost': {
      background: 'transparent',
      color: '#E5634D',
      border: '1px solid rgba(214,76,57,0.45)'
    }
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
    ...(disabled ? {
      background: 'var(--action-disabled-bg)',
      color: 'var(--action-disabled-text)',
      border: '1px solid var(--navy-border)'
    } : {}),
    ...style
  };
  const hoverHandlers = disabled ? {} : {
    onMouseEnter: e => {
      if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';else if (variant === 'partner') e.currentTarget.style.background = 'var(--action-partner-hover)';else if (variant === 'secondary') e.currentTarget.style.background = 'var(--surface-raised)';else if (variant === 'danger') e.currentTarget.style.background = '#E0573F';else if (variant === 'danger-ghost') e.currentTarget.style.background = 'rgba(214,76,57,0.12)';else e.currentTarget.style.background = 'var(--blue-soft)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = v.background;
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };
  const label = disabled && disabledLabel ? disabledLabel : children;
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, leftIcon, label, rightIcon);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: base
    }, external ? {
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {}, hoverHandlers, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    style: base,
    disabled: disabled
  }, hoverHandlers, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Nerta Card — dark navy surface with thin border. Optional left-accent bar
 * (the brand's most recurrent motif). Never light/white.
 */
function Card({
  accent,
  raised = false,
  interactive = false,
  padding = 20,
  children,
  style,
  ...rest
}) {
  const accentColor = {
    blue: 'var(--nerta-blue)',
    gold: 'var(--provisao-gold)',
    teal: 'var(--teal)'
  }[accent];
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    style: {
      background: raised ? 'var(--surface-raised)' : 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderLeft: accentColor ? `var(--border-accent-width-lg) solid ${accentColor}` : undefined,
      borderRadius: 'var(--radius-lg)',
      padding,
      transition: 'border-color var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      ...(interactive && hover ? {
        borderColor: 'var(--border-strong)',
        transform: 'translateY(-2px)'
      } : {}),
      ...(accentColor && interactive && hover ? {
        borderLeftColor: accentColor
      } : {}),
      ...style
    }
  }, rest), children);
}

/**
 * AccentBlock — the signature left-border accent applied to a highlight block.
 * blue = performance, gold = Provisão, teal = technology/benefit.
 */
function AccentBlock({
  accent = 'blue',
  title,
  children,
  style,
  ...rest
}) {
  const color = {
    blue: 'var(--nerta-blue)',
    gold: 'var(--provisao-gold)',
    teal: 'var(--teal)'
  }[accent];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderLeft: `var(--border-accent-width-lg) solid ${color}`,
      paddingLeft: 'var(--space-4)',
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--white)',
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted-text)',
      lineHeight: 1.55
    }
  }, children));
}
Object.assign(__ds_scope, { Card, AccentBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Modal.jsx
try { (() => {
/**
 * Modal — centered dialog over a dark scrim. Used for confirmations
 * (delete) and small forms. Destructive confirms use the red danger button.
 */
function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  hideFooter = false,
  width = 440
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'var(--scrim)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: 26
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--muted-text)',
      lineHeight: 1.6
    }
  }, children), !hideFooter && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onClose
  }, cancelLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: destructive ? 'danger' : 'primary',
    size: "sm",
    onClick: onConfirm
  }, confirmLabel))));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Modal.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Switch — toggle for boolean settings (ativo, destaque). Navy track,
 * fills Nerta blue when on. Pairs with an optional label.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  id,
  style,
  ...rest
}) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 20 : 24;
  const knob = h - 6;
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: w,
      height: h,
      flex: 'none',
      borderRadius: 999,
      background: checked ? 'var(--nerta-blue)' : 'var(--navy-light)',
      border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'),
      transition: 'background var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? w - knob - 3 : 3,
      width: knob,
      height: knob,
      borderRadius: 999,
      background: '#fff',
      transition: 'left var(--duration-fast) var(--ease-standard)',
      boxShadow: '0 1px 2px rgba(8,19,32,0.5)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--light-gray)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — dark form field for the Nerta admin area. Navy surface,
 * thin border, blue focus ring. Supports label, hint and error.
 */
function Input({
  label,
  hint,
  error,
  leftIcon,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--light-gray)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 44,
      padding: '0 14px',
      background: 'var(--surface-sunken)',
      border: `1px solid ${error ? '#E5634D' : focus ? 'var(--nerta-blue)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)'
    }
  }, leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--muted-text)'
    }
  }, leftIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      ...style
    }
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: error ? '#E5634D' : 'var(--muted-text)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — dark dropdown for the Nerta admin area. Matches Input styling.
 */
function Select({
  label,
  hint,
  options = [],
  placeholder,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--light-gray)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 44,
      background: 'var(--surface-sunken)',
      border: `1px solid ${focus ? 'var(--nerta-blue)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest, {
    style: {
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
      ...style
    }
  }), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    style: {
      color: '#888'
    }
  }, placeholder), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value,
      style: {
        background: '#112644'
      }
    }, text);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--muted-text)',
      fontSize: 11
    }
  }, "\u25BE")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: 'var(--muted-text)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/product/KpiStat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KpiStat — large impact number (PDF §3/§4). Teal or blue, 36–56px bold.
 * Used for proof points: anos, países, diluição, etc.
 */
function KpiStat({
  value,
  label,
  tone = 'teal',
  align = 'left',
  style,
  ...rest
}) {
  const color = tone === 'blue' ? 'var(--nerta-blue)' : tone === 'gold' ? 'var(--provisao-gold)' : 'var(--teal)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1,
      letterSpacing: '-0.02em',
      color
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--muted-text)',
      letterSpacing: '0.02em',
      maxWidth: 200
    }
  }, label));
}
Object.assign(__ds_scope, { KpiStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/KpiStat.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProductCard — the canonical Nerta catalog card (PDF §10 anatomy).
 * Navy surface, line label, white name, gold category, dilution highlight,
 * attribute badges, floating product image (no shadow), Mercado Livre CTA.
 * When stock === 0 the CTA becomes a disabled "Produto Indisponível".
 */
function ProductCard({
  lineLabel,
  name,
  category,
  dilution,
  attributes = [],
  description,
  imageSrc,
  imageAlt,
  mlUrl,
  stock = 1,
  featured = false,
  onBuy,
  style,
  // absorbed so they don't leak onto the DOM
  active,
  slug,
  short,
  line,
  icon,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const outOfStock = stock === 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'border-color var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      ...(hover ? {
        borderColor: 'var(--border-strong)',
        transform: 'translateY(-3px)'
      } : {}),
      ...style
    }
  }, rest), featured && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "gold",
    solid: true
  }, "Destaque")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 196,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(120% 90% at 50% 30%, #163258 0%, #0D1B2E 72%)',
      padding: 20
    }
  }, imageSrc ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: imageAlt || name,
    style: {
      maxHeight: '100%',
      maxWidth: '70%',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--navy-border)',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, "Bombona 25L")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1
    }
  }, lineLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--sky-blue)'
    }
  }, lineLabel), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 19,
      color: 'var(--white)',
      letterSpacing: '-0.01em',
      lineHeight: 1.15
    }
  }, name), category && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--provisao-gold)',
      marginTop: 3
    }
  }, category)), (dilution || attributes.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 7
    }
  }, dilution && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "blue",
    solid: true
  }, `Diluição ${dilution}`), attributes.map(a => /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    key: a,
    tone: "teal"
  }, a))), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      lineHeight: 1.55,
      color: 'var(--muted-text)'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 6
    }
  }, outOfStock ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    fullWidth: true,
    disabled: true,
    disabledLabel: "Produto Indispon\xEDvel"
  }) : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    fullWidth: true,
    href: mlUrl,
    external: true,
    onClick: onBuy
  }, "Comprar no Mercado Livre"))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductCard.jsx", error: String((e && e.message) || e) }); }

// handoff/tailwind.config.js
try { (() => {
/** Nerta Brasil — Tailwind theme tokens.
 *  Cole na raiz do projeto Next.js. Cores espelham tokens/colors.css.
 *  Regra #1: navy é o fundo padrão — nunca use bg-white em superfícies primárias.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#0D1B2E',
          // fundo principal (inegociável)
          deeper: '#081320',
          // profundidade / sunken
          mid: '#112644',
          // cards / painéis
          light: '#163258',
          // hover / raised
          border: '#1E3A5A' // bordas sutis
        },
        nerta: {
          DEFAULT: '#1E7FC8',
          // azul primário — CTAs, links
          hover: '#2A8FD8',
          press: '#176FB0',
          sky: '#5BB8F5' // palavras-chave, numeração editorial
        },
        provisao: {
          DEFAULT: '#C9951A',
          // dourado — EXCLUSIVO da parceria
          light: '#F4C94E',
          hover: '#DBA52A'
        },
        teal: {
          DEFAULT: '#1DB87E' // ícones de benefício, checks
        },
        ink: {
          title: '#FFFFFF',
          body: '#8A9BB0',
          // corpo de texto (muted)
          tertiary: '#D9DDE3'
        },
        disabled: {
          bg: '#1A2A40',
          text: '#5A6B82'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        kpi: ['48px', {
          lineHeight: '1',
          letterSpacing: '-0.02em'
        }],
        hero: ['54px', {
          lineHeight: '1.04',
          letterSpacing: '-0.02em'
        }]
      },
      letterSpacing: {
        headline: '-0.02em',
        label: '0.08em'
      },
      borderRadius: {
        card: '12px',
        // raio padrão de card (8–12px)
        'card-sm': '8px',
        pill: '999px'
      },
      boxShadow: {
        card: '0 6px 20px rgba(8,19,32,0.45)',
        lg: '0 18px 48px rgba(8,19,32,0.55)'
        // produto flutua SEM sombra — não usar shadow em fotos de produto
      },
      backgroundImage: {
        'hero-navy': 'linear-gradient(135deg, #0D1B2E 0%, #163258 100%)'
      },
      ringColor: {
        focus: 'rgba(91,184,245,0.55)'
      }
    }
  },
  plugins: []
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "handoff/tailwind.config.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminShell.jsx
try { (() => {
// Nerta Admin — shared shell (sidebar + topbar) and small UI helpers.
const NAS = window.NertaBrasilDesignSystem_82f464;

// Role badge — admin = gold, editor = sky blue.
function RoleBadge({
  role
}) {
  const {
    Badge
  } = NAS;
  return /*#__PURE__*/React.createElement(Badge, {
    tone: role === 'admin' ? 'gold' : 'blue',
    solid: false
  }, role === 'admin' ? 'Admin' : 'Editor');
}
window.RoleBadge = RoleBadge;

// Status pill — ativo (teal) / inativo (muted).
function StatusPill({
  active
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 10px',
      borderRadius: 999,
      fontFamily: 'var(--font-body)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: active ? 'var(--teal)' : 'var(--muted-text)',
      background: active ? 'rgba(29,184,126,0.1)' : 'var(--surface-raised)',
      border: '1px solid ' + (active ? 'rgba(29,184,126,0.4)' : 'var(--border-subtle)')
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: active ? 'var(--teal)' : 'var(--muted-text)'
    }
  }), active ? 'Ativo' : 'Inativo');
}
window.StatusPill = StatusPill;

// Icon-only action button for table rows.
function IconBtn({
  icon,
  title,
  tone = 'default',
  onClick,
  disabled = false
}) {
  const color = disabled ? 'var(--action-disabled-text)' : tone === 'danger' ? '#E5634D' : tone === 'blue' ? 'var(--sky-blue)' : 'var(--muted-text)';
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    title: title,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    onMouseEnter: () => !disabled && setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: h ? 'var(--surface-raised)' : 'transparent',
      border: '1px solid ' + (h ? 'var(--border-strong)' : 'var(--border-subtle)'),
      opacity: disabled ? 0.45 : 1,
      color,
      transition: 'all var(--duration-fast)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 16,
      height: 16
    }
  }));
}
window.IconBtn = IconBtn;

// Search input with leading icon.
function SearchBar({
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 42,
      padding: '0 14px',
      minWidth: 220,
      flex: 1,
      maxWidth: 360,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 16,
      height: 16,
      color: 'var(--muted-text)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder || 'Buscar...',
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 14
    }
  }));
}
window.SearchBar = SearchBar;
function AdminShell({
  active,
  title,
  userName = 'Marina Albuquerque',
  userRole = 'admin',
  children
}) {
  const mob = window.useIsMobile(900);
  const [drawer, setDrawer] = React.useState(false);
  const items = [{
    id: 'produtos',
    label: 'Produtos',
    icon: 'package',
    href: 'Nerta-Admin-Produtos.html'
  }, {
    id: 'categorias',
    label: 'Categorias',
    icon: 'tags',
    href: 'Nerta-Admin-Categorias.html'
  }, {
    id: 'destaques',
    label: 'Destaques',
    icon: 'star',
    href: 'Nerta-Admin-Destaques.html'
  }, {
    id: 'usuarios',
    label: 'Usuários',
    icon: 'users',
    href: 'Nerta-Admin-Usuarios.html',
    adminOnly: true
  }].filter(i => !(i.adminOnly && userRole !== 'admin'));
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const Sidebar = /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: 'none',
      background: 'var(--surface-sunken)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px',
      height: mob ? '100%' : 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 8px 22px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.NERTA_LOGO_DARK,
    alt: "nerta",
    height: "30"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--provisao-gold)'
    }
  }, "Admin")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it.id,
      href: it.href,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 44,
        padding: '0 14px',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: on ? 'var(--white)' : 'var(--muted-text)',
        background: on ? 'var(--blue-soft)' : 'transparent',
        borderLeft: on ? '3px solid var(--nerta-blue)' : '3px solid transparent',
        transition: 'all var(--duration-fast)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": it.icon,
      style: {
        width: 18,
        height: 18,
        color: on ? 'var(--sky-blue)' : 'var(--muted-text)'
      }
    }), it.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 18,
      borderTop: '1px solid var(--border-subtle)',
      fontSize: 10.5,
      color: 'var(--muted-text)',
      lineHeight: 1.5,
      padding: '18px 8px 0'
    }
  }, "Distribui\xE7\xE3o exclusiva", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--provisao-gold)'
    }
  }, "Provis\xE3o Com\xE9rcio Internacional")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--navy-deep)'
    }
  }, !mob && Sidebar, mob && drawer && /*#__PURE__*/React.createElement("div", {
    onClick: () => setDrawer(false),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 120,
      background: 'var(--scrim)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 248,
      zIndex: 121
    }
  }, Sidebar)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: mob ? '12px 18px' : '16px 32px',
      background: 'rgba(13,27,46,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 0
    }
  }, mob && /*#__PURE__*/React.createElement("button", {
    onClick: () => setDrawer(true),
    style: {
      display: 'inline-flex',
      background: 'none',
      border: 'none',
      color: 'var(--white)',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "menu",
    style: {
      width: 24,
      height: 24
    }
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: mob ? 18 : 22,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, !mob && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--white)',
      fontWeight: 500
    }
  }, userName), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(RoleBadge, {
    role: userRole
  }))), /*#__PURE__*/React.createElement("button", {
    title: "Sair",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 38,
      padding: '0 14px',
      background: 'transparent',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      color: 'var(--muted-text)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "log-out",
    style: {
      width: 15,
      height: 15
    }
  }), !mob && 'Sair'))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: mob ? '22px 18px 48px' : '32px 32px 56px'
    }
  }, children)));
}
window.AdminShell = AdminShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/CategoriasPage.jsx
try { (() => {
// /admin/categorias — category listing + create/edit/delete.
const NCG = window.NertaBrasilDesignSystem_82f464;
function CategoriasPage() {
  const {
    Button,
    Input
  } = NCG;
  const Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_CATEGORIES);
  const [form, setForm] = React.useState(null); // {id?, name}
  const [name, setName] = React.useState('');
  const [toDelete, setToDelete] = React.useState(null);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const openNew = () => {
    setName('');
    setForm({});
  };
  const openEdit = c => {
    setName(c.name);
    setForm(c);
  };
  const save = () => {
    if (!name.trim()) return;
    if (form.id) setRows(r => r.map(c => c.id === form.id ? {
      ...c,
      name,
      slug: window.slugify(name)
    } : c));else setRows(r => [...r, {
      id: 'c' + Date.now(),
      name,
      slug: window.slugify(name),
      count: 0
    }]);
    setForm(null);
  };
  const doDelete = () => {
    setRows(r => r.filter(c => c.id !== toDelete.id));
    setToDelete(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 13
    }
  }, rows.length, " categorias"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: openNew,
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Nova Categoria")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr 0.8fr 0.7fr' : '1.4fr 1.2fr 0.8fr 0.8fr',
      gap: 12,
      padding: '13px 18px',
      background: 'var(--surface-raised)',
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--light-gray)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Nome"), !mob && /*#__PURE__*/React.createElement("span", null, "Slug"), /*#__PURE__*/React.createElement("span", null, "Produtos"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "A\xE7\xF5es")), rows.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr 0.8fr 0.7fr' : '1.4fr 1.2fr 0.8fr 0.8fr',
      gap: 12,
      alignItems: 'center',
      padding: '13px 18px',
      background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)',
      fontWeight: 600,
      fontSize: 14
    }
  }, c.name), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sky-blue)',
      fontSize: 12.5,
      fontFamily: 'var(--font-body)'
    }
  }, c.slug), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--light-gray)',
      fontSize: 13
    }
  }, c.count, " ", c.count === 1 ? 'produto' : 'produtos'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "pencil",
    title: "Editar",
    tone: "blue",
    onClick: () => openEdit(c)
  }), /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "trash-2",
    title: c.count > 0 ? 'Categoria com produtos' : 'Excluir',
    tone: "danger",
    onClick: () => setToDelete(c)
  }))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!form,
    hideFooter: true,
    width: 420,
    onClose: () => setForm(null)
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      marginBottom: 16
    }
  }, form && form.id ? 'Editar categoria' : 'Nova categoria'), /*#__PURE__*/React.createElement(Input, {
    label: "Nome",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Detergente Espuma Ativa"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--muted-text)'
    }
  }, "slug:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--sky-blue)'
    }
  }, window.slugify(name) || '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => setForm(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: save
  }, "Salvar"))), /*#__PURE__*/React.createElement(Modal, {
    open: !!toDelete,
    title: toDelete && toDelete.count > 0 ? 'Categoria com produtos' : 'Excluir categoria?',
    destructive: toDelete && toDelete.count === 0,
    confirmLabel: toDelete && toDelete.count > 0 ? 'Entendi' : 'Excluir',
    hideFooter: false,
    onClose: () => setToDelete(null),
    onConfirm: toDelete && toDelete.count > 0 ? () => setToDelete(null) : doDelete
  }, toDelete && toDelete.count > 0 ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--white)'
    }
  }, toDelete.name), " possui ", toDelete.count, " produto(s) vinculado(s). Remova ou reclassifique os produtos antes de excluir a categoria.") : /*#__PURE__*/React.createElement("span", null, "Excluir ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--white)'
    }
  }, toDelete && toDelete.name), "? Esta a\xE7\xE3o n\xE3o pode ser desfeita.")));
}
window.CategoriasPage = CategoriasPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/CategoriasPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/DestaquesPage.jsx
try { (() => {
// /admin/destaques — featured products management.
const NDQ = window.NertaBrasilDesignSystem_82f464;
function DestaquesPage() {
  const {
    Badge
  } = NDQ;
  const Switch = window.Switch;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_PRODUCTS);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const count = rows.filter(p => p.featured).length;
  const toggle = id => setRows(r => r.map(p => p.id === id ? {
    ...p,
    featured: !p.featured
  } : p));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 22px',
      marginBottom: 22,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderLeft: '4px solid var(--provisao-gold)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      background: 'var(--gold-soft)',
      color: 'var(--provisao-gold)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "star",
    style: {
      width: 26,
      height: 26,
      fill: 'currentColor'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 28,
      color: 'var(--white)',
      lineHeight: 1
    }
  }, count), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted-text)',
      marginTop: 4
    }
  }, count, " produtos aparecem no carrossel da home"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
      gap: 12
    }
  }, rows.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      background: 'var(--surface-card)',
      border: '1px solid ' + (p.featured ? 'rgba(201,149,26,0.4)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--navy-border)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon,
    style: {
      width: 22,
      height: 22
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)',
      fontWeight: 600,
      fontSize: 14,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.name), p.featured && /*#__PURE__*/React.createElement(Badge, {
    tone: "gold",
    solid: true
  }, "Destaque")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 12,
      marginTop: 3
    }
  }, p.category)), /*#__PURE__*/React.createElement(Switch, {
    checked: p.featured,
    onChange: () => toggle(p.id)
  })))));
}
window.DestaquesPage = DestaquesPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/DestaquesPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ProdutoFormPage.jsx
try { (() => {
// /admin/produtos/novo + /[id] — product form with crop + gallery.
const NPF = window.NertaBrasilDesignSystem_82f464;
function Section({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      marginBottom: 18
    }
  }, title), children);
}
function ProdutoFormPage({
  editing = false
}) {
  const {
    Button,
    Input,
    Select
  } = NPF;
  const Switch = window.Switch,
    Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const seed = editing ? window.ADMIN_PRODUCTS[0] : null;
  const [name, setName] = React.useState(seed ? seed.name : '');
  const [slug, setSlug] = React.useState(seed ? window.slugify(seed.name) : '');
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [tags, setTags] = React.useState(seed ? seed.attributes : ['Touchless']);
  const [active, setActive] = React.useState(seed ? seed.active : true);
  const [featured, setFeatured] = React.useState(seed ? seed.featured : false);
  const [preview, setPreview] = React.useState(false);
  const [cropOpen, setCropOpen] = React.useState(false);
  const [images, setImages] = React.useState(editing ? [{
    id: 1,
    icon: 'sparkles'
  }, {
    id: 2,
    icon: 'droplet'
  }] : []);
  const dragIdx = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  React.useEffect(() => {
    if (!slugEdited) setSlug(window.slugify(name));
  }, [name]);
  const cats = window.ADMIN_CATEGORIES.map(c => c.name);
  const addImage = () => {
    setImages(im => [...im, {
      id: Date.now(),
      icon: 'image'
    }]);
    setCropOpen(false);
  };
  const onDrop = i => {
    const from = dragIdx.current;
    if (from === null || from === i) return;
    setImages(im => {
      const a = [...im];
      const [m] = a.splice(from, 1);
      a.splice(i, 0, m);
      return a;
    });
    dragIdx.current = null;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "Nerta-Admin-Produtos.html",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      color: 'var(--muted-text)',
      fontSize: 13,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 15,
      height: 15
    }
  }), " Voltar para produtos"), /*#__PURE__*/React.createElement(Section, {
    title: "Informa\xE7\xF5es b\xE1sicas"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Input, {
    label: "Nome do produto",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Active Diamond Foam"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--muted-text)'
    }
  }, "/produto/"), /*#__PURE__*/React.createElement("input", {
    value: slug,
    onChange: e => {
      setSlug(window.slugify(e.target.value));
      setSlugEdited(true);
    },
    style: {
      flex: 1,
      height: 30,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--sky-blue)',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      padding: '0 10px',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement(Input, {
    label: "Linha",
    defaultValue: seed ? seed.line : '',
    placeholder: "Linha Frotas"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Categoria",
    placeholder: "Selecione",
    options: cats,
    defaultValue: seed ? seed.category : ''
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Dilui\xE7\xE3o",
    defaultValue: seed ? seed.dilution : '',
    placeholder: "3\u20135%"
  }))), /*#__PURE__*/React.createElement(Section, {
    title: "Descri\xE7\xE3o"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPreview(!preview),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      color: preview ? 'var(--sky-blue)' : 'var(--muted-text)',
      cursor: 'pointer',
      fontSize: 11.5,
      height: 30,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": preview ? 'pencil' : 'eye',
    style: {
      width: 13,
      height: 13
    }
  }), preview ? 'Editar' : 'Preview')), preview ? /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 120,
      padding: 14,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--light-gray)',
      fontSize: 14,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--white)'
    }
  }, "Formula\xE7\xE3o alcalina superconcentrada"), " que dissolve sujeiras severas ", /*#__PURE__*/React.createElement("em", null, "sem necessidade de esfrega\xE7\xE3o"), ".") : /*#__PURE__*/React.createElement("textarea", {
    defaultValue: "**Formulação alcalina superconcentrada** que dissolve sujeiras severas *sem necessidade de esfregação*.",
    style: {
      width: '100%',
      minHeight: 120,
      padding: 14,
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.6,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--muted-text)',
      marginTop: 7
    }
  }, "Markdown suportado \xB7 **negrito**, *it\xE1lico*, listas")), /*#__PURE__*/React.createElement(Section, {
    title: "Atributos & badges"
  }, /*#__PURE__*/React.createElement(window.FieldLabel, {
    hint: "aparecem como pills no card do produto"
  }, "Atributos"), /*#__PURE__*/React.createElement(window.TagInput, {
    tags: tags,
    onChange: setTags
  })), /*#__PURE__*/React.createElement(Section, {
    title: "Comercial & estoque"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Pre\xE7o (R$)",
    type: "number",
    defaultValue: seed ? seed.price : '',
    placeholder: "489.90"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Estoque",
    type: "number",
    defaultValue: seed ? seed.stock : '',
    hint: "0 desabilita o bot\xE3o de compra",
    placeholder: "24"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "URL do Mercado Livre",
    defaultValue: editing ? 'https://mercadolivre.com.br/...' : '',
    placeholder: "https://..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: active,
    onChange: setActive,
    label: "Ativo no cat\xE1logo"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: featured,
    onChange: setFeatured,
    label: "Destaque na home"
  }))), /*#__PURE__*/React.createElement(Section, {
    title: "Imagens do produto"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--muted-text)',
      marginBottom: 16
    }
  }, "Sem limite de imagens. Cada uma passa por recorte 1:1 antes de salvar. Arraste para reordenar \u2014 a primeira \xE9 a ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--light-gray)'
    }
  }, "Principal"), " (capa do card)."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: 12
    }
  }, images.map((img, i) => /*#__PURE__*/React.createElement("div", {
    key: img.id,
    draggable: true,
    onDragStart: () => {
      dragIdx.current = i;
    },
    onDragOver: e => e.preventDefault(),
    onDrop: () => onDrop(i),
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid ' + (i === 0 ? 'var(--nerta-blue)' : 'var(--border-subtle)'),
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--navy-border)',
      cursor: 'grab'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": img.icon,
    style: {
      width: 34,
      height: 34
    }
  }), i === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8,
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#fff',
      background: 'var(--nerta-blue)',
      borderRadius: 999,
      padding: '3px 8px'
    }
  }, "Principal"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setImages(im => im.filter(x => x.id !== img.id)),
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 26,
      height: 26,
      borderRadius: 999,
      background: 'var(--scrim)',
      border: '1px solid var(--border-subtle)',
      color: '#E5634D',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 13,
      height: 13
    }
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCropOpen(true),
    style: {
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--border-strong)',
      background: 'transparent',
      color: 'var(--muted-text)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 24,
      height: 24
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5
    }
  }, "Adicionar")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      position: 'sticky',
      bottom: 0,
      padding: '16px 0',
      background: 'linear-gradient(transparent, var(--navy-deep) 30%)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    href: "Nerta-Admin-Produtos.html"
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "check",
      style: {
        width: 16,
        height: 16
      }
    })
  }, editing ? 'Salvar alterações' : 'Criar produto')), /*#__PURE__*/React.createElement(Modal, {
    open: cropOpen,
    hideFooter: true,
    width: 400,
    onClose: () => setCropOpen(false)
  }, /*#__PURE__*/React.createElement(window.ImageCropper, {
    onConfirm: addImage,
    onCancel: () => setCropOpen(false)
  })));
}
window.ProdutoFormPage = ProdutoFormPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ProdutoFormPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ProdutosPage.jsx
try { (() => {
// /admin/produtos — product listing with search, filters, inline actions.
const NPL = window.NertaBrasilDesignSystem_82f464;
function ProdutosPage() {
  const {
    Button,
    Badge
  } = NPL;
  const Switch = window.Switch,
    Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_PRODUCTS);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('__all');
  const [status, setStatus] = React.useState('__all');
  const [feat, setFeat] = React.useState('__all');
  const [toDelete, setToDelete] = React.useState(null);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const cats = [...new Set(window.ADMIN_PRODUCTS.map(p => p.category))];
  const shown = rows.filter(p => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (cat !== '__all' && p.category !== cat) return false;
    if (status !== '__all' && status === 'Ativo' !== p.active) return false;
    if (feat !== '__all' && feat === 'Em destaque' !== p.featured) return false;
    return true;
  });
  const toggleActive = id => setRows(r => r.map(p => p.id === id ? {
    ...p,
    active: !p.active
  } : p));
  const doDelete = () => {
    setRows(r => r.filter(p => p.id !== toDelete.id));
    setToDelete(null);
  };
  const Thumb = ({
    icon
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--navy-border)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 20,
      height: 20
    }
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 13
    }
  }, shown.length, " de ", rows.length, " produtos"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: "Nerta-Admin-Produtos-Form.html",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Novo Produto")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 20,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: q,
    onChange: setQ,
    placeholder: "Buscar por nome..."
  }), /*#__PURE__*/React.createElement(window.FilterSelect, {
    label: "Categoria",
    value: cat,
    options: cats,
    onChange: setCat
  }), /*#__PURE__*/React.createElement(window.FilterSelect, {
    label: "Status",
    value: status,
    options: ['Ativo', 'Inativo'],
    onChange: setStatus
  }), /*#__PURE__*/React.createElement(window.FilterSelect, {
    label: "Destaque",
    value: feat,
    options: ['Em destaque', 'Sem destaque'],
    onChange: setFeat
  })), shown.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 20px',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--muted-text)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "package-x",
    style: {
      width: 40,
      height: 40,
      color: 'var(--navy-border)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 15,
      color: 'var(--light-gray)'
    }
  }, "Nenhum produto encontrado"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 6
    }
  }, "Ajuste a busca ou os filtros.")) : mob ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, shown.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Thumb, {
    icon: p.icon
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)',
      fontWeight: 600,
      fontSize: 15
    }
  }, p.name), p.featured && /*#__PURE__*/React.createElement(Badge, {
    tone: "gold",
    solid: true
  }, "Destaque")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 12,
      marginTop: 3
    }
  }, p.category, " \xB7 ", p.line), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sky-blue)',
      fontWeight: 700,
      fontSize: 14
    }
  }, window.brl(p.price)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.stock === 0 ? '#E5634D' : 'var(--muted-text)',
      fontSize: 12
    }
  }, "Estoque: ", p.stock), /*#__PURE__*/React.createElement(window.StatusPill, {
    active: p.active
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "pencil",
    title: "Editar",
    tone: "blue",
    onClick: () => {
      window.location.href = 'Nerta-Admin-Produtos-Form.html';
    }
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: p.active,
    onChange: () => toggleActive(p.id),
    size: "sm"
  }), /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "trash-2",
    title: "Excluir",
    tone: "danger",
    onClick: () => setToDelete(p)
  }))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1fr 0.8fr 0.6fr 0.8fr 1fr',
      gap: 12,
      padding: '13px 18px',
      background: 'var(--surface-raised)',
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--light-gray)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Produto"), /*#__PURE__*/React.createElement("span", null, "Categoria"), /*#__PURE__*/React.createElement("span", null, "Pre\xE7o"), /*#__PURE__*/React.createElement("span", null, "Estoque"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "A\xE7\xF5es")), shown.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1fr 0.8fr 0.6fr 0.8fr 1fr',
      gap: 12,
      alignItems: 'center',
      padding: '12px 18px',
      background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Thumb, {
    icon: p.icon
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)',
      fontWeight: 600,
      fontSize: 14,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.name), p.featured && /*#__PURE__*/React.createElement("i", {
    "data-lucide": "star",
    style: {
      width: 14,
      height: 14,
      color: 'var(--provisao-gold)',
      fill: 'var(--provisao-gold)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 11.5,
      marginTop: 2
    }
  }, p.line))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--light-gray)',
      fontSize: 13
    }
  }, p.category), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sky-blue)',
      fontWeight: 700,
      fontSize: 13.5
    }
  }, window.brl(p.price)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.stock === 0 ? '#E5634D' : 'var(--light-gray)',
      fontSize: 13,
      fontWeight: p.stock === 0 ? 600 : 400
    }
  }, p.stock), /*#__PURE__*/React.createElement(window.StatusPill, {
    active: p.active
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "pencil",
    title: "Editar",
    tone: "blue",
    onClick: () => {
      window.location.href = 'Nerta-Admin-Produtos-Form.html';
    }
  }), /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: p.active ? 'eye' : 'eye-off',
    title: p.active ? 'Desativar' : 'Ativar',
    onClick: () => toggleActive(p.id)
  }), /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "trash-2",
    title: "Excluir",
    tone: "danger",
    onClick: () => setToDelete(p)
  }))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!toDelete,
    title: "Excluir produto?",
    destructive: true,
    confirmLabel: "Excluir",
    onClose: () => setToDelete(null),
    onConfirm: doDelete
  }, "Tem certeza que deseja excluir ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--white)'
    }
  }, toDelete && toDelete.name), "? Esta a\xE7\xE3o n\xE3o pode ser desfeita e o produto sai do cat\xE1logo imediatamente."));
}
window.ProdutosPage = ProdutosPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ProdutosPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/UsuariosPage.jsx
try { (() => {
// /admin/usuarios — user management (admin only; hidden from editor).
const NUS = window.NertaBrasilDesignSystem_82f464;
function UsuariosPage() {
  const {
    Button,
    Input,
    Select
  } = NUS;
  const Modal = window.Modal;
  const mob = window.useIsMobile(900);
  const [rows, setRows] = React.useState(window.ADMIN_USERS);
  const [form, setForm] = React.useState(null); // {id?, name, email, role}
  const [toDelete, setToDelete] = React.useState(null);
  const [f, setF] = React.useState({
    name: '',
    email: '',
    role: 'editor'
  });
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const openNew = () => {
    setF({
      name: '',
      email: '',
      role: 'editor'
    });
    setForm({});
  };
  const openEdit = u => {
    setF({
      name: u.name,
      email: u.email,
      role: u.role
    });
    setForm(u);
  };
  const save = () => {
    if (form.id) setRows(r => r.map(u => u.id === form.id ? {
      ...u,
      name: f.name,
      role: f.role
    } : u));else setRows(r => [...r, {
      id: 'u' + Date.now(),
      name: f.name,
      email: f.email,
      role: f.role,
      created: 'hoje',
      self: false
    }]);
    setForm(null);
  };
  const doDelete = () => {
    setRows(r => r.filter(u => u.id !== toDelete.id));
    setToDelete(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 13
    }
  }, rows.length, " usu\xE1rios \xB7 somente admins podem gerenciar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: openNew,
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "user-plus",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Novo Usu\xE1rio")), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.4fr 1.5fr 0.7fr 0.8fr 0.7fr',
      gap: 12,
      padding: '13px 18px',
      background: 'var(--surface-raised)',
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--light-gray)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Nome"), !mob && /*#__PURE__*/React.createElement("span", null, "E-mail"), /*#__PURE__*/React.createElement("span", null, "Papel"), !mob && /*#__PURE__*/React.createElement("span", null, "Criado"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "A\xE7\xF5es")), rows.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: u.id,
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr 0.7fr 0.6fr' : '1.4fr 1.5fr 0.7fr 0.8fr 0.7fr',
      gap: 12,
      alignItems: 'center',
      padding: '13px 18px',
      background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      flex: 'none',
      borderRadius: 999,
      background: u.role === 'admin' ? 'var(--gold-soft)' : 'var(--blue-soft)',
      color: u.role === 'admin' ? 'var(--provisao-gold)' : 'var(--sky-blue)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13
    }
  }, u.name.charAt(0)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--white)',
      fontWeight: 600,
      fontSize: 14,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, u.name, u.self && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted-text)',
      fontWeight: 400,
      fontSize: 11
    }
  }, " (voc\xEA)"))), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--light-gray)',
      fontSize: 13
    }
  }, u.email), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(window.RoleBadge, {
    role: u.role
  })), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted-text)',
      fontSize: 12.5
    }
  }, u.created), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "pencil",
    title: "Editar",
    tone: "blue",
    onClick: () => openEdit(u)
  }), /*#__PURE__*/React.createElement(window.IconBtn, {
    icon: "trash-2",
    title: u.self ? 'Não é possível excluir a própria conta' : 'Excluir',
    tone: "danger",
    disabled: u.self,
    onClick: () => setToDelete(u)
  }))))), /*#__PURE__*/React.createElement(Modal, {
    open: !!form,
    hideFooter: true,
    width: 440,
    onClose: () => setForm(null)
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      marginBottom: 16
    }
  }, form && form.id ? 'Editar usuário' : 'Novo usuário'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nome",
    value: f.name,
    onChange: e => setF({
      ...f,
      name: e.target.value
    }),
    placeholder: "Nome completo"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    type: "email",
    value: f.email,
    onChange: e => setF({
      ...f,
      email: e.target.value
    }),
    placeholder: "nome@provisao.com.br",
    disabled: !!(form && form.id),
    hint: form && form.id ? 'E-mail não pode ser alterado' : undefined
  }), !(form && form.id) && /*#__PURE__*/React.createElement(Input, {
    label: "Senha provis\xF3ria",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    hint: "O usu\xE1rio troca no primeiro acesso"
  }), form && form.id && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--muted-text)'
    }
  }, "Senha: redefini\xE7\xE3o via e-mail (n\xE3o edit\xE1vel aqui)."), /*#__PURE__*/React.createElement(Select, {
    label: "Papel",
    options: [{
      value: 'admin',
      label: 'Admin — acesso total'
    }, {
      value: 'editor',
      label: 'Editor — sem gestão de usuários'
    }],
    value: f.role,
    onChange: e => setF({
      ...f,
      role: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => setForm(null)
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: save
  }, "Salvar"))), /*#__PURE__*/React.createElement(Modal, {
    open: !!toDelete,
    title: "Excluir usu\xE1rio?",
    destructive: true,
    confirmLabel: "Excluir",
    onClose: () => setToDelete(null),
    onConfirm: doDelete
  }, "Remover o acesso de ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--white)'
    }
  }, toDelete && toDelete.name), "? A conta perde acesso ao painel imediatamente."));
}
window.UsuariosPage = UsuariosPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/UsuariosPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/admin-data.js
try { (() => {
// Nerta Admin — sample data + helpers for the admin UI kit (fictional).
window.slugify = function (s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};
window.ADMIN_CATEGORIES = [{
  id: 'c1',
  name: 'Detergente Espuma Ativa',
  slug: 'detergente-espuma-ativa',
  count: 2
}, {
  id: 'c2',
  name: 'Detergente Concentrado',
  slug: 'detergente-concentrado',
  count: 1
}, {
  id: 'c3',
  name: 'Desincrustante Agrícola',
  slug: 'desincrustante-agricola',
  count: 1
}, {
  id: 'c4',
  name: 'Shampoo Premium',
  slug: 'shampoo-premium',
  count: 1
}, {
  id: 'c5',
  name: 'Higiene Animal',
  slug: 'higiene-animal',
  count: 0
}];
window.ADMIN_PRODUCTS = [{
  id: 'p1',
  name: 'Active Diamond Foam',
  line: 'Tecnologia Alcalina',
  category: 'Detergente Espuma Ativa',
  dilution: '3–5%',
  attributes: ['Touchless', 'Agro'],
  price: 489.90,
  stock: 24,
  active: true,
  featured: true,
  icon: 'sparkles'
}, {
  id: 'p2',
  name: 'Truck Wash Pro',
  line: 'Linha Frotas',
  category: 'Detergente Concentrado',
  dilution: '5–10%',
  attributes: ['pH Neutro', 'Frotas'],
  price: 412.00,
  stock: 11,
  active: true,
  featured: true,
  icon: 'truck'
}, {
  id: 'p3',
  name: 'Agro Power 25',
  line: 'Linha Agro',
  category: 'Desincrustante Agrícola',
  dilution: '8–12%',
  attributes: ['Agro', 'Alta Performance'],
  price: 538.50,
  stock: 7,
  active: true,
  featured: true,
  icon: 'tractor'
}, {
  id: 'p4',
  name: 'Detailing Gloss',
  line: 'Linha Detailing',
  category: 'Shampoo Premium',
  dilution: '1–3%',
  attributes: ['Detailing', 'pH Neutro'],
  price: 298.00,
  stock: 0,
  active: true,
  featured: false,
  icon: 'droplet'
}, {
  id: 'p5',
  name: 'Cutisall+',
  line: 'Linha Animal',
  category: 'Higiene Animal',
  dilution: '2–4%',
  attributes: ['Animal', 'Biodegradável'],
  price: 356.90,
  stock: 18,
  active: false,
  featured: false,
  icon: 'leaf'
}, {
  id: 'p6',
  name: 'Alkaline Degreaser HD',
  line: 'Linha Frotas',
  category: 'Detergente Concentrado',
  dilution: '10–20%',
  attributes: ['Frotas', 'Industrial'],
  price: 467.00,
  stock: 32,
  active: true,
  featured: false,
  icon: 'flask-conical'
}];
window.ADMIN_USERS = [{
  id: 'u1',
  name: 'Marina Albuquerque',
  email: 'marina@provisao.com.br',
  role: 'admin',
  created: '12 jan 2026',
  self: true
}, {
  id: 'u2',
  name: 'Rafael Tavares',
  email: 'rafael@provisao.com.br',
  role: 'admin',
  created: '03 fev 2026',
  self: false
}, {
  id: 'u3',
  name: 'Carla Menezes',
  email: 'carla@provisao.com.br',
  role: 'editor',
  created: '21 fev 2026',
  self: false
}, {
  id: 'u4',
  name: 'Diego Fonseca',
  email: 'diego@provisao.com.br',
  role: 'editor',
  created: '08 mar 2026',
  self: false
}];
window.brl = function (n) {
  return 'R$ ' + Number(n).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/admin-data.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/assets-inline.js
try { (() => {
// Logos embutidos como data URIs — sobrevivem ao bundle standalone (offline).
window.NERTA_LOGO_DARK = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjIwIDY0IiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9Im5lcnRhIj4KICAKICA8cGF0aCBkPSJNMjggMTQmI3hBOyAgICAgICAgICAgQzI4IDE0IDE0IDMwIDE0IDQxJiN4QTsgICAgICAgICAgIGExNCAxNCAwIDAgMCAyOCAwJiN4QTsgICAgICAgICAgIEM0MiAzMCAyOCAxNCAyOCAxNCBaIiBmaWxsPSIjMUU3RkM4Ij48L3BhdGg+CiAgPHBhdGggZD0iTTI0IDQ0IGE2IDYgMCAwIDAgNiA1IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMi40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNiI+PC9wYXRoPgogIAogIDx0ZXh0IHg9IjU2IiB5PSI0NCIgZm9udC1mYW1pbHk9IiYjMzk7UGx1cyBKYWthcnRhIFNhbnMmIzM5OywmIzM5O01vbnRzZXJyYXQmIzM5OyxzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iODAwIiBsZXR0ZXItc3BhY2luZz0iLTAuNSIgZmlsbD0iI0ZGRkZGRiI+bmVydGE8L3RleHQ+Cjwvc3ZnPg==";
window.NERTA_LOGO_PILL = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjIwIDY0IiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9Im5lcnRhIj4KICA8cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMjE4IiBoZWlnaHQ9IjYyIiByeD0iMzEiIGZpbGw9IiMxRTdGQzgiPjwvcmVjdD4KICAKICA8cGF0aCBkPSJNNDAgMTYmI3hBOyAgICAgICAgICAgQzQwIDE2IDI3IDMxIDI3IDQxJiN4QTsgICAgICAgICAgIGExMyAxMyAwIDAgMCAyNiAwJiN4QTsgICAgICAgICAgIEM1MyAzMSA0MCAxNiA0MCAxNiBaIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgPHBhdGggZD0iTTM3IDQ0IGE2IDYgMCAwIDAgNiA1IiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTdGQzgiIHN0cm9rZS13aWR0aD0iMi40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNTUiPjwvcGF0aD4KICAKICA8dGV4dCB4PSI3MCIgeT0iNDIiIGZvbnQtZmFtaWx5PSImIzM5O1BsdXMgSmFrYXJ0YSBTYW5zJiMzOTssJiMzOTtNb250c2VycmF0JiMzOTssc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNCIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9Ii0wLjUiIGZpbGw9IiNGRkZGRkYiPm5lcnRhPC90ZXh0Pgo8L3N2Zz4=";
window.PROVISAO_LOGO = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIwIDY0IiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlByb3Zpc8OjbyBDb23DqXJjaW8gSW50ZXJuYWNpb25hbCI+CiAgPHRleHQgeD0iMCIgeT0iMzAiIGZvbnQtZmFtaWx5PSImIzM5O1BsdXMgSmFrYXJ0YSBTYW5zJiMzOTssJiMzOTtNb250c2VycmF0JiMzOTssc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNiIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9Ii0wLjQiIGZpbGw9IiNDOTk1MUEiPnByb3Zpc8OjbzwvdGV4dD4KICA8dGV4dCB4PSIyIiB5PSI1MCIgZm9udC1mYW1pbHk9IiYjMzk7SW50ZXImIzM5OyxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwLjUiIGZvbnQtd2VpZ2h0PSI2MDAiIGxldHRlci1zcGFjaW5nPSIzIiBmaWxsPSIjOEE5QkIwIj5DT03DiVJDSU8gSU5URVJOQUNJT05BTDwvdGV4dD4KPC9zdmc+";
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/assets-inline.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/responsive.js
try { (() => {
// Shared responsive helper for the storefront screens.
// Breakpoints follow the brand guide: 2-col mobile → 3-col desktop.
window.useIsMobile = function (bp) {
  const limit = bp || 760;
  const get = () => typeof window !== 'undefined' ? window.innerWidth < limit : false;
  const [m, setM] = React.useState(get);
  React.useEffect(() => {
    const on = () => setM(get());
    window.addEventListener('resize', on);
    on();
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/responsive.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/widgets.jsx
try { (() => {
// Nerta Admin — composite widgets: TagInput, FilterSelect, ImageCropper, ImageGallery.
const NAW = window.NertaBrasilDesignSystem_82f464;

// ---- Switch + Modal as window globals (kit-local copies of the DS components,
//      so admin screens render even before the DS bundle recompiles) ----
function UISwitch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  style
}) {
  const w = size === 'sm' ? 36 : 44,
    h = size === 'sm' ? 20 : 24,
    knob = h - 6;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: w,
      height: h,
      flex: 'none',
      borderRadius: 999,
      background: checked ? 'var(--nerta-blue)' : 'var(--navy-light)',
      border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'),
      transition: 'background var(--duration-fast)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? w - knob - 3 : 3,
      width: knob,
      height: knob,
      borderRadius: 999,
      background: '#fff',
      transition: 'left var(--duration-fast)',
      boxShadow: '0 1px 2px rgba(8,19,32,0.5)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--light-gray)'
    }
  }, label));
}
window.Switch = UISwitch;
function UIModal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  hideFooter = false,
  width = 440
}) {
  if (!open) return null;
  const Button = NAW.Button;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'var(--scrim)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: 26
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--muted-text)',
      lineHeight: 1.6
    }
  }, children), !hideFooter && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onClose
  }, cancelLabel), destructive ? /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    onMouseEnter: e => {
      e.currentTarget.style.background = '#E0573F';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = '#D64C39';
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
      padding: '0 16px',
      background: '#D64C39',
      color: '#fff',
      border: '1px solid transparent',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      cursor: 'pointer'
    }
  }, confirmLabel) : /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: onConfirm
  }, confirmLabel))));
}
window.Modal = UIModal;

// ---- FieldLabel ----
function FieldLabel({
  children,
  hint
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--light-gray)',
      marginBottom: 7
    }
  }, children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted-text)',
      fontWeight: 400
    }
  }, " \xB7 ", hint));
}
window.FieldLabel = FieldLabel;

// ---- TagInput: type + Enter to add pills, click × to remove ----
function TagInput({
  tags = [],
  onChange,
  placeholder = 'Digite e pressione Enter'
}) {
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
      minHeight: 44,
      padding: '7px 10px',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 26,
      padding: '0 6px 0 11px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--teal)',
      background: 'rgba(29,184,126,0.1)',
      border: '1px solid rgba(29,184,126,0.4)'
    }
  }, t, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(tags.filter(x => x !== t)),
    style: {
      display: 'inline-flex',
      background: 'none',
      border: 'none',
      color: 'var(--teal)',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 12,
      height: 12
    }
  })))), /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        add();
      }
      if (e.key === 'Backspace' && !draft && tags.length) onChange(tags.slice(0, -1));
    },
    placeholder: tags.length ? '' : placeholder,
    style: {
      flex: 1,
      minWidth: 120,
      height: 28,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 13
    }
  }));
}
window.TagInput = TagInput;

// ---- FilterSelect: compact pill-style dropdown for table filters ----
function FilterSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      height: 42,
      padding: '0 34px 0 14px',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      color: value === '__all' ? 'var(--muted-text)' : 'var(--white)',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "__all",
    style: {
      background: '#112644'
    }
  }, label, ": todos"), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o,
    style: {
      background: '#112644'
    }
  }, o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--muted-text)',
      fontSize: 10
    }
  }, "\u25BE"));
}
window.FilterSelect = FilterSelect;

// ---- ImageCropper: 1:1 crop interface (drag a zoomable frame, confirm) ----
function ImageCropper({
  onConfirm,
  onCancel
}) {
  const [zoom, setZoom] = React.useState(1.2);
  const [pos, setPos] = React.useState({
    x: 0,
    y: 0
  });
  const drag = React.useRef(null);
  const onDown = e => {
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: pos.x,
      oy: pos.y
    };
  };
  const onMove = e => {
    if (!drag.current) return;
    setPos({
      x: drag.current.ox + (e.clientX - drag.current.sx),
      y: drag.current.oy + (e.clientY - drag.current.sy)
    });
  };
  const onUp = () => {
    drag.current = null;
  };
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FieldLabel, {
    hint: "arraste para posicionar \xB7 ajuste o zoom"
  }, "Recorte 1:1"), /*#__PURE__*/React.createElement("div", {
    onMouseMove: onMove,
    onMouseUp: onUp,
    onMouseLeave: onUp,
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 300,
      aspectRatio: '1 / 1',
      margin: '0 auto',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)',
      border: '1px solid var(--border-subtle)',
      cursor: 'grab'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onMouseDown: onDown,
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
      color: 'var(--navy-border)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 90,
      height: 90
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      boxShadow: 'inset 0 0 0 2px rgba(91,184,245,0.7)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      fontSize: 9.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--sky-blue)',
      pointerEvents: 'none'
    }
  }, "1 : 1")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '16px auto 0',
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "zoom-out",
    style: {
      width: 16,
      height: 16,
      color: 'var(--muted-text)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "3",
    step: "0.05",
    value: zoom,
    onChange: e => setZoom(parseFloat(e.target.value)),
    style: {
      flex: 1,
      accentColor: '#1E7FC8'
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "zoom-in",
    style: {
      width: 16,
      height: 16,
      color: 'var(--muted-text)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(NAW.Button, {
    variant: "secondary",
    size: "sm",
    onClick: onCancel
  }, "Cancelar"), /*#__PURE__*/React.createElement(NAW.Button, {
    variant: "primary",
    size: "sm",
    onClick: onConfirm
  }, "Confirmar recorte")));
}
window.ImageCropper = ImageCropper;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/widgets.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/AboutPage.jsx
try { (() => {
// About page — "Sobre Nós". História belga, tecnologia, parceria Provisão.
const NAB = window.NertaBrasilDesignSystem_82f464;

// Reusable image placeholder (Nerta photography slots in here later).
function ImageSlot({
  label,
  ratio = '4 / 3',
  icon = 'image'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: ratio,
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      background: 'radial-gradient(120% 100% at 50% 20%, #163258 0%, #0D1B2E 72%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      color: 'var(--navy-border)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 40,
      height: 40
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, label));
}
function AboutPage({
  onNav
}) {
  const {
    Button,
    Badge,
    KpiStat,
    AccentBlock
  } = NAB;
  const mob = window.useIsMobile();
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const pillars = [{
    n: '01',
    t: 'Origem belga',
    icon: 'flask-conical',
    d: 'Mais de 50 anos formulando química automotiva em laboratórios na Bélgica. Fórmulas próprias, nano-moleculares, desenvolvidas para o ambiente industrial mais exigente.'
  }, {
    n: '02',
    t: 'Líder global',
    icon: 'globe',
    d: 'Presente em mais de 60 países, com certificações ISO 9001 e 14001. Referência mundial em Car & Truckwash, agora chegando ao Brasil com importação oficial.'
  }, {
    n: '03',
    t: 'Distribuição exclusiva',
    icon: 'handshake',
    d: 'A Provisão Comércio Internacional é a distribuidora oficial exclusiva no Brasil — estoque nacional, suporte técnico e atendimento B2B especializado.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-gradient)',
      padding: mob ? '52px 20px 56px' : '88px 40px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 0.06,
      background: 'radial-gradient(55% 110% at 82% 8%, #5BB8F5 0, transparent 55%), radial-gradient(50% 90% at 6% 94%, #1DB87E 0, transparent 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, "Nerta Belgium \xD7 Provis\xE3o \xB7 Brasil 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: mob ? 32 : 50,
      lineHeight: 1.06,
      margin: '20px 0 0',
      maxWidth: 760
    }
  }, "Qu\xEDmica de ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sky-blue)'
    }
  }, "laborat\xF3rio"), ", n\xE3o de prateleira."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.65,
      color: 'var(--muted-text)',
      margin: '22px 0 0',
      maxWidth: 600
    }
  }, "A Nerta \xE9 uma marca belga l\xEDder global em limpeza qu\xEDmica para Car & Truckwash. Cada produto nasce de pesquisa de laborat\xF3rio e chega ao Brasil pela distribui\xE7\xE3o exclusiva da Provis\xE3o Com\xE9rcio Internacional."))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '48px 20px' : '72px 40px',
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: mob ? 28 : 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ImageSlot, {
    label: "Laborat\xF3rio / planta Nerta",
    icon: "microscope",
    ratio: "4 / 3"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--sky-blue)',
      marginBottom: 12
    }
  }, "Quem somos"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      marginBottom: 18
    }
  }, "Tecnologia europeia para um mercado que merece mais"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.65,
      color: 'var(--muted-text)',
      maxWidth: 480,
      marginBottom: 20
    }
  }, "Enquanto boa parte do mercado nacional trabalha com solu\xE7\xF5es dilu\xEDdas de f\xE1brica, a Nerta entrega detergentes superconcentrados \u2014 voc\xEA dilui de 3 a 20% e reduz o custo real por lavagem muito abaixo dos concorrentes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "blue",
    title: "Performance comprovada"
  }, "Touchless real, a\xE7\xE3o alcalina de alto desempenho para frotas, agro e detailing."), /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "teal",
    title: "Compromisso t\xE9cnico"
  }, "Cada afirma\xE7\xE3o acompanhada de dado: dilui\xE7\xE3o, custo/lavagem e certifica\xE7\xE3o.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '44px 20px' : '56px 40px',
      display: 'flex',
      gap: mob ? '28px 40px' : 56,
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(KpiStat, {
    value: "50+",
    label: "anos de tecnologia belga",
    tone: "teal"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "60+",
    label: "pa\xEDses atendidos",
    tone: "blue"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "ISO",
    label: "9001 \xB7 14001 certificada",
    tone: "teal"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "1",
    label: "distribuidor exclusivo no Brasil",
    tone: "blue"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '48px 20px' : '72px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--provisao-gold)',
      marginBottom: 10
    }
  }, "A marca"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      marginBottom: 36
    }
  }, "Tr\xEAs pilares de credibilidade"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
      gap: 24
    }
  }, pillars.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 44,
      lineHeight: 1,
      color: 'var(--sky-blue)',
      letterSpacing: '-0.02em'
    }
  }, p.n), /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon,
    style: {
      width: 26,
      height: 26,
      color: 'var(--teal)'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      marginBottom: 10
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13.5,
      lineHeight: 1.6,
      color: 'var(--muted-text)'
    }
  }, p.d))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '0 20px 48px' : '0 40px 72px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '2fr 1fr',
      gap: mob ? 14 : 22
    }
  }, /*#__PURE__*/React.createElement(ImageSlot, {
    label: "Frota / aplica\xE7\xE3o em campo",
    icon: "truck",
    ratio: "16 / 9"
  }), /*#__PURE__*/React.createElement(ImageSlot, {
    label: "Espuma ativa em a\xE7\xE3o",
    icon: "droplet",
    ratio: "16 / 9"
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '48px 20px' : '64px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      marginBottom: 14
    }
  }, "Uma parceria de marca e distribui\xE7\xE3o"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--muted-text)'
    }
  }, "A tecnologia \xE9 da Nerta Belgium. A opera\xE7\xE3o, o estoque e o atendimento no Brasil s\xE3o da Provis\xE3o Com\xE9rcio Internacional. Duas marcas, sempre identificadas e separadas."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => onNav('catalog')
  }, "Conhecer o cat\xE1logo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.NERTA_LOGO_DARK,
    alt: "nerta",
    height: "38"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 44,
      background: 'var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: window.PROVISAO_LOGO,
    alt: "Provis\xE3o Com\xE9rcio Internacional",
    height: "42"
  })))));
}
window.AboutPage = AboutPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/AboutPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/CatalogPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Catalog page — line filters + responsive product grid.
const NCP = window.NertaBrasilDesignSystem_82f464;
function CatalogPage({
  onOpenProduct
}) {
  const {
    ProductCard
  } = NCP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS.filter(p => p.active);
  const lines = window.NERTA_LINES;
  const [line, setLine] = React.useState('Todas');
  const shown = line === 'Todas' ? products : products.filter(p => p.attributes.includes(line) || p.line.includes(line));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '40px 20px 64px' : '56px 40px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--sky-blue)',
      marginBottom: 10
    }
  }, "Cat\xE1logo \xB7 Brasil 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: mob ? 28 : 34,
      marginBottom: 8
    }
  }, "Detergentes concentrados"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--muted-text)',
      maxWidth: 540,
      marginBottom: 30
    }
  }, "Bombonas de 25L para frotas, agro e detailing. Checkout direto no Mercado Livre."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 32,
      flexWrap: 'wrap'
    }
  }, lines.map(l => {
    const on = l === line;
    return /*#__PURE__*/React.createElement("button", {
      key: l,
      onClick: () => setLine(l),
      style: {
        height: 34,
        padding: '0 16px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.02em',
        background: on ? 'var(--nerta-blue)' : 'transparent',
        color: on ? '#fff' : 'var(--muted-text)',
        border: on ? '1px solid transparent' : '1px solid var(--border-subtle)',
        transition: 'all var(--duration-fast)'
      }
    }, l);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: mob ? 12 : 22
    }
  }, shown.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.slug
  }, p, {
    onBuy: () => {},
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpenProduct(p.slug)
  })))));
}
window.CatalogPage = CatalogPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/CatalogPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Footer.jsx
try { (() => {
// Site footer — Nerta + Provisão logos visually SEPARATED (brand rule).
function Footer() {
  const mob = window.useIsMobile();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)',
      padding: mob ? '36px 20px 28px' : '44px 40px 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.NERTA_LOGO_DARK,
    alt: "nerta",
    height: "32"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontSize: 12.5,
      lineHeight: 1.6,
      color: 'var(--muted-text)'
    }
  }, "Tecnologia qu\xEDmica europeia de alta performance para frotas, agro e detailing. Marca belga l\xEDder global em Car & Truckwash.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 56,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--muted-text)',
      marginBottom: 12
    }
  }, "Produtos"), ['Linha Frotas', 'Linha Agro', 'Linha Detailing', 'Linha Animal'].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      fontSize: 13,
      color: 'var(--light-gray)',
      marginBottom: 8
    }
  }, t))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--muted-text)',
      marginBottom: 12
    }
  }, "Distribui\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--light-gray)',
      marginBottom: 8
    }
  }, "Atendimento B2B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--light-gray)',
      marginBottom: 8
    }
  }, "Material de revenda"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--light-gray)',
      marginBottom: 8
    }
  }, "WhatsApp comercial")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '36px auto 0',
      paddingTop: 24,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--muted-text)'
    }
  }, "\xA9 2026 Nerta \xB7 Produzido na B\xE9lgica \xB7 B\xE9lgica \u2192 Portugal \u2192 Brasil"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--muted-text)'
    }
  }, "Distribui\xE7\xE3o exclusiva"), /*#__PURE__*/React.createElement("img", {
    src: window.PROVISAO_LOGO,
    alt: "Provis\xE3o Com\xE9rcio Internacional",
    height: "34"
  }))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Header.jsx
try { (() => {
// Site header — sticky navy bar with logo + nav. (window-scoped babel module)
const {
  Button: NHButton
} = window.NertaBrasilDesignSystem_82f464;
function Header({
  current,
  onNav
}) {
  const mob = window.useIsMobile();
  const links = [{
    id: 'home',
    label: 'Início'
  }, {
    id: 'catalog',
    label: 'Catálogo'
  }, {
    id: 'about',
    label: 'Sobre'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: mob ? '12px 18px' : '14px 40px',
      background: 'rgba(13, 27, 46, 0.82)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.NERTA_LOGO_DARK,
    alt: "nerta",
    height: mob ? 28 : 34,
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNav('home')
  }), !mob && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--provisao-gold)',
      paddingLeft: 16,
      borderLeft: '1px solid var(--border-subtle)'
    }
  }, "Distribuidor Oficial Provis\xE3o")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: mob ? 16 : 32
    }
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    onClick: () => onNav(l.id),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: mob ? 13 : 13.5,
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: current === l.id ? 'var(--white)' : 'var(--muted-text)',
      padding: '6px 0',
      borderBottom: current === l.id ? '2px solid var(--nerta-blue)' : '2px solid transparent',
      transition: 'color var(--duration-fast)'
    }
  }, l.label)), !mob && /*#__PURE__*/React.createElement(NHButton, {
    size: "sm",
    variant: "secondary",
    onClick: () => onNav('catalog')
  }, "Ver produtos")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/LandingPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Landing page — hero, KPIs, featured carousel, tech section.
const NLP = window.NertaBrasilDesignSystem_82f464;
function LandingPage({
  onNav,
  onOpenProduct
}) {
  const {
    Button,
    Badge,
    KpiStat,
    ProductCard,
    AccentBlock
  } = NLP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS;
  const featured = products.filter(p => p.featured && p.active);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-gradient)',
      padding: mob ? '52px 20px 60px' : '92px 40px 104px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      opacity: 0.06,
      background: 'radial-gradient(60% 120% at 78% 10%, #5BB8F5 0%, transparent 55%), radial-gradient(50% 100% at 10% 90%, #1DB87E 0%, transparent 55%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "gold"
  }, "Lan\xE7amento Nacional \xB7 Brasil 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: mob ? 32 : 54,
      lineHeight: 1.06,
      margin: '22px 0 0',
      maxWidth: 700
    }
  }, "Tecnologia qu\xEDmica ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--sky-blue)'
    }
  }, "europeia"), " de alta performance."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: 'var(--muted-text)',
      margin: '22px 0 0',
      maxWidth: 560
    }
  }, "Para um mercado que ainda utiliza solu\xE7\xF5es inferiores. Detergentes concentrados para frotas, agro e detailing \u2014 o menor custo real por lavagem do mercado."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 34,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: mob ? 'md' : 'lg',
    onClick: () => onNav('catalog')
  }, "Explorar cat\xE1logo"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: mob ? 'md' : 'lg',
    onClick: () => onNav('about')
  }, "A tecnologia"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: mob ? '28px 40px' : 56,
      marginTop: mob ? 48 : 72,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(KpiStat, {
    value: "50+",
    label: "anos de tecnologia belga",
    tone: "teal"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "60+",
    label: "pa\xEDses atendidos",
    tone: "blue"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "3\u20135%",
    label: "dilui\xE7\xE3o superconcentrada",
    tone: "teal"
  }), /*#__PURE__*/React.createElement(KpiStat, {
    value: "ISO",
    label: "9001 \xB7 14001 certificada",
    tone: "blue"
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: mob ? '48px 20px' : '72px 40px',
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--sky-blue)',
      marginBottom: 10
    }
  }, "Produtos em destaque"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30
    }
  }, "Linha premium 2026")), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => onNav('catalog')
  }, "Ver tudo \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
      gap: 22
    }
  }, featured.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.slug
  }, p, {
    onBuy: () => {},
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpenProduct(p.slug)
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-sunken)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '48px 20px' : '72px 40px',
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: mob ? 28 : 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--provisao-gold)',
      marginBottom: 12
    }
  }, "Por que Nerta"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      marginBottom: 18
    }
  }, "Qu\xEDmica de laborat\xF3rio, n\xE3o de prateleira"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--muted-text)',
      maxWidth: 460
    }
  }, "F\xF3rmulas nano-moleculares desenvolvidas em laborat\xF3rios belgas. Cada produto \xE9 superconcentrado \u2014 voc\xEA dilui de 3 a 20%, reduzindo o custo real por lavagem muito abaixo das solu\xE7\xF5es nacionais.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "blue",
    title: "Alta performance alcalina"
  }, "Dissolve incrusta\xE7\xF5es severas de frotas e m\xE1quinas agr\xEDcolas sem esfrega\xE7\xE3o."), /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "teal",
    title: "Tecnologia touchless real"
  }, "Preserva pinturas modernas e pel\xEDculas, eliminando riscos mec\xE2nicos."), /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "gold",
    title: "Distribui\xE7\xE3o exclusiva Provis\xE3o"
  }, "Importa\xE7\xE3o oficial, estoque nacional e suporte t\xE9cnico especializado.")))));
}
window.LandingPage = LandingPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/LandingPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/ProductPage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Product detail page — image, dilution highlight, dilution table, ML CTA.
const NPP = window.NertaBrasilDesignSystem_82f464;
function ProductPage({
  slug,
  onNav,
  onOpenProduct
}) {
  const {
    Button,
    Badge,
    AccentBlock
  } = NPP;
  const mob = window.useIsMobile();
  const products = window.NERTA_PRODUCTS;
  const p = products.find(x => x.slug === slug) || products[0];
  const outOfStock = p.stock === 0;
  const related = products.filter(x => x.slug !== p.slug && x.active).slice(0, 3);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
  const dilutionRows = [{
    use: 'Sujeira leve · manutenção diária',
    ratio: '1:30',
    pct: '3%'
  }, {
    use: 'Frotas e carrocerias',
    ratio: '1:20',
    pct: '5%'
  }, {
    use: 'Incrustação severa · agro',
    ratio: '1:10',
    pct: '10%'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: mob ? '24px 20px 64px' : '32px 40px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      fontSize: 11,
      color: 'var(--muted-text)',
      marginBottom: 28,
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('home'),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--muted-text)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "In\xEDcio"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('catalog'),
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--muted-text)',
      cursor: 'pointer',
      fontSize: 11
    }
  }, "Cat\xE1logo"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--light-gray)'
    }
  }, p.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
      gap: mob ? 28 : 52
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      background: 'radial-gradient(120% 90% at 50% 26%, #163258 0%, #0D1B2E 70%)',
      minHeight: mob ? 280 : 460,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 18,
      left: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "blue"
  }, p.line)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      color: 'var(--navy-border)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon,
    style: {
      width: 64,
      height: 64
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, "Bombona 25L \xB7 foto do produto"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: mob ? 28 : 36,
      lineHeight: 1.08
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--provisao-gold)',
      marginTop: 6
    }
  }, p.category), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      margin: '20px 0'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "blue",
    solid: true
  }, `Diluição ${p.dilution}`), p.attributes.map(a => /*#__PURE__*/React.createElement(Badge, {
    key: a,
    tone: "teal"
  }, a))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14.5,
      lineHeight: 1.65,
      color: 'var(--muted-text)',
      maxWidth: 480
    }
  }, p.description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 16px',
      background: 'var(--surface-raised)',
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--light-gray)'
    }
  }, "Tabela de dilui\xE7\xE3o"), dilutionRows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--light-gray)'
    }
  }, r.use), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--muted-text)'
    }
  }, r.ratio), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--sky-blue)',
      minWidth: 36,
      textAlign: 'right'
    }
  }, r.pct))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(AccentBlock, {
    accent: "teal",
    title: "O menor custo real por lavagem"
  }, "Superconcentrado: 1 bombona de 25L rende muito mais que detergentes nacionais dilu\xEDdos de f\xE1brica.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, outOfStock ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    disabled: true,
    disabledLabel: "Produto Indispon\xEDvel"
  }) : /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    href: p.mlUrl,
    external: true,
    onClick: () => {},
    rightIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "external-link",
      style: {
        width: 17,
        height: 17
      }
    })
  }, "Comprar no Mercado Livre"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--muted-text)',
      textAlign: 'center',
      marginTop: 12
    }
  }, outOfStock ? 'Reposição em breve — fale com a Provisão.' : 'Checkout 100% seguro via Mercado Livre · abre em nova aba')))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: mob ? 52 : 72
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      marginBottom: 22
    }
  }, "Outros produtos da linha"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: mob ? 12 : 22
    }
  }, related.map(r => /*#__PURE__*/React.createElement(NPP.ProductCard, _extends({
    key: r.slug
  }, r, {
    onBuy: () => {},
    style: {
      cursor: 'pointer'
    },
    onClick: () => onOpenProduct(r.slug)
  }))))));
}
window.ProductPage = ProductPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/ProductPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/assets-inline.js
try { (() => {
// Logos embutidos como data URIs — sobrevivem ao bundle standalone (offline).
window.NERTA_LOGO_DARK = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjIwIDY0IiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9Im5lcnRhIj4KICAKICA8cGF0aCBkPSJNMjggMTQmI3hBOyAgICAgICAgICAgQzI4IDE0IDE0IDMwIDE0IDQxJiN4QTsgICAgICAgICAgIGExNCAxNCAwIDAgMCAyOCAwJiN4QTsgICAgICAgICAgIEM0MiAzMCAyOCAxNCAyOCAxNCBaIiBmaWxsPSIjMUU3RkM4Ij48L3BhdGg+CiAgPHBhdGggZD0iTTI0IDQ0IGE2IDYgMCAwIDAgNiA1IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMi40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNiI+PC9wYXRoPgogIAogIDx0ZXh0IHg9IjU2IiB5PSI0NCIgZm9udC1mYW1pbHk9IiYjMzk7UGx1cyBKYWthcnRhIFNhbnMmIzM5OywmIzM5O01vbnRzZXJyYXQmIzM5OyxzYW5zLXNlcmlmIiBmb250LXNpemU9IjM2IiBmb250LXdlaWdodD0iODAwIiBsZXR0ZXItc3BhY2luZz0iLTAuNSIgZmlsbD0iI0ZGRkZGRiI+bmVydGE8L3RleHQ+Cjwvc3ZnPg==";
window.NERTA_LOGO_PILL = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjIwIDY0IiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9Im5lcnRhIj4KICA8cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMjE4IiBoZWlnaHQ9IjYyIiByeD0iMzEiIGZpbGw9IiMxRTdGQzgiPjwvcmVjdD4KICAKICA8cGF0aCBkPSJNNDAgMTYmI3hBOyAgICAgICAgICAgQzQwIDE2IDI3IDMxIDI3IDQxJiN4QTsgICAgICAgICAgIGExMyAxMyAwIDAgMCAyNiAwJiN4QTsgICAgICAgICAgIEM1MyAzMSA0MCAxNiA0MCAxNiBaIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgPHBhdGggZD0iTTM3IDQ0IGE2IDYgMCAwIDAgNiA1IiBmaWxsPSJub25lIiBzdHJva2U9IiMxRTdGQzgiIHN0cm9rZS13aWR0aD0iMi40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNTUiPjwvcGF0aD4KICAKICA8dGV4dCB4PSI3MCIgeT0iNDIiIGZvbnQtZmFtaWx5PSImIzM5O1BsdXMgSmFrYXJ0YSBTYW5zJiMzOTssJiMzOTtNb250c2VycmF0JiMzOTssc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNCIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9Ii0wLjUiIGZpbGw9IiNGRkZGRkYiPm5lcnRhPC90ZXh0Pgo8L3N2Zz4=";
window.PROVISAO_LOGO = "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIwIDY0IiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjY0IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlByb3Zpc8OjbyBDb23DqXJjaW8gSW50ZXJuYWNpb25hbCI+CiAgPHRleHQgeD0iMCIgeT0iMzAiIGZvbnQtZmFtaWx5PSImIzM5O1BsdXMgSmFrYXJ0YSBTYW5zJiMzOTssJiMzOTtNb250c2VycmF0JiMzOTssc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNiIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9Ii0wLjQiIGZpbGw9IiNDOTk1MUEiPnByb3Zpc8OjbzwvdGV4dD4KICA8dGV4dCB4PSIyIiB5PSI1MCIgZm9udC1mYW1pbHk9IiYjMzk7SW50ZXImIzM5OyxzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwLjUiIGZvbnQtd2VpZ2h0PSI2MDAiIGxldHRlci1zcGFjaW5nPSIzIiBmaWxsPSIjOEE5QkIwIj5DT03DiVJDSU8gSU5URVJOQUNJT05BTDwvdGV4dD4KPC9zdmc+";
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/assets-inline.js", error: String((e && e.message) || e) }); }

// ui_kits/site/data.js
try { (() => {
// Nerta Brasil — sample catalog data for the UI kit (fictional but on-brand).
// Checkout is 100% Mercado Livre; mlUrl would be the real listing.
window.NERTA_PRODUCTS = [{
  slug: 'active-diamond-foam',
  line: 'Tecnologia Alcalina',
  name: 'Active Diamond Foam',
  category: 'Detergente Espuma Ativa',
  dilution: '3–5%',
  attributes: ['Touchless', 'Agro'],
  short: 'Espuma ativa superconcentrada para frotas, tratores e máquinas agrícolas.',
  description: 'Formulação alcalina superconcentrada que dissolve sujeiras severas sem necessidade de esfregação. Tecnologia touchless real que preserva o brilho de pinturas modernas e películas.',
  stock: 1,
  featured: true,
  active: true,
  icon: 'sparkles',
  mlUrl: '#'
}, {
  slug: 'truck-wash-pro',
  line: 'Linha Frotas',
  name: 'Truck Wash Pro',
  category: 'Detergente Concentrado',
  dilution: '5–10%',
  attributes: ['pH Neutro', 'Frotas'],
  short: 'Limpeza de frotas e carrocerias com brilho residual e baixo custo por lavagem.',
  description: 'Detergente concentrado de pH equilibrado para lavagem diária de frotas. Remove fuligem, óleo e poeira de estrada sem agredir adesivos e pinturas.',
  stock: 1,
  featured: true,
  active: true,
  icon: 'truck',
  mlUrl: '#'
}, {
  slug: 'agro-power-25',
  line: 'Linha Agro',
  name: 'Agro Power 25',
  category: 'Desincrustante Agrícola',
  dilution: '8–12%',
  attributes: ['Agro', 'Alta Performance'],
  short: 'Desincrustante para colheitadeiras, pulverizadores e implementos pesados.',
  description: 'Remove incrustações severas de barro, calda e resíduos vegetais de máquinas agrícolas. Ação alcalina de alto desempenho para o ambiente mais exigente do campo.',
  stock: 1,
  featured: true,
  active: true,
  icon: 'tractor',
  mlUrl: '#'
}, {
  slug: 'detailing-gloss',
  line: 'Linha Detailing',
  name: 'Detailing Gloss',
  category: 'Shampoo Premium',
  dilution: '1–3%',
  attributes: ['Detailing', 'pH Neutro'],
  short: 'Shampoo de detailing premium com brilho profundo e proteção de superfície.',
  description: 'Shampoo de pH neutro para detailing profissional. Realça a profundidade da cor e adiciona uma camada hidrofóbica que facilita a próxima lavagem.',
  stock: 0,
  featured: false,
  active: true,
  icon: 'droplet',
  mlUrl: '#'
}, {
  slug: 'cutisall-plus',
  line: 'Linha Animal',
  name: 'Cutisall+',
  category: 'Higiene Animal',
  dilution: '2–4%',
  attributes: ['Animal', 'Biodegradável'],
  short: 'Higienização de baias, transporte animal e ambientes de confinamento.',
  description: 'Solução de higienização para o agronegócio animal. Limpa e desodoriza baias e veículos de transporte com formulação biodegradável de baixo impacto.',
  stock: 1,
  featured: false,
  active: true,
  icon: 'leaf',
  mlUrl: '#'
}, {
  slug: 'alkaline-degreaser',
  line: 'Linha Frotas',
  name: 'Alkaline Degreaser HD',
  category: 'Desengraxante Industrial',
  dilution: '10–20%',
  attributes: ['Frotas', 'Industrial'],
  short: 'Desengraxante industrial para motores, chassis e piso de oficina.',
  description: 'Desengraxante alcalino de alta concentração para remoção de graxa pesada em motores, chassis e pisos industriais. Enxágue rápido, sem película.',
  stock: 1,
  featured: false,
  active: true,
  icon: 'flask-conical',
  mlUrl: '#'
}];
window.NERTA_LINES = ['Todas', 'Frotas', 'Agro', 'Detailing', 'Animal'];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/data.js", error: String((e && e.message) || e) }); }

// ui_kits/site/responsive.js
try { (() => {
// Shared responsive helper for the storefront screens.
// Breakpoints follow the brand guide: 2-col mobile → 3-col desktop.
window.useIsMobile = function (bp) {
  const limit = bp || 760;
  const get = () => typeof window !== 'undefined' ? window.innerWidth < limit : false;
  const [m, setM] = React.useState(get);
  React.useEffect(() => {
    const on = () => setM(get());
    window.addEventListener('resize', on);
    on();
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/responsive.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.AccentBlock = __ds_scope.AccentBlock;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.KpiStat = __ds_scope.KpiStat;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
