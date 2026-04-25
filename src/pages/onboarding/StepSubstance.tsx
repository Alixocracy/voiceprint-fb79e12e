import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useVoiceprint } from "@/state/store";
import { X } from "lucide-react";
import type { VoiceSample } from "@/data/types";

const PANELS: {
  type: VoiceSample["type"];
  title: string;
  hint: string;
  placeholder: string;
  required: boolean;
  min: number;
}[] = [
  {
    type: "best_of",
    title: "Best of you",
    hint: "Paste 3–5 of your best posts, articles, or short talks. Anything you'd be proud to be quoted on.",
    placeholder: "Paste a post, article, or excerpt here…",
    required: true,
    min: 1,
  },
  {
    type: "story",
    title: "Stories you tell",
    hint: "1–2 stories that always land in conversation. The board-seat decision. The hire that didn't work. The pivot.",
    placeholder: "Tell the story exactly as you'd tell it at dinner…",
    required: true,
    min: 1,
  },
  {
    type: "bio",
    title: "About you, in your own words",
    hint: "1–2 paragraphs you wrote yourself. Not the LinkedIn 'About'. The version a friend would recognize.",
    placeholder: "Write a short bio in your own voice…",
    required: true,
    min: 1,
  },
  {
    type: "long_form",
    title: "Long-form sample",
    hint: "Optional. A memo, talk transcript, chapter, or essay. Helps us hear your rhythm at length.",
    placeholder: "Paste a longer piece (memo, essay, talk)…",
    required: false,
    min: 0,
  },
];

export default function StepSubstance() {
  const nav = useNavigate();
  const { samples, addSample, removeSample } = useVoiceprint();

  const required = PANELS.filter((p) => p.required);
  const canContinue = required.every(
    (p) => samples.filter((s) => s.type === p.type).length >= p.min,
  );

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-2xl">
        <p className="font-serif italic text-muted-foreground">
          About five minutes.
        </p>
        <p className="font-serif text-2xl leading-snug text-foreground">
          The more honest the input, the more your voice comes through. Don't
          polish for us — we'd rather see the texture.
        </p>
      </div>

      <div className="space-y-8">
        {PANELS.map((p) => (
          <Panel
            key={p.type}
            panel={p}
            samples={samples.filter((s) => s.type === p.type)}
            onAdd={(content, title) => addSample({ type: p.type, content, title })}
            onRemove={removeSample}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={() => nav("/onboarding/name")}>
          ← Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="studio"
          size="xl"
          disabled={!canContinue}
          onClick={() => nav("/onboarding/gallery")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function Panel({
  panel,
  samples,
  onAdd,
  onRemove,
}: {
  panel: (typeof PANELS)[number];
  samples: VoiceSample[];
  onAdd: (content: string, title?: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl text-foreground">{panel.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            {panel.hint}
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground shrink-0 mt-1">
          {panel.required ? "Required" : "Optional"} · {samples.length} added
        </span>
      </div>

      <div className="px-6 py-5 space-y-4">
        {samples.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-border bg-surface px-4 py-3 flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              {s.title && (
                <p className="font-serif text-foreground mb-1">{s.title}</p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {s.content}
              </p>
            </div>
            <button
              onClick={() => onRemove(s.id)}
              className="text-muted-foreground hover:text-destructive p-1 -mr-1 transition-colors"
              aria-label="Remove"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <SampleEditor onAdd={onAdd} withTitle={panel.type === "best_of" || panel.type === "long_form"} placeholder={panel.placeholder} />
      </div>
    </section>
  );
}

function SampleEditor({
  onAdd,
  withTitle,
  placeholder,
}: {
  onAdd: (content: string, title?: string) => void;
  withTitle: boolean;
  placeholder: string;
}) {
  let titleRef: HTMLInputElement | null = null;
  let textRef: HTMLTextAreaElement | null = null;
  return (
    <div className="space-y-2 pt-2">
      {withTitle && (
        <Input
          ref={(el) => (titleRef = el)}
          placeholder="Optional title (e.g. 'Board-seat memo')"
          className="h-9 text-sm"
        />
      )}
      <Textarea
        ref={(el) => (textRef = el)}
        placeholder={placeholder}
        rows={4}
        className="text-sm leading-relaxed"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const content = textRef?.value.trim();
            const title = titleRef?.value.trim();
            if (!content) return;
            onAdd(content, title || undefined);
            if (textRef) textRef.value = "";
            if (titleRef) titleRef.value = "";
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
