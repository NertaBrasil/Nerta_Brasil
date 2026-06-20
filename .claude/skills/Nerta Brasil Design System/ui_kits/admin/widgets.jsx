// Nerta Admin — composite widgets: TagInput, FilterSelect, ImageCropper, Switch, Modal, Spinner.
const NAW = window.NertaBrasilDesignSystem_82f464;

// Inject spinner keyframe once
(function () {
  if (!document.getElementById('nerta-widgets-kf')) {
    var s = document.createElement('style');
    s.id = 'nerta-widgets-kf';
    s.textContent = '@keyframes nerta-spin { to { transform: rotate(360deg); } } @keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }';
    document.head.appendChild(s);
  }
})();

// ---- Spinner ----
function Spinner({ size = 20, color = 'var(--sky-blue)' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flex: 'none' }}>
      <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size, animation: 'nerta-spin 0.75s linear infinite' }}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" strokeOpacity="0.22" />
        <path d="M12 3 a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
window.Spinner = Spinner;

// ---- NetworkError banner (dismissable) ----
function NetworkError({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div role="alert" style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', marginBottom: 20,
      background: 'rgba(229,99,77,0.1)', border: '1px solid rgba(229,99,77,0.4)', borderRadius: 'var(--radius-md)',
      color: '#E5634D', fontSize: 13, lineHeight: 1.4,
    }}>
      <i data-lucide="alert-circle" style={{ width: 18, height: 18, flex: 'none' }}></i>
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Fechar" style={{ background: 'none', border: 'none', color: '#E5634D', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
          <i data-lucide="x" style={{ width: 15, height: 15 }}></i>
        </button>
      )}
    </div>
  );
}
window.NetworkError = NetworkError;

// ---- LoadingSkeleton: linha(s) animadas para estado de carregamento inicial ----
function LoadingSkeleton({ rows = 5, type = 'table' }) {
  const pulse = { animation: 'skeleton-pulse 1.6s ease infinite', borderRadius: 4, background: 'var(--surface-raised)' };
  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 46, height: 46, flex: 'none', borderRadius: 'var(--radius-sm)', ...pulse }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 13, width: '60%', ...pulse }} />
              <div style={{ height: 10, width: '40%', ...pulse, opacity: 0.5 }} />
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 999, ...pulse }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', background: i % 2 ? 'var(--surface-card)' : 'var(--navy-light)', borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
          <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-sm)', ...pulse }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 13, width: (40 + i * 7) + '%', ...pulse }} />
            <div style={{ height: 10, width: (20 + i * 3) + '%', ...pulse, opacity: 0.6 }} />
          </div>
          <div style={{ height: 22, width: 58, borderRadius: 999, ...pulse }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(j => <div key={j} style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', ...pulse }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
window.LoadingSkeleton = LoadingSkeleton;

// ---- DemoBar: controles de estado para prototipação ----
function DemoBar({ actions }) {
  return (
    <div role="toolbar" aria-label="Controles de demo" style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', marginBottom: 18,
      background: 'rgba(29,184,126,0.05)', border: '1px dashed rgba(29,184,126,0.22)',
      borderRadius: 'var(--radius-md)', flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--teal)', opacity: 0.7, flex: 'none' }}>Demo</span>
      <div style={{ width: 1, height: 14, background: 'var(--border-subtle)', flex: 'none' }} />
      {actions.map((a, i) => (
        <button key={i} onClick={a.action}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 10px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', color: 'var(--muted-text)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11, whiteSpace: 'nowrap' }}>
          {a.label}
        </button>
      ))}
    </div>
  );
}
window.DemoBar = DemoBar;

// ---- Switch + Modal as window globals ----
function UISwitch({ checked = false, onChange, disabled = false, size = 'md', label, style }) {
  const w = size === 'sm' ? 36 : 44, h = size === 'sm' ? 20 : 24, knob = h - 6;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, userSelect: 'none', ...style }}>
      <span role="switch" aria-checked={checked} tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange && onChange(!checked)}
        onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !disabled) { e.preventDefault(); onChange && onChange(!checked); } }}
        style={{ position: 'relative', width: w, height: h, flex: 'none', borderRadius: 999, background: checked ? 'var(--nerta-blue)' : 'var(--navy-light)', border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'), transition: 'background var(--duration-fast)', outline: 'none' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? w - knob - 3 : 3, width: knob, height: knob, borderRadius: 999, background: '#fff', transition: 'left var(--duration-fast)', boxShadow: '0 1px 2px rgba(8,19,32,0.5)' }} />
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--light-gray)' }}>{label}</span>}
    </label>
  );
}
window.Switch = UISwitch;

function UIModal({ open, title, children, onClose, onConfirm, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', destructive = false, hideFooter = false, width = 440 }) {
  if (!open) return null;
  const Button = NAW.Button;
  const dialogRef = React.useRef(null);

  // Focus trap + ESC
  React.useEffect(() => {
    if (!open) return;
    const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    // Defer so modal content is painted before we query
    const t = setTimeout(() => {
      const el = dialogRef.current;
      if (!el) return;
      const els = Array.from(el.querySelectorAll(FOCUSABLE));
      if (els.length) els[0].focus();
    }, 60);

    const onKey = (e) => {
      if (e.key === 'Escape') { if (onClose) onClose(); return; }
      if (e.key !== 'Tab') return;
      const el = dialogRef.current;
      if (!el) return;
      const els = Array.from(el.querySelectorAll(FOCUSABLE));
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label={title || 'Diálogo'}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,13,24,0.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div ref={dialogRef} onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: width, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: 26 }}>
        {title && <h3 style={{ fontSize: 20, marginBottom: 12 }}>{title}</h3>}
        <div style={{ fontSize: 13.5, color: 'var(--muted-text)', lineHeight: 1.6 }}>{children}</div>
        {!hideFooter && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26 }}>
            <Button variant="secondary" size="sm" onClick={onClose}>{cancelLabel}</Button>
            {destructive ? (
              <button onClick={onConfirm}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E0573F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#D64C39'; }}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 36, padding: '0 16px', background: '#D64C39', color: '#fff', border: '1px solid transparent', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer' }}>
                {confirmLabel}
              </button>
            ) : (
              <Button variant="primary" size="sm" onClick={onConfirm}>{confirmLabel}</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
window.Modal = UIModal;

// ---- FieldLabel ----
function FieldLabel({ children, hint }) {
  return (
    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--light-gray)', marginBottom: 7 }}>
      {children}{hint && <span style={{ color: 'var(--muted-text)', fontWeight: 400 }}> · {hint}</span>}
    </label>
  );
}
window.FieldLabel = FieldLabel;

// ---- TagInput: type + Enter to add pills, click × to remove ----
function TagInput({ tags = [], onChange, placeholder = 'Digite e pressione Enter' }) {
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft('');
  };
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', minHeight: 44, padding: '7px 10px',
      background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
    }}>
      {tags.map((t) => (
        <span key={t} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 6px 0 11px',
          borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--teal)', background: 'rgba(29,184,126,0.1)', border: '1px solid rgba(29,184,126,0.4)',
        }}>
          {t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={"Remover " + t}
            style={{ display: 'inline-flex', background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', padding: 2 }}>
            <i data-lucide="x" style={{ width: 12, height: 12 }}></i>
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } if (e.key === 'Backspace' && !draft && tags.length) onChange(tags.slice(0, -1)); }}
        placeholder={tags.length ? '' : placeholder}
        style={{ flex: 1, minWidth: 120, height: 28, background: 'transparent', border: 'none', outline: 'none', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 13 }}
      />
    </div>
  );
}
window.TagInput = TagInput;

// ---- FilterSelect: compact pill-style dropdown for table filters ----
// options: string[] | {value, label}[]
function FilterSelect({ label, value, options, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        appearance: 'none', WebkitAppearance: 'none', height: 42, padding: '0 34px 0 14px',
        background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        color: value === '__all' ? 'var(--muted-text)' : 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer',
      }}>
        <option value="__all" style={{ background: '#112644' }}>{label}: todos</option>
        {options.map((o) => {
          const val = typeof o === 'object' ? o.value : o;
          const lbl = typeof o === 'object' ? o.label : o;
          return <option key={val} value={val} style={{ background: '#112644' }}>{lbl}</option>;
        })}
      </select>
      <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted-text)', fontSize: 10 }}>▾</span>
    </div>
  );
}
window.FilterSelect = FilterSelect;

// ---- ImageCropper: 1:1 crop interface (drag a zoomable frame, confirm) ----
function ImageCropper({ onConfirm, onCancel }) {
  const [zoom, setZoom] = React.useState(1.2);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef(null);
  const onDown = (e) => { drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }; };
  const onMove = (e) => {
    if (!drag.current) return;
    setPos({ x: drag.current.ox + (e.clientX - drag.current.sx), y: drag.current.oy + (e.clientY - drag.current.sy) });
  };
  const onUp = () => { drag.current = null; };
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  return (
    <div>
      <FieldLabel hint="arraste para posicionar · ajuste o zoom">Recorte 1:1</FieldLabel>
      <div
        onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        style={{ position: 'relative', width: '100%', maxWidth: 300, aspectRatio: '1 / 1', margin: '0 auto', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'radial-gradient(120% 100% at 50% 25%, #163258, #0D1B2E)', border: '1px solid var(--border-subtle)', cursor: 'grab' }}
      >
        <div onMouseDown={onDown} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(' + pos.x + 'px, ' + pos.y + 'px) scale(' + zoom + ')', color: 'var(--navy-border)' }}>
          <i data-lucide="image" style={{ width: 90, height: 90 }}></i>
        </div>
        <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 2px rgba(91,184,245,0.7)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sky-blue)', pointerEvents: 'none' }}>1 : 1</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px auto 0', maxWidth: 300 }}>
        <i data-lucide="zoom-out" style={{ width: 16, height: 16, color: 'var(--muted-text)' }}></i>
        <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{ flex: 1, accentColor: '#1E7FC8' }} />
        <i data-lucide="zoom-in" style={{ width: 16, height: 16, color: 'var(--muted-text)' }}></i>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
        <NAW.Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</NAW.Button>
        <NAW.Button variant="primary" size="sm" onClick={onConfirm}>Confirmar recorte</NAW.Button>
      </div>
    </div>
  );
}
window.ImageCropper = ImageCropper;
