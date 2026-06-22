import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/utils";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export function Textarea({
  label,
  hint,
  error,
  id,
  rows = 4,
  containerClassName,
  ...rest
}: TextareaProps) {
  const textareaId = id ?? (label ? `ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={cn("flex w-full flex-col gap-[7px]", containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="font-body text-xs font-medium tracking-label text-light-gray"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          "w-full resize-y rounded-md border bg-navy-deeper px-[14px] py-[10px] font-body text-base text-white outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-muted-text",
          error
            ? "border-[#E5634D]"
            : "border-navy-border focus:border-nerta-blue focus:ring-2 focus:ring-nerta-blue/30"
        )}
        {...rest}
      />
      {(hint || error) && (
        <span className={cn("font-body text-xs", error ? "text-[#E5634D]" : "text-muted-text")}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
