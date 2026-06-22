import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils";

type SelectOption = { value: string; label: string };

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
};

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  id,
  containerClassName,
  ...rest
}: SelectProps) {
  const selectId = id ?? (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-[7px]", containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="font-body text-xs font-medium tracking-label text-light-gray"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative h-11 rounded-md border bg-navy-deeper transition-[border-color,box-shadow] duration-fast",
          error
            ? "border-[#E5634D]"
            : "border-navy-border focus-within:border-nerta-blue focus-within:ring-2 focus-within:ring-nerta-blue/30"
        )}
      >
        <select
          id={selectId}
          className="h-full w-full cursor-pointer appearance-none bg-transparent px-[14px] pr-[38px] font-body text-base text-white outline-none"
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-navy-light">
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-xs text-muted-text">
          ▾
        </span>
      </div>
      {(hint || error) && (
        <span className={cn("font-body text-xs", error ? "text-[#E5634D]" : "text-muted-text")}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
