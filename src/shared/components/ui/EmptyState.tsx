import type { ReactNode } from "react";
import { Button } from "./Button";

type EmptyStateAction = {
  label: string;
  href: string;
};

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-navy-border px-6 py-14 text-center">
      {icon && <div className="text-muted-text">{icon}</div>}
      <p className="font-body text-sm font-medium text-white">{title}</p>
      {description && (
        <p className="max-w-sm font-body text-sm leading-body text-muted-text">{description}</p>
      )}
      {action && (
        <Button href={action.href} variant="secondary" size="sm" className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
