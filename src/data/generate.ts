import type { ArchetypeSelection, Draft, VoiceDNA, VoiceSample } from "./types";

// Weights from the Mix step → numeric anchors used in the DNA.
export const weightToNumber = (w: "light" | "medium" | "heavy") =>
  w === "light" ? 0.2 : w === "medium" ? 0.4 : 0.6;

const SAMPLE_TOPICS = [
  "What I learned reviewing 40 board decks last quarter.",
  "The clearest signal a CFO is about to leave (and what it means for valuation).",
  "Why I stopped doing post-mortems the way Andy Grove taught me.",
];

export function generateVoiceDNA(opts: {
  agentName: string;
  samples: VoiceSample[];
  selections: ArchetypeSelection[];
}): VoiceDNA {
  const { agentName, selections } = opts;
  const anchors = selections.map((s) => ({
    archetype: capitalizeArchetype(s.archetypeId),
    weight: weightToNumber(s.weight),
  }));

  // Themes — pulled from the dominant archetype mix. Hand-tuned defaults.
  const themePool: Record<string, string[]> = {
    insider: ["capital allocation", "earnings narrative reading", "post-IPO governance"],
    operator: ["team formation under uncertainty", "weekly rituals", "post-PMF scaling"],
    sage: ["career compounding", "second-chapter leadership", "long arcs"],
    storyteller: ["formative moments", "decisions that mattered", "what I almost got wrong"],
    provocateur: ["consensus to challenge", "rituals that fail", "naming the elephant"],
    frameworker: ["decision frameworks", "diagnostic patterns", "operating systems"],
  };
  const themes = Array.from(
    new Set(
      selections.flatMap((s) => themePool[s.archetypeId] ?? []).slice(0, 4),
    ),
  );

  const dominant = selections[0]?.archetypeId ?? "operator";
  const hookByDominant: Record<string, { pattern: string; examples: string[] }> = {
    insider: {
      pattern: "single contrarian observation, no question marks",
      examples: ["I stopped reading earnings calls.", "Three CFOs taught me this."],
    },
    operator: {
      pattern: "specific number or ritual in the first six words",
      examples: ["I run a 25-minute exec sync.", "Six metrics. One page. Every Monday."],
    },
    storyteller: {
      pattern: "a moment, in past tense, with a person in it",
      examples: ["Last March, a former boss called me.", "I almost said no to the board seat."],
    },
    sage: {
      pattern: "an idea distilled to one short line",
      examples: ["Compounding works on relationships too.", "Patience is a strategy, not a virtue."],
    },
    provocateur: {
      pattern: "the named villain in the first sentence",
      examples: ["OKRs are the worst thing that happened to good companies."],
    },
    frameworker: {
      pattern: "a result + the framework that produces it",
      examples: ["Three lines that tell you if a deck will land.", "The 2x2 every operator should redraw monthly."],
    },
  };
  const h = hookByDominant[dominant];

  return {
    name: `${agentName} voice`,
    version: 1,
    summary: summaryForMix(selections),
    hook_style: {
      default_pattern: h.pattern,
      examples: h.examples,
    },
    rhythm: {
      sentence_length:
        "varied — alternates 6-word sentences with 25-word ones",
      paragraph_length: "1–3 sentences max",
    },
    register: {
      primary: "accessible-precise",
      secondary: "warmly authoritative",
      avoids: ["jargon for jargon's sake", "hype-y SaaS-speak"],
    },
    themes,
    story_structure: {
      default: "moment → insight → framework → callback",
      callback_style: "circle back to the opening line",
    },
    cta_style: "low-pressure DM invite, never 'let's connect'",
    never_says: [
      "leverage",
      "synergy",
      "ideate",
      "circle back",
      "let's connect",
      "thrilled to announce",
    ],
    reference_anchors: anchors,
    evolution_log: [
      { date: today(), change: "initial voice generated from onboarding" },
    ],
  };
}

function summaryForMix(selections: ArchetypeSelection[]): string {
  if (selections.length === 0) return "Quietly authoritative voice with operator instincts.";
  const lead = selections[0].archetypeId;
  const map: Record<string, string> = {
    insider: "Industry-deep voice with a banker's eye and a coach's warmth.",
    operator: "Sharp operator with specific rituals and a clean head.",
    storyteller: "Scene-led voice that earns trust through small, real moments.",
    sage: "Long-arc thinker. Patient. Idea-dense without being academic.",
    provocateur: "Confident contrarian who names what others tiptoe around.",
    frameworker: "Structural thinker. Portable ideas. Clean lines.",
  };
  return map[lead] ?? "Quietly authoritative.";
}

function capitalizeArchetype(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

const today = () => new Date().toISOString().slice(0, 10);

// "Wow moment" mock generator — three suggested topics + one fully-formed draft set.
export function suggestTopics(samples: VoiceSample[]): string[] {
  const fromSamples = samples
    .filter((s) => s.type === "story" || s.type === "bio")
    .slice(0, 1)
    .map(
      () =>
        "Based on the story you shared, you have a sharp POV on decisions made under boardroom pressure.",
    );
  return [...fromSamples, ...SAMPLE_TOPICS].slice(0, 3);
}

export function generateDraftSet(opts: {
  topic: string;
  dna: VoiceDNA;
}): Omit<Draft, "id" | "createdAt" | "status" | "thread"> {
  const { topic, dna } = opts;
  const hookExample = dna.hook_style.examples[0] ?? "I'll start here.";
  const bodyLong = `${hookExample}

For the past few months, I've been turning over a quieter version of the same question — the one behind ${stripPeriod(topic).toLowerCase()}.

Here's what I keep coming back to.

The headline answer is rarely the real one. The real one usually lives in the second meeting, after the first round of polite agreement has burned off. That's where the operating reality leaks out — in a half-sentence, in the pause before someone reframes the question.

Three patterns I've seen repeat:

One. The teams that move fastest aren't the ones with the most autonomy. They're the ones with the clearest definition of "done."

Two. Decisions framed as strategy are almost always staffing decisions wearing different clothes.

Three. The most expensive mistakes are the ones nobody books to a P&L line — the senior hire who doesn't quite fit, kept too long out of politeness.

None of these are new. But they're the ones I find myself saying again and again, in different rooms, to different leaders, who all assume they're the only one running into them.

You're not. They're the job.

If any of this resonates and you want to compare notes, my DMs are open.`;

  const bodyShort1 = `${hookExample}

The teams that move fastest aren't the ones with the most autonomy. They're the ones with the clearest definition of "done."

I keep relearning this every quarter.`;

  const bodyShort2 = `Most "strategy" decisions are staffing decisions in better clothes.

Once you see it, you can't unsee it.`;

  const hookCarousel = `Three quiet truths about ${stripPeriod(topic).toLowerCase()} — slide one of three.`;

  return { topic, bodyLong, bodyShort1, bodyShort2, hookCarousel };
}

function stripPeriod(s: string) {
  return s.replace(/\.+$/, "");
}
