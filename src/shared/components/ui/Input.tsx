import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
};

export function Input({ label, hint, error, leftIcon, id, containerClassName, ...rest }: InputProps) {
  const inputId = id ?? (label ? `in-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-[7px]", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-xs font-medium tracking-label text-light-gray"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex h-11 items-center gap-[9px] rounded-md border bg-navy-deeper px-[14px] transition-[border-color,box-shadow] duration-fast",
          error
            ? "border-[#E5634D]"
            : "border-navy-border focus-within:border-nerta-blue focus-within:ring-2 focus-within:ring-nerta-blue/30"
        )}
      >
        {leftIcon && <span className="flex text-muted-text">{leftIcon}</span>}
        <input
          id={inputId}
          className="flex-1 bg-transparent font-body text-base text-white outline-none placeholder:text-muted-text"
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span className={cn("font-body text-xs", error ? "text-[#E5634D]" : "text-muted-text")}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
