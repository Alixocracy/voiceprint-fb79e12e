import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVoiceprint, suggestTopics } from "@/state/store";
import { generateDraftSet } from "@/data/generate";
import { Mail, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function StepWow() {
  const nav = useNavigate();
  const {
    samples,
    dna,
    agentName,
    agentEmailAlias,
    primaryEmail,
    completeOnboarding,
    generateInitialDraft,
  } = useVoiceprint();

  const topicSuggestions = useMemo(() => suggestTopics(samples), [samples]);
  const [topic, setTopic] = useState<string>(topicSuggestions[0] ?? "");
  const [seed, setSeed] = useState(0);
  const draft = useMemo(() => {
    if (!dna || !topic) return null;
    return generateDraftSet({ topic, dna });
  }, [dna, topic, seed]);

  const sample = samples[0];
  const [copied, setCopied] = useState(false);
  const [emailed, setEmailed] = useState(false);

  if (!dna || !draft) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(draft.bodyLong);
    setCopied(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 1800);
  };

  const emailMe = () => {
    setEmailed(true);
    toast(`Sent from ${agentName} to ${primaryEmail}.`, {
      description: agentEmailAlias,
    });
    setTimeout(() => setEmailed(false), 2200);
  };

  const finish = () => {
    generateInitialDraft(topic);
    completeOnboarding();
    nav("/dashboard");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 max-w-2xl">
        <p className="font-serif italic text-muted-foreground">About five minutes.</p>
        <p className="font-serif text-2xl leading-snug text-foreground">
          Pick a topic. Read it back. Decide if it sounds like you.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Suggested from your samples
        </p>
        <div className="flex flex-wrap gap-2">
          {topicSuggestions.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                setSeed((s) => s + 1);
              }}
              className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors max-w-md ${
                topic === t
                  ? "border-primary bg-primary-soft/50 text-foreground"
                  : "border-border bg-surface-elevated text-muted-foreground hover:text-foreground hover:border-border-strong"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: original samples */}
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Your voice (sampled)
          </p>
          <div className="prose-sm font-serif text-foreground/85 whitespace-pre-wrap leading-relaxed text-[1rem]">
            {sample?.content ??
              "Your samples will appear here. Add a few in step 2 for a sharper match."}
          </div>
        </section>

        {/* Right: generated draft */}
        <section className="rounded-xl border border-primary/30 bg-surface-elevated p-6 shadow-[0_0_0_1px_hsl(var(--primary)/0.05)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">
              Voiceprint draft · in your voice
            </p>
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <RefreshCw className="size-3" /> Regenerate
            </button>
          </div>
          <div className="prose-sm font-serif text-foreground whitespace-pre-wrap leading-relaxed text-[1.02rem]">
            {draft.bodyLong}
          </div>

          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border">
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="outline" onClick={emailMe}>
              {emailed ? <Check className="size-3.5" /> : <Mail className="size-3.5" />}
              {emailed ? "Sent" : "Email me this"}
            </Button>
          </div>
        </section>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
          Derivatives
        </p>
        <div className="space-y-3">
          <DerivCard label="Short post #1" body={draft.bodyShort1} />
          <DerivCard label="Short post #2" body={draft.bodyShort2} />
          <DerivCard label="Carousel hook" body={draft.hookCarousel} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <Button variant="ghost" onClick={() => nav("/onboarding/dna")}>
          ← Back
        </Button>
        <div className="flex-1" />
        <Button variant="studio" size="xl" onClick={finish}>
          Take me to the studio →
        </Button>
      </div>
    </div>
  );
}

const DerivCard = ({ label, body }: { label: string; body: string }) => (
  <div className="rounded-lg border border-border bg-background px-4 py-3">
    <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-1">
      {label}
    </p>
    <p className="font-serif text-foreground whitespace-pre-wrap leading-snug">
      {body}
    </p>
  </div>
);
