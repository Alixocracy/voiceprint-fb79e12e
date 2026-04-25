import type {
  ArchetypeSelection,
  Draft,
  PunctuationRule,
  VoiceDNA,
  VoiceDNAv1,
  VoiceSample,
} from "./types";

// Weights from the Mix step → numeric anchors used in the DNA.
export const weightToNumber = (w: "light" | "medium" | "heavy") =>
  w === "light" ? 0.2 : w === "medium" ? 0.4 : 0.6;

const SAMPLE_TOPICS = [
  "What I learned reviewing 40 board decks last quarter.",
  "The clearest signal a CFO is about to leave (and what it means for valuation).",
  "Why I stopped doing post-mortems the way Andy Grove taught me.",
];

// ----- Default Black List (founder-prescribed) -----
export const DEFAULT_PHRASES_BLACKLIST = [
  "leverage",
  "synergy",
  "ideate",
  "circle back",
  "let's connect",
  "thrilled to announce",
  "in today's fast-paced world",
];

export const DEFAULT_PUNCTUATION_RULES: PunctuationRule[] = ["em_dash"];

export const PUNCTUATION_RULE_LABELS: Record<PunctuationRule, string> = {
  em_dash: "Em-dash (long dash, the one that looks like this: —)",
  exclamation_marketing: "Exclamation marks in marketing tone",
  rhetorical_question_end: "Rhetorical questions at the end of posts",
};

export const ALL_PUNCTUATION_RULES: PunctuationRule[] = [
  "em_dash",
  "exclamation_marketing",
  "rhetorical_question_end",
];

const DEFAULT_FRAMINGS_AVOIDED = ["jargon for jargon's sake", "hype-y SaaS-speak"];
const DEFAULT_TONES_BENEATH = ["performative vulnerability", "humble-bragging"];

export function generateVoiceDNA(opts: {
  agentName: string;
  samples: VoiceSample[];
  selections: ArchetypeSelection[];
}): VoiceDNA {
  const { agentName, samples, selections } = opts;
  const anchors = selections.map((s) => ({
    archetype: capitalizeArchetype(s.archetypeId),
    weight: weightToNumber(s.weight),
  }));

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

  const bio = samples.find((s) => s.type === "bio")?.content ?? "";
  const bestOf = samples.find((s) => s.type === "best_of")?.content ?? "";
  const story = samples.find((s) => s.type === "story")?.content ?? "";

  return {
    name: `${agentName} voice`,
    version: 2,
    summary: summaryForMix(selections),

    core_identity: {
      worldview: bio
        ? firstParagraph(bio)
        : "TODO: in one paragraph, how you see your industry and the work of leadership inside it.",
      non_negotiable_beliefs: [
        "TODO: a belief you would defend in an argument with a peer.",
      ],
      industry_pov:
        "TODO: the contrarian point of view that would split a room of your peers.",
      changed_mind_about: [
        "TODO: something you believed two years ago and have since revised.",
      ],
      audience: {
        person_description: bio
          ? "Inferred from your bio — a specific person who gets value from your expertise. Edit to sharpen."
          : "TODO: describe one specific person who gets value from your expertise.",
        common_misbelief: "TODO: what this audience consistently gets wrong.",
        what_they_resist_hearing:
          "TODO: what this audience hears, accepts, and still does not act on.",
      },
      differentiation:
        "TODO: what makes you different from everyone else writing on this topic. Specific, not modest.",
    },

    writing_voice: {
      three_words: threeWordsFor(dominant),
      hook_style: { pattern: h.pattern, examples: h.examples },
      rhythm: {
        sentence_length: "varied — alternates 6-word sentences with 25-word ones",
        paragraph_length: "1–3 sentences max",
      },
      register: {
        primary: "accessible-precise",
        secondary: "warmly authoritative",
      },
      transitions: "short connective sentences, never section headings",
      story_structure: {
        default: "moment then insight then framework then callback",
        callback_style: "circle back to the opening line",
      },
      cta_style: "low-pressure DM invite, never 'let's connect'",
    },

    black_list: {
      phrases_never_used: [...DEFAULT_PHRASES_BLACKLIST],
      punctuation_avoid: [...DEFAULT_PUNCTUATION_RULES],
      framings_avoided: [...DEFAULT_FRAMINGS_AVOIDED],
      tones_beneath: [...DEFAULT_TONES_BENEATH],
    },

    quality_control: {
      always: [
        "Open with a single concrete observation.",
        "Show the wiring of a decision, not only the outcome.",
        "End with a real take, not a question.",
      ],
      never: [
        "Use em-dash punctuation. Use commas, periods, parentheses, or colons instead.",
        "Use any phrase listed in the Black List.",
        "Open with 'I'm thrilled to announce'.",
        "End with 'let's connect' or 'DM me'.",
      ],
      voice_calibration_quotes: extractCalibrationQuotes([bestOf, story, bio]),
    },

    reference_anchors: anchors,
    evolution_log: [
      { date: today(), change: "initial voice generated from onboarding" },
    ],
  };
}

function threeWordsFor(dominant: string): string[] {
  const map: Record<string, string[]> = {
    insider: ["sharp", "contextual", "warm"],
    operator: ["specific", "tactical", "honest"],
    storyteller: ["scene-led", "warm", "earned"],
    sage: ["patient", "idea-dense", "calm"],
    provocateur: ["contrarian", "named", "unflinching"],
    frameworker: ["structural", "clean", "portable"],
  };
  return map[dominant] ?? ["clear", "specific", "warm"];
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

function firstParagraph(s: string) {
  const p = s.split(/\n\s*\n/)[0]?.trim() ?? s;
  return p.length > 600 ? p.slice(0, 600) + "…" : p;
}

function extractCalibrationQuotes(sources: string[]): string[] {
  const sentences: string[] = [];
  for (const src of sources) {
    if (!src) continue;
    const found = src
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 30 && s.length <= 180);
    sentences.push(...found);
    if (sentences.length >= 3) break;
  }
  if (sentences.length < 3) {
    return [
      "TODO: paste a sentence from your writing that captures your rhythm.",
      "TODO: one more anchor sentence that sounds unmistakably like you.",
      "TODO: a third sentence — short, plain, yours.",
    ];
  }
  return sentences.slice(0, 3);
}

function capitalizeArchetype(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

const today = () => new Date().toISOString().slice(0, 10);

// ---------- v1 → v2 migration ----------
export function migrateDNAv1(v1: VoiceDNAv1): VoiceDNA {
  const evolution = [
    {
      date: today(),
      change:
        "schema migrated from v1 to v2; em-dash added to punctuation_avoid by default",
    },
    ...v1.evolution_log,
  ];
  return {
    name: v1.name,
    version: 2,
    summary: v1.summary,
    core_identity: {
      worldview: "",
      non_negotiable_beliefs: [],
      industry_pov: "",
      changed_mind_about: [],
      audience: {
        person_description: "",
        common_misbelief: "",
        what_they_resist_hearing: "",
      },
      differentiation: "",
    },
    writing_voice: {
      three_words: [],
      hook_style: {
        pattern: v1.hook_style.default_pattern,
        examples: v1.hook_style.examples,
      },
      rhythm: v1.rhythm,
      register: { primary: v1.register.primary, secondary: v1.register.secondary },
      transitions: "short connective sentences, never section headings",
      story_structure: v1.story_structure,
      cta_style: v1.cta_style,
    },
    black_list: {
      phrases_never_used: v1.never_says ?? [],
      punctuation_avoid: ["em_dash"],
      framings_avoided: v1.register.avoids ?? [],
      tones_beneath: [],
    },
    quality_control: {
      always: [],
      never: [],
      voice_calibration_quotes: [],
    },
    reference_anchors: v1.reference_anchors,
    evolution_log: evolution,
  };
}

// Returns true if the DNA has empty Core Identity or Quality Control sections
// (i.e. it was migrated and the user has not filled them in yet).
export function dnaHasEmptyMigratedSections(dna: VoiceDNA): boolean {
  const ci = dna.core_identity;
  const ciEmpty =
    !ci.worldview &&
    ci.non_negotiable_beliefs.length === 0 &&
    !ci.industry_pov &&
    !ci.differentiation;
  const qc = dna.quality_control;
  const qcEmpty =
    qc.always.length === 0 && qc.never.length === 0 && qc.voice_calibration_quotes.length === 0;
  return ciEmpty || qcEmpty;
}

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

// ---------- Black List enforcement ----------
const PUNCTUATION_PATTERNS: Record<PunctuationRule, RegExp> = {
  em_dash: /\u2014/g,
  exclamation_marketing: /!/g,
  rhetorical_question_end: /\?\s*$/m,
};

export interface BlackListViolation {
  kind: "phrase" | "punctuation";
  value: string; // the phrase or rule id
  label: string; // human readable
}

export function scanBlackList(text: string, dna: VoiceDNA): BlackListViolation[] {
  const violations: BlackListViolation[] = [];
  const lower = text.toLowerCase();
  for (const phrase of dna.black_list.phrases_never_used) {
    if (!phrase.trim()) continue;
    if (lower.includes(phrase.toLowerCase())) {
      violations.push({ kind: "phrase", value: phrase, label: phrase });
    }
  }
  for (const rule of dna.black_list.punctuation_avoid) {
    const pattern = PUNCTUATION_PATTERNS[rule];
    if (pattern && pattern.test(text)) {
      violations.push({
        kind: "punctuation",
        value: rule,
        label: PUNCTUATION_RULE_LABELS[rule],
      });
    }
  }
  return violations;
}

// Strip Black List violations from generated text. Mirrors what a retry would do
// in a real LLM loop — used for the local mock so the acceptance tests pass.
export function enforceBlackList(text: string, dna: VoiceDNA): string {
  let out = text;
  // Em-dash → comma+space (per founder instruction: use commas/periods/parens/colons).
  if (dna.black_list.punctuation_avoid.includes("em_dash")) {
    out = out.replace(/\s*\u2014\s*/g, ", ");
  }
  if (dna.black_list.punctuation_avoid.includes("exclamation_marketing")) {
    out = out.replace(/!/g, ".");
  }
  if (dna.black_list.punctuation_avoid.includes("rhetorical_question_end")) {
    out = out.replace(/\?(\s*)$/gm, ".$1");
  }
  for (const phrase of dna.black_list.phrases_never_used) {
    if (!phrase.trim()) continue;
    const re = new RegExp(escapeRegExp(phrase), "gi");
    out = out.replace(re, "[…]");
  }
  return out;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function generateDraftSet(opts: {
  topic: string;
  dna: VoiceDNA;
}): Omit<Draft, "id" | "createdAt" | "status" | "thread"> {
  const { topic, dna } = opts;
  const hookExample = dna.writing_voice.hook_style.examples[0] ?? "I'll start here.";
  const bodyLongRaw = `${hookExample}

For the past few months, I've been turning over a quieter version of the same question, the one behind ${stripPeriod(topic).toLowerCase()}.

Here's what I keep coming back to.

The headline answer is rarely the real one. The real one usually lives in the second meeting, after the first round of polite agreement has burned off. That's where the operating reality leaks out, in a half-sentence, in the pause before someone reframes the question.

Three patterns I've seen repeat:

One. The teams that move fastest aren't the ones with the most autonomy. They're the ones with the clearest definition of "done."

Two. Decisions framed as strategy are almost always staffing decisions wearing different clothes.

Three. The most expensive mistakes are the ones nobody books to a P&L line, the senior hire who doesn't quite fit, kept too long out of politeness.

None of these are new. But they're the ones I find myself saying again and again, in different rooms, to different leaders, who all assume they're the only one running into them.

You're not. They're the job.

If any of this resonates and you want to compare notes, my DMs are open.`;

  const bodyShort1Raw = `${hookExample}

The teams that move fastest aren't the ones with the most autonomy. They're the ones with the clearest definition of "done."

I keep relearning this every quarter.`;

  const bodyShort2Raw = `Most "strategy" decisions are staffing decisions in better clothes.

Once you see it, you can't unsee it.`;

  const hookCarouselRaw = `Three quiet truths about ${stripPeriod(topic).toLowerCase()}, slide one of three.`;

  // Post-generation Black List enforcement (simulates the retry loop).
  return {
    topic,
    bodyLong: enforceBlackList(bodyLongRaw, dna),
    bodyShort1: enforceBlackList(bodyShort1Raw, dna),
    bodyShort2: enforceBlackList(bodyShort2Raw, dna),
    hookCarousel: enforceBlackList(hookCarouselRaw, dna),
  };
}

function stripPeriod(s: string) {
  return s.replace(/\.+$/, "");
}

// ---------- Generation prompt rendering (for AI gateway) ----------
// This is what every Agnic AI Gateway call should send as system context.
export function renderGenerationSystemPrompt(dna: VoiceDNA): string {
  const ci = dna.core_identity;
  const wv = dna.writing_voice;
  const bl = dna.black_list;
  const qc = dna.quality_control;

  return `[CORE IDENTITY]
Worldview: ${ci.worldview}
Non-negotiable beliefs: ${ci.non_negotiable_beliefs.join("; ")}
Industry POV: ${ci.industry_pov}
What I changed my mind about: ${ci.changed_mind_about.join("; ")}
My audience: ${ci.audience.person_description} | They commonly believe: ${ci.audience.common_misbelief} | They resist hearing: ${ci.audience.what_they_resist_hearing}
What makes me different: ${ci.differentiation}

[WRITING VOICE]
Three words for how I write: ${wv.three_words.join(", ")}
Hook style: ${wv.hook_style.pattern}
Rhythm: ${wv.rhythm.sentence_length}; paragraphs ${wv.rhythm.paragraph_length}
Register: ${wv.register.primary}, ${wv.register.secondary}
Transitions: ${wv.transitions}
Story structure: ${wv.story_structure.default}; callbacks ${wv.story_structure.callback_style}
CTA style: ${wv.cta_style}

[THE BLACK LIST] STRICT RULES. DO NOT VIOLATE EVEN ONCE.
- Never use any of these phrases or words: ${bl.phrases_never_used.join(", ")}
- Never use any of these punctuation marks: ${bl.punctuation_avoid.map((r) => PUNCTUATION_RULE_LABELS[r]).join(", ")}
- Never use these framings: ${bl.framings_avoided.join(", ")}
- Never adopt these tones: ${bl.tones_beneath.join(", ")}
If a sentence would naturally use any of these, rewrite the sentence.

Before responding, scan your draft for any item in the Black List. If found, rewrite that sentence. The Black List is a hard constraint, not a preference.

[QUALITY CONTROL]
Always:
${qc.always.map((a) => `- ${a}`).join("\n")}

Never:
${qc.never.map((n) => `- ${n}`).join("\n")}

Voice calibration quotes (your output should match the rhythm and feel of these):
${qc.voice_calibration_quotes.map((q) => `- "${q}"`).join("\n")}`;
}

export const VOICE_DNA_FRAMING_LINE =
  "Voice DNA is part of context architecture, not prompt engineering. A system prompt is instructions. Voice DNA is evidence.";
