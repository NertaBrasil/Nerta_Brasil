import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

type CardAccent = "blue" | "gold" | "teal";
type CardPadding = "4" | "5" | "6" | "8";

type CardProps = {
  accent?: CardAccent;
  raised?: boolean;
  interactive?: boolean;
  padding?: CardPadding;
  children: ReactNode;
  className?: string;
};

const ACCENT_CLASSES: Record<CardAccent, string> = {
  blue: "border-l-nerta-blue",
  gold: "border-l-provisao-gold",
  teal: "border-l-teal",
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  "4": "p-4",
  "5": "p-5",
  "6": "p-6",
  "8": "p-8",
};

export function Card({
  accent,
  raised = false,
  interactive = false,
  padding = "5",
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-navy-border transition-[border-color,transform] duration-base ease-standard",
        raised ? "bg-navy-light" : "bg-navy-mid",
        PADDING_CLASSES[padding],
        accent && "border-l-4",
        accent && ACCENT_CLASSES[accent],
        interactive && "hover:-translate-y-0.5 hover:border-navy-light",
        className
      )}
    >
      {children}
    </div>
  );
}
