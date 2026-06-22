import { cn } from "@/shared/utils";

type ImagePlaceholderProps = {
  label?: string;
  className?: string;
  "data-testid"?: string;
};

export function ImagePlaceholder({
  label = "Sem imagem",
  className,
  ...rest
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center text-sm text-muted-text",
        className
      )}
      {...rest}
    >
      {label}
    </div>
  );
}
