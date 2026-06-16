import React from 'react';
import { Button } from './Button.jsx';

/**
 * Modal — centered dialog over a dark scrim. Used for confirmations
 * (delete) and small forms. Destructive confirms use the red danger button.
 */
export function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  hideFooter = false,
  width = 440,
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--scrim)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width,
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          padding: 26,
        }}
      >
        {title && <h3 style={{ fontSize: 20, marginBottom: 12 }}>{title}</h3>}
        <div style={{ fontSize: 13.5, color: 'var(--muted-text)', lineHeight: 1.6 }}>{children}</div>
        {!hideFooter && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26 }}>
            <Button variant="secondary" size="sm" onClick={onClose}>{cancelLabel}</Button>
            <Button variant={destructive ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
