import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ARCHETYPES, FEATURE_TOGGLES } from "@/data/archetypes";
import { useVoiceprint } from "@/state/store";
import { cn } from "@/lib/utils";

const WEIGHTS: { id: "light" | "medium" | "heavy"; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "heavy", label: "Heavy" },
];

export default function StepMix() {
  const nav = useNavigate();
  const { selections, setSelectionWeight, setSelectionFeature, buildDNA } =
    useVoiceprint();

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-2xl">
        <p className="font-serif italic text-muted-foreground">
          About two minutes.
        </p>
        <p className="font-serif text-2xl leading-snug text-foreground">
          How much of each? Think of it like a sound engineer's panel — not
          prompts, just dials.
        </p>
      </div>

      <div className="space-y-6">
        {selections.map((s) => {
          const arch = ARCHETYPES.find((a) => a.id === s.archetypeId)!;
          return (
            <section
              key={s.archetypeId}
              className="rounded-xl border border-border bg-surface-elevated p-6"
            >
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <p className="font-serif text-xl text-foreground">{arch.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {arch.oneLiner}
                  </p>
                </div>
                <div className="inline-flex rounded-md border border-border overflow-hidden">
                  {WEIGHTS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectionWeight(s.archetypeId, w.id)}
                      className={cn(
                        "px-4 py-1.5 text-xs uppercase tracking-wider transition-colors",
                        s.weight === w.id
                          ? "bg-foreground text-background"
                          : "bg-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {FEATURE_TOGGLES.map((f) => {
                  const on = !!s.features[f.id];
                  return (
                    <label
                      key={f.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span
                        onClick={() =>
                          setSelectionFeature(s.archetypeId, f.id, !on)
                        }
                        className={cn(
                          "relative w-9 h-5 rounded-full border transition-colors",
                          on
                            ? "bg-primary border-primary"
                            : "bg-background border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 size-4 rounded-full bg-background shadow-sm transition-all",
                            on ? "left-[1.05rem] bg-primary-foreground" : "left-0.5",
                          )}
                        />
                      </span>
                      <span className="text-sm text-foreground/85 group-hover:text-foreground">
                        {f.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={() => nav("/onboarding/gallery")}>
          ← Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="studio"
          size="xl"
          onClick={() => {
            buildDNA();
            nav("/onboarding/dna");
          }}
        >
          Generate Voice DNA
        </Button>
      </div>
    </div>
  );
}
