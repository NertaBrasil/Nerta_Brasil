import type { ReactNode } from "react";
import { cn } from "@/shared/utils";

type BadgeTone = "blue" | "gold" | "teal" | "neutral";

type BadgeProps = {
  tone?: BadgeTone;
  solid?: boolean;
  children: ReactNode;
  className?: string;
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  blue: "text-sky-blue bg-[rgba(30,127,200,0.1)] border-[rgba(30,127,200,0.5)]",
  gold: "text-gold-light bg-[rgba(201,149,26,0.1)] border-[rgba(201,149,26,0.55)]",
  teal: "text-teal bg-[rgba(29,184,126,0.1)] border-[rgba(29,184,126,0.5)]",
  neutral: "text-light-gray bg-navy-mid border-navy-border",
};

const SOLID_CLASSES: Record<BadgeTone, string> = {
  blue: "bg-nerta-blue text-white border-transparent",
  gold: "bg-provisao-gold text-[#15233A] border-transparent",
  teal: "bg-teal text-[#0B2018] border-transparent",
  neutral: "bg-navy-mid text-white border-transparent",
};

export function Badge({ tone = "blue", solid = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 font-body text-label font-semibold uppercase leading-none tracking-label",
        solid ? SOLID_CLASSES[tone] : TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
