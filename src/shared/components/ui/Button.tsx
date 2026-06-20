import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils";

type ButtonVariant = "primary" | "partner" | "secondary" | "ghost" | "danger" | "danger-ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabledLabel?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-[22px] text-base",
  lg: "h-13 px-[30px] text-lg",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-nerta-blue text-white hover:bg-nerta-blue-hover",
  partner: "bg-provisao-gold text-[#15233A] hover:bg-provisao-gold-hover",
  secondary: "bg-transparent text-white border border-navy-border hover:bg-navy-light",
  ghost: "bg-transparent text-sky-blue hover:bg-[rgba(30,127,200,0.12)]",
  danger: "bg-[#D64C39] text-white hover:bg-[#E0573F]",
  "danger-ghost":
    "bg-transparent text-[#E5634D] border border-[rgba(214,76,57,0.45)] hover:bg-[rgba(214,76,57,0.12)]",
};

const DISABLED_CLASSES =
  "bg-action-disabled-bg text-action-disabled-text border border-navy-border cursor-not-allowed hover:bg-action-disabled-bg";

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  disabledLabel,
  leftIcon,
  rightIcon,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) {
  const label = disabled && disabledLabel ? disabledLabel : children;

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-bold leading-none tracking-[-0.01em] transition-[background,transform,opacity] duration-fast ease-standard select-none",
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        disabled ? DISABLED_CLASSES : VARIANT_CLASSES[variant],
        !disabled && "active:scale-[0.97]",
        className
      )}
      {...rest}
    >
      {leftIcon}
      {label}
      {rightIcon}
    </button>
  );
}
