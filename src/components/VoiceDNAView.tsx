import { useState } from "react";
import type { PunctuationRule, VoiceDNA } from "@/data/types";
import { ALL_PUNCTUATION_RULES, PUNCTUATION_RULE_LABELS } from "@/data/generate";
import { useVoiceprint } from "@/state/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";

export const VoiceDNAView = ({ dna }: { dna: VoiceDNA }) => (
  <div className="space-y-7">
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
        Voice summary
      </p>
      <p className="font-serif text-xl leading-snug text-foreground">
        {dna.summary}
      </p>
    </div>

    {/* 1. CORE IDENTITY */}
    <Section title="Core Identity">
      <Field label="Worldview">
        <ParagraphOrTodo value={dna.core_identity.worldview} />
      </Field>
      <Field label="Non-negotiable beliefs">
        <BulletList items={dna.core_identity.non_negotiable_beliefs} />
      </Field>
      <Field label="Industry POV">
        <ParagraphOrTodo value={dna.core_identity.industry_pov} />
      </Field>
      <Field label="Changed mind about">
        <BulletList items={dna.core_identity.changed_mind_about} />
      </Field>
      <Field label="Audience">
        <div className="space-y-1.5">
          <ParagraphOrTodo value={dna.core_identity.audience.person_description} />
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">Misbelieves:</span>{" "}
            <ParagraphOrTodo inline value={dna.core_identity.audience.common_misbelief} />
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">Resists hearing:</span>{" "}
            <ParagraphOrTodo
              inline
              value={dna.core_identity.audience.what_they_resist_hearing}
            />
          </p>
        </div>
      </Field>
      <Field label="What makes me different">
        <ParagraphOrTodo value={dna.core_identity.differentiation} />
      </Field>
    </Section>

    {/* 2. WRITING VOICE */}
    <Section title="Writing Voice">
      <Field label="Three words">
        {dna.writing_voice.three_words.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {dna.writing_voice.three_words.map((w) => (
              <span
                key={w}
                className="text-xs px-2 py-0.5 rounded-md bg-primary-soft text-primary border border-primary/15"
              >
                {w}
              </span>
            ))}
          </div>
        ) : (
          <Todo />
        )}
      </Field>
      <Field label="Hook style">
        <p>{dna.writing_voice.hook_style.pattern}</p>
        <ul className="space-y-1 mt-1.5">
          {dna.writing_voice.hook_style.examples.map((e) => (
            <li key={e} className="quote text-foreground/90">"{e}"</li>
          ))}
        </ul>
      </Field>
      <Field label="Rhythm">
        <p>Sentences: {dna.writing_voice.rhythm.sentence_length}</p>
        <p>Paragraphs: {dna.writing_voice.rhythm.paragraph_length}</p>
      </Field>
      <Field label="Register">
        <p>
          {dna.writing_voice.register.primary} · {dna.writing_voice.register.secondary}
        </p>
      </Field>
      <Field label="Transitions">{dna.writing_voice.transitions}</Field>
      <Field label="Story structure">
        <p>{dna.writing_voice.story_structure.default}</p>
        <p className="text-xs text-muted-foreground">
          Callback: {dna.writing_voice.story_structure.callback_style}
        </p>
      </Field>
      <Field label="CTA style">{dna.writing_voice.cta_style}</Field>
    </Section>

    {/* 3. THE BLACK LIST */}
    <BlackListEditor dna={dna} />

    {/* 4. QUALITY CONTROL */}
    <Section title="Quality Control">
      <Field label="Always">
        <BulletList items={dna.quality_control.always} />
      </Field>
      <Field label="Never">
        <BulletList items={dna.quality_control.never} />
      </Field>
      <Field label="Voice calibration quotes">
        {dna.quality_control.voice_calibration_quotes.length > 0 ? (
          <ul className="space-y-1.5">
            {dna.quality_control.voice_calibration_quotes.map((q, i) => (
              <li key={i} className="quote text-foreground/90">"{q}"</li>
            ))}
          </ul>
        ) : (
          <Todo />
        )}
      </Field>
    </Section>

    {/* Reference anchors */}
    <Section title="Reference anchors">
      <div className="space-y-1.5">
        {dna.reference_anchors.map((a) => (
          <div
            key={a.archetype}
            className="flex items-center gap-3 text-sm text-foreground/85"
          >
            <span className="font-serif w-32">{a.archetype}</span>
            <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${Math.min(100, a.weight * 140)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
              {(a.weight * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </Section>

    {dna.evolution_log.length > 0 && (
      <Section title="Evolution log">
        <ul className="space-y-1.5">
          {dna.evolution_log.slice(0, 5).map((l, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              <span className="font-mono">{l.date}</span> · {l.change}
            </li>
          ))}
        </ul>
      </Section>
    )}
  </div>
);

// ---------- Black List editor (first-class) ----------
export const BlackListEditor = ({ dna }: { dna: VoiceDNA }) => {
  const {
    addBlackListPhrase,
    removeBlackListPhrase,
    togglePunctuationRule,
    addBlackListFraming,
    removeBlackListFraming,
    addBlackListTone,
    removeBlackListTone,
  } = useVoiceprint();

  return (
    <section className="border-t border-border pt-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
        The Black List
      </p>
      <p className="text-xs text-muted-foreground mb-5 italic">
        Strict rules. The agent will not use any of these.
      </p>

      <div className="space-y-6">
        <ChipGroup
          label="Phrases I never use"
          items={dna.black_list.phrases_never_used}
          onAdd={addBlackListPhrase}
          onRemove={removeBlackListPhrase}
          placeholder="add a phrase or word"
        />

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Punctuation to avoid
          </p>
          <div className="space-y-2.5">
            {ALL_PUNCTUATION_RULES.map((rule) => (
              <PunctuationToggle
                key={rule}
                rule={rule}
                enabled={dna.black_list.punctuation_avoid.includes(rule)}
                onToggle={() => togglePunctuationRule(rule)}
              />
            ))}
          </div>
        </div>

        <ChipGroup
          label="Tones and framings I avoid"
          items={[...dna.black_list.framings_avoided, ...dna.black_list.tones_beneath]}
          onAdd={(v) => addBlackListFraming(v)}
          onRemove={(v) => {
            if (dna.black_list.framings_avoided.includes(v)) removeBlackListFraming(v);
            else removeBlackListTone(v);
          }}
          placeholder="add a tone or framing"
          // tone-only adder also exposed
          extraAdd={{ label: "+ add as tone", onAdd: addBlackListTone }}
        />
      </div>
    </section>
  );
};

const PunctuationToggle = ({
  rule,
  enabled,
  onToggle,
}: {
  rule: PunctuationRule;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <Switch checked={enabled} onCheckedChange={onToggle} className="mt-0.5" />
    <span className="text-sm text-foreground/85 leading-snug group-hover:text-foreground">
      {PUNCTUATION_RULE_LABELS[rule]}
    </span>
  </label>
);

const ChipGroup = ({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  extraAdd,
}: {
  label: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  extraAdd?: { label: string; onAdd: (v: string) => void };
}) => {
  const [val, setVal] = useState("");
  const [adding, setAdding] = useState(false);

  const submit = (handler: (v: string) => void) => {
    const v = val.trim();
    if (!v) return;
    handler(v);
    setVal("");
    setAdding(false);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5 items-center">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border text-foreground/80 bg-surface"
          >
            {item}
            <button
              onClick={() => onRemove(item)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${item}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        {adding ? (
          <span className="inline-flex items-center gap-1">
            <Input
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(onAdd);
                if (e.key === "Escape") {
                  setVal("");
                  setAdding(false);
                }
              }}
              placeholder={placeholder}
              className="h-7 text-xs w-48"
            />
            <button
              onClick={() => submit(onAdd)}
              className="text-xs px-2 py-1 rounded border border-primary/30 text-primary hover:bg-primary-soft"
            >
              add
            </button>
            {extraAdd && (
              <button
                onClick={() => submit(extraAdd.onAdd)}
                className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground"
              >
                {extraAdd.label}
              </button>
            )}
          </span>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
          >
            <Plus className="size-3" /> add
          </button>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-border pt-5">
    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
      {title}
    </p>
    <div className="space-y-2.5">{children}</div>
  </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[8rem_1fr] gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <div className="text-foreground/90 space-y-1">{children}</div>
  </div>
);

const Todo = () => (
  <span className="text-xs italic text-muted-foreground/70">
    TODO — fill this in to sharpen your voice.
  </span>
);

const ParagraphOrTodo = ({ value, inline }: { value: string; inline?: boolean }) => {
  const isTodo = !value || value.trim().startsWith("TODO");
  if (isTodo)
    return inline ? (
      <span className="italic text-muted-foreground/70">{value || "—"}</span>
    ) : (
      <Todo />
    );
  return inline ? <span>{value}</span> : <p>{value}</p>;
};

const BulletList = ({ items }: { items: string[] }) => {
  const real = items.filter((i) => i && !i.trim().startsWith("TODO"));
  if (real.length === 0) return <Todo />;
  return (
    <ul className="space-y-1 list-disc list-inside marker:text-muted-foreground">
      {real.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
};
