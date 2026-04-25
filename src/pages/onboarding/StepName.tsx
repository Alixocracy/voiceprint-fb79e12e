import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceprint } from "@/state/store";

const SUGGESTIONS = (firstName: string) => [
  `${firstName}'s Editor`,
  `The ${firstName} Voice`,
  `Voiceprint by ${firstName}`,
];

export default function StepName() {
  const nav = useNavigate();
  const { agentName, setAgentName, primaryEmail, setPrimaryEmail, agentEmailAlias } =
    useVoiceprint();
  const [first, setFirst] = useState("");

  // derive a default first-name from email local part for suggestions
  useEffect(() => {
    if (!first && primaryEmail.includes("@")) {
      const local = primaryEmail.split("@")[0];
      const guess = local.split(/[._-]/)[0];
      setFirst(guess.charAt(0).toUpperCase() + guess.slice(1));
    }
  }, [primaryEmail, first]);

  const canContinue = agentName.trim().length >= 2;

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start">
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="font-serif italic text-muted-foreground text-base">
            About one minute.
          </p>
          <p className="font-serif text-3xl leading-tight text-foreground max-w-xl">
            What should we call your agent?
          </p>
          <p className="text-muted-foreground max-w-lg leading-relaxed">
            This is the name that appears in your inbox when drafts arrive. Most
            people pick something a colleague might say out loud.
          </p>
        </div>

        <div className="space-y-3 max-w-md">
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Your email
          </label>
          <Input
            value={primaryEmail}
            onChange={(e) => setPrimaryEmail(e.target.value)}
            placeholder="you@yourcompany.com"
            className="h-11"
          />
        </div>

        <div className="space-y-3 max-w-md">
          <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Agent name
          </label>
          <Input
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g. Sarah's Editor"
            className="h-11 font-serif text-base"
            autoFocus
          />

          {first && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS(first).map((s) => (
                <button
                  key={s}
                  onClick={() => setAgentName(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button size="xl" variant="studio" disabled={!canContinue} onClick={() => nav("/onboarding/substance")}>
            Continue
          </Button>
          <span className="text-xs text-muted-foreground">
            ↵ to continue
          </span>
        </div>
      </div>

      <aside className="lg:sticky lg:top-10 space-y-4">
        <div className="rounded-xl border border-border bg-surface-elevated p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Preview · your agent's email
          </p>
          <div className="space-y-1">
            <p className="font-serif text-xl text-foreground">
              {agentName || "Your agent"}
            </p>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {agentEmailAlias || "agent-name@agent.agnic.ai"}
            </p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Subject
            </p>
            <p className="font-serif text-foreground">
              [Voiceprint] Draft: "Three quiet truths about scaling…"
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-2">
            Drafts arrive in your inbox. You reply in plain English. No new app
            to live in.
          </p>
        </div>
      </aside>
    </div>
  );
}
