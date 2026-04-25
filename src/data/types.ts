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

export interface VoiceDNA {
  name: string;
  version: number;
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
