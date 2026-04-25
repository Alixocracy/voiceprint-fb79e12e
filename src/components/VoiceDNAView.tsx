import type { VoiceDNA } from "@/data/types";

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

    <Section title="Hook style">
      <Field label="Pattern">{dna.hook_style.default_pattern}</Field>
      <Field label="Examples">
        <ul className="space-y-1">
          {dna.hook_style.examples.map((e) => (
            <li key={e} className="quote text-foreground/90">"{e}"</li>
          ))}
        </ul>
      </Field>
    </Section>

    <Section title="Rhythm">
      <Field label="Sentence length">{dna.rhythm.sentence_length}</Field>
      <Field label="Paragraph length">{dna.rhythm.paragraph_length}</Field>
    </Section>

    <Section title="Register">
      <Field label="Primary">{dna.register.primary}</Field>
      <Field label="Secondary">{dna.register.secondary}</Field>
      <Field label="Avoids">{dna.register.avoids.join(" · ")}</Field>
    </Section>

    <Section title="Themes">
      <div className="flex flex-wrap gap-2">
        {dna.themes.map((t) => (
          <span
            key={t}
            className="text-xs px-2.5 py-1 rounded-full bg-primary-soft text-primary border border-primary/15"
          >
            {t}
          </span>
        ))}
      </div>
    </Section>

    <Section title="Story structure">
      <Field label="Default">{dna.story_structure.default}</Field>
      <Field label="Callback">{dna.story_structure.callback_style}</Field>
    </Section>

    <Section title="CTA">
      <p className="text-sm text-foreground/85">{dna.cta_style}</p>
    </Section>

    <Section title="Never says">
      <div className="flex flex-wrap gap-1.5">
        {dna.never_says.map((n) => (
          <span
            key={n}
            className="text-xs px-2 py-0.5 rounded-md border border-border text-muted-foreground line-through"
          >
            {n}
          </span>
        ))}
      </div>
    </Section>

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
          {dna.evolution_log.slice(0, 4).map((l, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              <span className="font-mono">{l.date}</span> · {l.change}
            </li>
          ))}
        </ul>
      </Section>
    )}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-border pt-5">
    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
      {title}
    </p>
    <div className="space-y-2.5">{children}</div>
  </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[7rem_1fr] gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <div className="text-foreground/90">{children}</div>
  </div>
);
