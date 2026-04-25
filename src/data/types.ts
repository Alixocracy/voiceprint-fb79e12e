import type { ArchetypeId } from "./archetypes";

export type Weight = "light" | "medium" | "heavy";

export interface VoiceSample {
  id: string;
  type: "best_of" | "story" | "bio" | "long_form";
  title?: string;
  content: string;
}

export interface ArchetypeSelection {
  archetypeId: ArchetypeId;
  weight: Weight;
  features: Record<string, boolean>;
}

// ---------- Voice DNA v2 ----------
// Four sections: Core Identity, Writing Voice, Black List, Quality Control.
// Framing: "Voice DNA is part of context architecture, not prompt engineering."

export interface VoiceDNACoreIdentity {
  worldview: string;
  non_negotiable_beliefs: string[];
  industry_pov: string;
  changed_mind_about: string[];
  audience: {
    person_description: string;
    common_misbelief: string;
    what_they_resist_hearing: string;
  };
  differentiation: string;
}

export interface VoiceDNAWritingVoice {
  three_words: string[];
  hook_style: { pattern: string; examples: string[] };
  rhythm: { sentence_length: string; paragraph_length: string };
  register: { primary: string; secondary: string };
  transitions: string;
  story_structure: { default: string; callback_style: string };
  cta_style: string;
}

export type PunctuationRule = "em_dash" | "exclamation_marketing" | "rhetorical_question_end";

export interface VoiceDNABlackList {
  phrases_never_used: string[];
  // Persisted as strings — defines which punctuation rules are active.
  punctuation_avoid: PunctuationRule[];
  framings_avoided: string[];
  tones_beneath: string[];
}

export interface VoiceDNAQualityControl {
  always: string[];
  never: string[];
  voice_calibration_quotes: string[];
}

export interface VoiceDNA {
  name: string;
  version: 2;
  summary: string;
  core_identity: VoiceDNACoreIdentity;
  writing_voice: VoiceDNAWritingVoice;
  black_list: VoiceDNABlackList;
  quality_control: VoiceDNAQualityControl;
  reference_anchors: { archetype: string; weight: number }[];
  evolution_log: { date: string; change: string }[];
}

// ---------- Legacy v1 (for migration only) ----------
export interface VoiceDNAv1 {
  name: string;
  version: 1;
  summary: string;
  hook_style: { default_pattern: string; examples: string[] };
  rhythm: { sentence_length: string; paragraph_length: string };
  register: { primary: string; secondary: string; avoids: string[] };
  themes: string[];
  story_structure: { default: string; callback_style: string };
  cta_style: string;
  never_says: string[];
  reference_anchors: { archetype: string; weight: number }[];
  evolution_log: { date: string; change: string }[];
}

export type DraftStatus =
  | "drafting"
  | "awaiting_edits"
  | "approved"
  | "archived"
  | "cancelled";

export interface Draft {
  id: string;
  topic: string;
  bodyLong: string;
  bodyShort1: string;
  bodyShort2: string;
  hookCarousel: string;
  status: DraftStatus;
  createdAt: string;
  thread: ThreadEntry[];
}

export interface ThreadEntry {
  id: string;
  kind: "draft" | "user_reply" | "agent_note";
  at: string;
  body: string;
  version?: number;
}
