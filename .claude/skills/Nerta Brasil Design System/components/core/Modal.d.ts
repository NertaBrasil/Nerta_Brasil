import * as React from 'react';

export interface ModalProps {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use the red danger button for the confirm (delete flows) */
  destructive?: boolean;
  /** Hide the footer to render a custom body (forms) */
  hideFooter?: boolean;
  width?: number;
}

/** Diálogo centralizado sobre scrim escuro — confirmações e formulários curtos. */
export function Modal(props: ModalProps): JSX.Element;
