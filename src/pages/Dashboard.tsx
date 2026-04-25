import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceprint } from "@/state/store";
import { Mail, Send, Sparkles, ChevronRight, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConnectAgnicButton } from "@/components/ConnectAgnicButton";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";

export default function Dashboard() {
  const nav = useNavigate();
  const {
    agentName,
    agentEmailAlias,
    primaryEmail,
    dna,
    drafts,
    generateInitialDraftAsync,
  } = useVoiceprint();
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const session = useAgnicSession();
  const kyaActive = session?.kyaStatus === "active";

  const send = async () => {
    const t = topic.trim();
    if (!t) return;
    setSending(true);
    try {
      const d = await generateInitialDraftAsync(t);
      setTopic("");
      toast.success(`${agentName} is on it.`, {
        description: session
          ? `Draft sent to ${primaryEmail}.`
          : `Draft drafted locally. Connect Agnic to email it.`,
      });
      nav(`/draft/${d.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate draft");
    } finally {
      setSending(false);
    }
  };

  const active = drafts.filter((d) => d.status !== "archived");

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <header className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              The studio
            </p>
            <h1 className="font-serif text-4xl text-foreground leading-tight">
              Quiet morning. What's on your mind?
            </h1>
          </div>
          <Link
            to="/voice"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            View Voice DNA <ChevronRight className="size-4" />
          </Link>
        </header>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          {/* Left column: send-a-topic + drafts */}
          <div className="space-y-8">
            {/* Composer */}
            <section className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="size-3.5" />
                Send a topic to {agentName || "your agent"}
              </div>
              <div className="p-6 space-y-4">
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="A topic, a link, an angle, or just an observation. Plain English."
                  rows={4}
                  className="text-[0.95rem] leading-relaxed border-0 bg-background focus-visible:ring-0 px-4"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    A draft will land in your inbox.
                  </p>
                  <Button
                    onClick={send}
                    disabled={!topic.trim() || !dna}
                    variant="studio"
                  >
                    <Send className="size-3.5" /> Send to agent
                  </Button>
                </div>
              </div>
            </section>

            {/* Drafts */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl text-foreground">Drafts</h2>
                <span className="text-xs text-muted-foreground">
                  {active.length} active
                </span>
              </div>

              {active.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                  <p className="font-serif italic">
                    Nothing here yet. Send a topic above.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border bg-surface-elevated overflow-hidden">
                  {active.map((d) => (
                    <li key={d.id}>
                      <Link
                        to={`/draft/${d.id}`}
                        className="block px-5 py-4 hover:bg-surface transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <StatusDot status={d.status} />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-foreground line-clamp-1">
                              {d.topic}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {d.bodyLong.split("\n")[0]}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                              {labelFor(d.status)}
                            </p>
                            <p className="text-xs text-muted-foreground/80 mt-0.5">
                              {timeAgo(d.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Right column: agent + voice cards */}
          <aside className="space-y-5 lg:sticky lg:top-10">
            <div className="rounded-xl border border-border bg-surface-elevated p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                <Mail className="size-3.5" /> Your agent
              </div>
              <p className="font-serif text-2xl text-foreground">
                {agentName || "—"}
              </p>
              <p className="text-sm text-muted-foreground font-mono mt-1 break-all">
                {agentEmailAlias}
              </p>
              <div className="border-t border-border mt-5 pt-4 text-sm text-muted-foreground leading-relaxed">
                Reply to any draft email in plain English. Say{" "}
                <span className="font-mono text-foreground">approve</span> when
                it's ready.
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-elevated p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Voice DNA
              </div>
              {dna ? (
                <>
                  <p className="font-serif text-foreground leading-snug">
                    {dna.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {dna.writing_voice.three_words.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[0.7rem] px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/15"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/voice"
                    className="text-sm text-primary hover:underline mt-4 inline-block"
                  >
                    View & edit →
                  </Link>
                </>
              ) : (
                <Button onClick={() => nav("/onboarding/name")}>
                  Set up your voice
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

const labelFor = (s: string) =>
  ({
    drafting: "drafting",
    awaiting_edits: "awaiting your edits",
    approved: "approved",
    archived: "archived",
    cancelled: "cancelled",
  } as const)[s as keyof typeof labelFor] || s;

const StatusDot = ({ status }: { status: string }) => (
  <div
    className={cn(
      "size-2 rounded-full mt-2 shrink-0",
      status === "approved" && "bg-primary",
      status === "awaiting_edits" && "bg-foreground/40",
      status === "drafting" && "bg-muted-foreground/40 animate-pulse",
      status === "archived" && "bg-border",
    )}
  />
);

const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};
