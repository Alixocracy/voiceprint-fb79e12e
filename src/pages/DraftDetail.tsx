import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceprint } from "@/state/store";
import { ArrowLeft, Check, Copy, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const APPROVE_WORDS = ["approve", "approved", "looks good", "ship it", "lgtm"];
const CANCEL_WORDS = ["cancel", "kill it", "stop"];

export default function DraftDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const {
    drafts,
    agentName,
    agentEmailAlias,
    primaryEmail,
    regenerateDraft,
    approveDraft,
    archiveDraft,
    appendThread,
  } = useVoiceprint();

  const draft = drafts.find((d) => d.id === id);
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState(false);

  if (!draft) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="font-serif text-2xl mb-2">Draft not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Back to studio
          </Link>
        </div>
      </AppShell>
    );
  }

  const send = () => {
    const text = reply.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    if (APPROVE_WORDS.some((w) => lower.startsWith(w))) {
      approveDraft(draft.id);
      toast.success("Approved.", { description: "Final copy ready to paste." });
    } else if (CANCEL_WORDS.some((w) => lower.startsWith(w))) {
      archiveDraft(draft.id);
      appendThread(draft.id, {
        kind: "user_reply",
        at: new Date().toISOString(),
        body: text,
      });
      toast("Cancelled.");
      nav("/dashboard");
      return;
    } else {
      regenerateDraft(draft.id, text);
      toast(`${agentName} is revising.`, {
        description: "New draft will appear in seconds.",
      });
    }
    setReply("");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(draft.bodyLong);
    setCopied(true);
    toast.success("Copied.");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft className="size-3.5" /> Back to studio
        </Link>

        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Draft · {draft.status.replace("_", " ")}
          </p>
          <h1 className="font-serif text-3xl text-foreground leading-tight max-w-3xl">
            {draft.topic}
          </h1>
        </header>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* Draft body */}
          <article className="rounded-xl border border-border bg-surface-elevated p-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Long-form post
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                {draft.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => approveDraft(draft.id)}
                  >
                    Approve
                  </Button>
                )}
              </div>
            </div>
            <div className="font-serif text-foreground whitespace-pre-wrap leading-relaxed text-[1.05rem] measure">
              {draft.bodyLong}
            </div>

            <div className="border-t border-border mt-8 pt-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Derivatives
              </p>
              <Block title="Short post #1">{draft.bodyShort1}</Block>
              <Block title="Short post #2">{draft.bodyShort2}</Block>
              <Block title="Carousel hook">{draft.hookCarousel}</Block>
            </div>
          </article>

          {/* Reply panel */}
          <aside className="lg:sticky lg:top-10 space-y-5">
            <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-surface text-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  Email thread
                </p>
                <p className="font-serif text-foreground truncate">
                  Re: [Voiceprint] Draft: "{draft.topic.slice(0, 40)}…"
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {agentEmailAlias} → {primaryEmail}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder='Reply with edits — or say "approve".'
                  rows={5}
                  className="text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Plain English. No syntax.
                  </p>
                  <Button onClick={send} disabled={!reply.trim()}>
                    <Mail className="size-3.5" /> Reply
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["approve", "make it shorter", "less corporate"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setReply(q)}
                      className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-elevated p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                History
              </p>
              <ol className="space-y-3">
                {draft.thread.map((t) => (
                  <li key={t.id} className="text-sm">
                    <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-0.5">
                      {t.kind === "user_reply"
                        ? "You"
                        : t.kind === "draft"
                        ? `Revision ${t.version ?? ""}`.trim()
                        : agentName || "Agent"}
                      {" · "}
                      {timeAgo(t.at)}
                    </p>
                    <p className="text-foreground/85 leading-snug">{t.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-1">
      {title}
    </p>
    <p className="font-serif text-foreground/90 whitespace-pre-wrap leading-snug">
      {children}
    </p>
  </div>
);

const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};
