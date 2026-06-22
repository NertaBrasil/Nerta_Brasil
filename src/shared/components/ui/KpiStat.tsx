import { cn } from "@/shared/utils";

type KpiStatTone = "blue" | "gold" | "teal";

type KpiStatProps = {
  value: string;
  label: string;
  tone?: KpiStatTone;
};

const TONE_CLASSES: Record<KpiStatTone, string> = {
  blue: "text-nerta-blue",
  gold: "text-provisao-gold",
  teal: "text-teal",
};

export function KpiStat({ value, label, tone = "teal" }: KpiStatProps) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span
        className={cn(
          "font-display text-kpi font-bold leading-none tracking-headline",
          TONE_CLASSES[tone]
        )}
      >
        {value}
      </span>
      <span className="max-w-[200px] text-xs tracking-[0.02em] text-muted-text">{label}</span>
    </div>
  );
}
