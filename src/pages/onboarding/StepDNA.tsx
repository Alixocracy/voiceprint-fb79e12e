import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceprint } from "@/state/store";
import { VoiceDNAView } from "@/components/VoiceDNAView";
import { Sparkles } from "lucide-react";

const QUICK_EDITS = [
  "Make it less corporate.",
  "Never end posts with rhetorical questions.",
  "Use shorter paragraphs.",
];

export default function StepDNA() {
  const nav = useNavigate();
  const { dna, buildDNA, updateDNAFromInstruction } = useVoiceprint();
  const [instruction, setInstruction] = useState("");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!dna) buildDNA();
  }, [dna, buildDNA]);

  if (!dna) return null;

  const apply = (text: string) => {
    if (!text.trim()) return;
    updateDNAFromInstruction(text.trim());
    setInstruction("");
    setPulse(true);
    setTimeout(() => setPulse(false), 700);
  };

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
      <div className={pulse ? "animate-fade-up" : undefined} key={dna.evolution_log.length}>
        <div className="space-y-3 mb-6">
          <p className="font-serif italic text-muted-foreground">About three minutes.</p>
          <p className="font-serif text-2xl leading-snug text-foreground">
            Here's your Voice DNA. Read it, then tell us what's wrong with it.
          </p>
          <p className="text-sm text-muted-foreground">
            Plain English. No prompt syntax. Anything you say re-tunes the DNA.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-8">
          <VoiceDNAView dna={dna} />
        </div>
      </div>

      <aside className="lg:sticky lg:top-10 space-y-4">
        <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="size-3.5" />
            <span>Tune in plain English</span>
          </div>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder='e.g. "Less corporate. Drop the questions at the end."'
            rows={4}
            className="text-sm leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            {QUICK_EDITS.map((q) => (
              <button
                key={q}
                onClick={() => apply(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            variant="default"
            onClick={() => apply(instruction)}
            disabled={!instruction.trim()}
          >
            Apply edit
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" onClick={() => nav("/onboarding/mix")}>
            ← Back
          </Button>
          <div className="flex-1" />
          <Button variant="studio" size="lg" onClick={() => nav("/onboarding/wow")}>
            See your first draft
          </Button>
        </div>
      </aside>
    </div>
  );
}
