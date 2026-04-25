import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceDNAView } from "@/components/VoiceDNAView";
import { useVoiceprint } from "@/state/store";
import { dnaHasEmptyMigratedSections, VOICE_DNA_FRAMING_LINE } from "@/data/generate";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function VoicePage() {
  const {
    dna,
    updateDNAFromInstruction,
    migrationBannerDismissed,
    dismissMigrationBanner,
  } = useVoiceprint();
  const [edit, setEdit] = useState("");

  if (!dna) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
          <p className="font-serif text-2xl">No Voice DNA yet.</p>
          <Link to="/onboarding/name" className="text-primary hover:underline">
            Run the Voice Creator →
          </Link>
        </div>
      </AppShell>
    );
  }

  const apply = () => {
    if (!edit.trim()) return;
    updateDNAFromInstruction(edit.trim());
    setEdit("");
    toast.success("Voice DNA updated.");
  };

  const showMigrationBanner =
    !migrationBannerDismissed && dnaHasEmptyMigratedSections(dna);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Voice DNA
          </p>
          <h1 className="font-serif text-3xl text-foreground">Your Voice</h1>
          <p className="text-sm italic text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            {VOICE_DNA_FRAMING_LINE}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-3">
            {dna.name} · v{dna.version} · last edited{" "}
            {dna.evolution_log[0]?.date ?? "today"}
          </p>
        </header>

        {showMigrationBanner && (
          <div className="mb-8 rounded-lg border border-primary/30 bg-primary-soft/40 px-5 py-4 flex items-start gap-4">
            <p className="flex-1 text-sm text-foreground/90 leading-relaxed">
              Two new sections in your Voice DNA are ready for you to fill:{" "}
              <span className="font-serif italic">Core Identity</span> and{" "}
              <span className="font-serif italic">Quality Control</span>.
            </p>
            <button
              onClick={dismissMigrationBanner}
              className="text-muted-foreground hover:text-foreground p-1 -m-1"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="rounded-xl border border-border bg-surface-elevated p-8">
            <VoiceDNAView dna={dna} />
          </div>

          <aside className="lg:sticky lg:top-10 rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Tune in plain English
            </p>
            <Textarea
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
              placeholder='e.g. "Keep paragraphs to two sentences." or "Drop the framework lists."'
              rows={5}
            />
            <Button className="w-full" onClick={apply} disabled={!edit.trim()}>
              Apply edit
            </Button>
            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
              Edits compound. You can also retune by approving or rejecting
              drafts in the studio.
            </p>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
