// The six Voiceprint archetypes. User-facing copy only.
// Internal training references stay internal — never surfaced in UI.

export type ArchetypeId =
  | "frameworker"
  | "storyteller"
  | "operator"
  | "provocateur"
  | "sage"
  | "insider";

export interface Archetype {
  id: ArchetypeId;
  name: string;
  oneLiner: string;
  quote: string;
  bestFor: string;
  tags: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "frameworker",
    name: "The Frameworker",
    oneLiner: "Clear, structural, portable.",
    quote:
      "Most strategy decks fail at slide 3. Here's the three-line test that catches it.",
    bestFor: "Consulting partners. Operators who think in 2×2s.",
    tags: ["framework-led", "single-idea", "structured", "numbered-list"],
  },
  {
    id: "storyteller",
    name: "The Storyteller",
    oneLiner: "Warm, scene-led, human.",
    quote:
      "I almost said no to the board seat. Three years later, it's the most important decision I've made about leadership.",
    bestFor: "Coaches. Founders rebuilding after a hard exit.",
    tags: ["story-first", "warm", "vulnerable", "soft-CTA"],
  },
  {
    id: "operator",
    name: "The Operator",
    oneLiner: "Tactical, specific, generous with detail.",
    quote:
      "I run a 25-minute exec sync every Friday. Same agenda for four years. This is it.",
    bestFor: "Product leaders. COOs. Engineers turned execs.",
    tags: ["tactical", "specific", "how-to", "ritual-driven"],
  },
  {
    id: "provocateur",
    name: "The Provocateur",
    oneLiner: "Sharp, opinionated, named villain.",
    quote:
      "OKRs are the worst thing that happened to good companies. They reward theater over outcomes.",
    bestFor: "Investors. Founders with a strong POV.",
    tags: ["contrarian", "opinionated", "sharp", "named-villain"],
  },
  {
    id: "sage",
    name: "The Sage",
    oneLiner: "Philosophical, long-arc, patient.",
    quote:
      "Compounding is the most misunderstood force in a career. We talk about it in money. We rarely apply it to relationships.",
    bestFor: "Late-career executives. Second-chapter leaders.",
    tags: ["philosophical", "long-form", "idea-dense", "calm"],
  },
  {
    id: "insider",
    name: "The Insider",
    oneLiner: "Industry-deep, names named, contextual.",
    quote:
      "Everyone's reading the wrong line in the latest fintech earnings. The footnote on transaction reserves is where the story is.",
    bestFor: "Finance leaders. Fintech operators. Public-company watchers.",
    tags: ["industry-deep", "named", "contextual", "citation-heavy"],
  },
];

export const FEATURE_TOGGLES = [
  { id: "single_line_hooks", label: "Single-line hooks" },
  { id: "open_with_story", label: "Open with a story" },
  { id: "frameworks_numbered", label: "Number the framework steps" },
  { id: "contrarian_opening", label: "Contrarian opening" },
  { id: "soft_dm_cta", label: "Soft DM-invite CTA" },
  { id: "noticed_observations", label: '"I noticed…" observations' },
] as const;
