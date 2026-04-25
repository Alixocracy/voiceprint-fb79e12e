import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ARCHETYPES } from "@/data/archetypes";
import { useVoiceprint } from "@/state/store";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepGallery() {
  const nav = useNavigate();
  const { selections, toggleArchetype } = useVoiceprint();
  const selected = (id: string) =>
    selections.some((s) => s.archetypeId === id);
  const canContinue = selections.length >= 1;

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-2xl">
        <p className="font-serif italic text-muted-foreground">
          About three minutes.
        </p>
        <p className="font-serif text-2xl leading-snug text-foreground">
          Pick one to three voices that sound like you on a good day. We'll mix
          them, never copy them.
        </p>
        <p className="text-sm text-muted-foreground">
          {selections.length} of 3 selected.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ARCHETYPES.map((a) => {
          const isOn = selected(a.id);
          const disabled = !isOn && selections.length >= 3;
          return (
            <button
              key={a.id}
              disabled={disabled}
              onClick={() => toggleArchetype(a.id)}
              className={cn(
                "group text-left rounded-xl border bg-surface-elevated p-6 transition-all",
                "hover:border-border-strong hover:shadow-[0_1px_0_0_hsl(var(--border-strong))]",
                isOn
                  ? "border-primary/60 bg-primary-soft/40 ring-1 ring-primary/20"
                  : "border-border",
                disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-serif text-lg text-foreground">{a.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {a.oneLiner}
                  </p>
                </div>
                <div
                  className={cn(
                    "size-6 rounded-full border flex items-center justify-center transition-all shrink-0",
                    isOn
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-background",
                  )}
                >
                  {isOn && <Check className="size-3.5" strokeWidth={2.5} />}
                </div>
              </div>

              <blockquote className="quote text-[1.02rem] leading-snug text-foreground/85 border-l-2 border-primary/40 pl-4 my-4">
                "{a.quote}"
              </blockquote>

              <p className="text-xs text-muted-foreground/90 mb-3 mt-5">
                {a.bestFor}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {a.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border/80 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={() => nav("/onboarding/substance")}>
          ← Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="studio"
          size="xl"
          disabled={!canContinue}
          onClick={() => nav("/onboarding/mix")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
