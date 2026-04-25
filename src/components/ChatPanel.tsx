import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useVoiceprint } from "@/state/store";
import { useAgency } from "@/state/agencyStore";
import { streamChat } from "@/integrations/agnic/client";
import { useAgnicSession } from "@/integrations/agnic/useAgnicSession";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pin, X, Send, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const ChatPanel = () => {
  const { dna } = useVoiceprint();
  const { folders, documents, chatMessages, pinnedFolderId, setPinnedFolder, appendChatMessage, updateChatMessage, clearChat } = useAgency();
  const session = useAgnicSession();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const pinnedFolder = pinnedFolderId ? folders.find((f) => f.id === pinnedFolderId) ?? null : null;
  const pinnedDocs = useMemo(
    () => (pinnedFolderId ? documents.filter((d) => d.folder_id === pinnedFolderId) : []),
    [documents, pinnedFolderId],
  );

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    if (!dna) {
      toast.error("Build your Voice DNA first.");
      return;
    }
    if (!session) {
      toast.error("Connect Agnic to chat with your voice.");
      return;
    }
    setBusy(true);
    appendChatMessage({ role: "user", content: text });
    setInput("");
    const placeholder = appendChatMessage({
      role: "assistant",
      content: "",
      reference_doc_ids: pinnedDocs.map((d) => d.id),
    });

    const refs = pinnedDocs
      .filter((d) => d.text_content && d.text_content.length > 0)
      .map((d) => ({ name: d.name, text: d.text_content }));

    let acc = "";
    try {
      await streamChat({
        messages: [
          ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: text },
        ],
        voiceDna: dna,
        referenceDocs: refs.length > 0 ? refs : undefined,
        onDelta: (chunk) => {
          acc += chunk;
          updateChatMessage(placeholder.id, { content: acc });
          requestAnimationFrame(() => {
            scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
          });
        },
        onDone: () => {
          if (!acc) updateChatMessage(placeholder.id, { content: "(no response)" });
          setBusy(false);
        },
        onError: (msg) => {
          updateChatMessage(placeholder.id, { content: `_Error: ${msg}_` });
          toast.error(msg);
          setBusy(false);
        },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
      <div className="px-6 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <MessageCircle className="size-3.5" />
          Chat with My Voice
        </div>
        {chatMessages.length > 0 && (
          <button
            onClick={() => clearChat()}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="max-h-[420px] overflow-y-auto px-6 py-5 space-y-5">
        {chatMessages.length === 0 ? (
          <p className="text-sm font-serif italic text-muted-foreground">
            Ask anything. I will reply in your voice. Pin a folder below to ground my answers in your documents.
          </p>
        ) : (
          chatMessages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-foreground border border-border",
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:font-serif">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
                {m.role === "assistant" && m.reference_doc_ids && m.reference_doc_ids.length > 0 && (
                  <ReferencedFrom docIds={m.reference_doc_ids} />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Folder picker + composer */}
      <div className="border-t border-border px-6 py-3 bg-surface/50">
        <div className="flex items-center gap-2 mb-2 relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors",
              pinnedFolder
                ? "border-primary/30 bg-primary-soft text-primary"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            <Pin className="size-3" />
            {pinnedFolder ? `Pinned: ${pinnedFolder.name}` : "No folder pinned"}
          </button>
          {pinnedFolder && (
            <button
              onClick={() => setPinnedFolder(null)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Unpin"
            >
              <X className="size-3.5" />
            </button>
          )}
          {pinnedFolder && (
            <span className="text-[0.7rem] text-muted-foreground">
              {pinnedDocs.length} document{pinnedDocs.length === 1 ? "" : "s"}
            </span>
          )}
          {pickerOpen && (
            <div className="absolute top-9 left-0 z-10 w-64 max-h-72 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
              {folders.length === 0 ? (
                <div className="px-3 py-3 text-xs text-muted-foreground">
                  No folders yet.{" "}
                  <Link to="/my-documents" className="text-primary hover:underline">
                    Create one
                  </Link>
                  .
                </div>
              ) : (
                <ul className="py-1">
                  {folders.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => {
                          setPinnedFolder(f.id);
                          setPickerOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center justify-between"
                      >
                        <span>{f.name}</span>
                        <span className="text-[0.7rem] text-muted-foreground">
                          {documents.filter((d) => d.folder_id === f.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={2}
            placeholder="Message your voice…"
            className="text-sm min-h-[60px] bg-background"
            disabled={busy}
          />
          <Button onClick={send} disabled={!input.trim() || busy} variant="studio" className="self-stretch">
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReferencedFrom = ({ docIds }: { docIds: string[] }) => {
  const { documents } = useAgency();
  const docs = docIds.map((id) => documents.find((d) => d.id === id)).filter(Boolean) as { id: string; name: string }[];
  if (docs.length === 0) return null;
  return (
    <div className="mt-3 pt-3 border-t border-border/60 flex items-start gap-1.5 flex-wrap text-[0.7rem] text-muted-foreground">
      <FileText className="size-3 mt-px shrink-0" />
      <span>referenced from</span>
      {docs.map((d, i) => (
        <span key={d.id}>
          <Link to="/my-documents" className="text-primary hover:underline">
            {d.name}
          </Link>
          {i < docs.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
};
