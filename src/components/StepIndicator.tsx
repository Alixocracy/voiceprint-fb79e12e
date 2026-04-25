import { cn } from "@/lib/utils";

interface Props {
  step: number;
  total: number;
  label?: string;
  className?: string;
}

export const StepIndicator = ({ step, total, label, className }: Props) => (
  <div className={cn("flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground", className)}>
    <span className="font-sans">Step {step} of {total}</span>
    <span className="h-px w-8 bg-border" />
    {label && <span className="font-serif italic normal-case tracking-normal text-[0.85rem] text-foreground/70">{label}</span>}
  </div>
);

export const ProgressBar = ({ step, total }: { step: number; total: number }) => (
  <div className="flex gap-1.5 w-full">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-[3px] flex-1 rounded-full transition-colors",
          i < step ? "bg-primary" : "bg-border",
        )}
      />
    ))}
  </div>
);
