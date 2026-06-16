import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** blue=produto, gold=Provisão, teal=benefício, neutral */
  tone?: 'blue' | 'gold' | 'teal' | 'neutral';
  /** Filled instead of outlined */
  solid?: boolean;
  children?: React.ReactNode;
}

/** Uppercase pill label for product lines, categories and benefit tags. */
export function Badge(props: BadgeProps): JSX.Element;
