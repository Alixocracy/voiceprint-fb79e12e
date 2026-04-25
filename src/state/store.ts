import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ArchetypeSelection,
  Draft,
  PunctuationRule,
  ThreadEntry,
  VoiceDNA,
  VoiceDNAv1,
  VoiceSample,
} from "@/data/types";
import {
  enforceBlackList,
  generateDraftSet,
  generateVoiceDNA,
  migrateDNAv1,
  scanBlackList,
  suggestTopics,
} from "@/data/generate";
import { generateDraft as agnicGenerateDraft, sendEmail as agnicSendEmail } from "@/integrations/agnic/client";
import { isAuthed } from "@/integrations/agnic/session";

interface VoiceprintState {
  onboardingComplete: boolean;

  // Step 1
  agentName: string;
  agentEmailAlias: string;
  primaryEmail: string;

  // Step 2
  samples: VoiceSample[];

  // Step 3 + 4
  selections: ArchetypeSelection[];

  // Step 5
  dna: VoiceDNA | null;
  dnaEditNote: string;
  // One-shot banner: shown the first time after a v1→v2 migration.
  migrationBannerDismissed: boolean;

  // Dashboard
  drafts: Draft[];

  // mutators
  setAgentName: (n: string) => void;
  setPrimaryEmail: (e: string) => void;
  addSample: (s: Omit<VoiceSample, "id">) => void;
  removeSample: (id: string) => void;
  setSelections: (s: ArchetypeSelection[]) => void;
  toggleArchetype: (id: ArchetypeSelection["archetypeId"]) => void;
  setSelectionWeight: (
    id: ArchetypeSelection["archetypeId"],
    w: ArchetypeSelection["weight"],
  ) => void;
  setSelectionFeature: (
    id: ArchetypeSelection["archetypeId"],
    feature: string,
    on: boolean,
  ) => void;
  buildDNA: () => void;
  updateDNAFromInstruction: (instruction: string) => void;

  // Black List mutators
  addBlackListPhrase: (phrase: string) => void;
  removeBlackListPhrase: (phrase: string) => void;
  togglePunctuationRule: (rule: PunctuationRule) => void;
  addBlackListFraming: (framing: string) => void;
  removeBlackListFraming: (framing: string) => void;
  addBlackListTone: (tone: string) => void;
  removeBlackListTone: (tone: string) => void;

  dismissMigrationBanner: () => void;

  generateInitialDraft: (topic: string) => Draft;
  createDraft: (topic: string) => Draft;
  appendThread: (draftId: string, entry: Omit<ThreadEntry, "id">) => void;
  regenerateDraft: (draftId: string, instruction: string) => void;
  approveDraft: (draftId: string) => void;
  archiveDraft: (draftId: string) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const initialAlias = (name: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24) || "editor";
  return `${slug}@agent.agnic.ai`;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export const useVoiceprint = create<VoiceprintState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      agentName: "",
      agentEmailAlias: "",
      primaryEmail: "you@yourcompany.com",
      samples: [],
      selections: [],
      dna: null,
      dnaEditNote: "",
      migrationBannerDismissed: false,
      drafts: [],

      setAgentName: (n) =>
        set({ agentName: n, agentEmailAlias: n ? initialAlias(n) : "" }),
      setPrimaryEmail: (e) => set({ primaryEmail: e }),

      addSample: (s) =>
        set((st) => ({ samples: [...st.samples, { ...s, id: newId() }] })),
      removeSample: (id) =>
        set((st) => ({ samples: st.samples.filter((s) => s.id !== id) })),

      setSelections: (s) => set({ selections: s }),
      toggleArchetype: (id) =>
        set((st) => {
          const exists = st.selections.find((s) => s.archetypeId === id);
          if (exists) {
            return { selections: st.selections.filter((s) => s.archetypeId !== id) };
          }
          if (st.selections.length >= 3) return {};
          return {
            selections: [
              ...st.selections,
              { archetypeId: id, weight: "medium", features: {} },
            ],
          };
        }),
      setSelectionWeight: (id, w) =>
        set((st) => ({
          selections: st.selections.map((s) =>
            s.archetypeId === id ? { ...s, weight: w } : s,
          ),
        })),
      setSelectionFeature: (id, feature, on) =>
        set((st) => ({
          selections: st.selections.map((s) =>
            s.archetypeId === id
              ? { ...s, features: { ...s.features, [feature]: on } }
              : s,
          ),
        })),

      buildDNA: () => {
        const { agentName, samples, selections } = get();
        set({
          dna: generateVoiceDNA({
            agentName: agentName || "Your",
            samples,
            selections,
          }),
        });
      },

      updateDNAFromInstruction: (instruction) =>
        set((st) => {
          if (!st.dna) return {};
          const next: VoiceDNA = { ...st.dna };
          next.evolution_log = [
            { date: todayISO(), change: instruction },
            ...next.evolution_log,
          ];
          const lower = instruction.toLowerCase();
          if (lower.includes("less corporate")) {
            next.writing_voice = {
              ...next.writing_voice,
              register: {
                ...next.writing_voice.register,
                primary: "plain-spoken precise",
              },
            };
            next.black_list = {
              ...next.black_list,
              framings_avoided: Array.from(
                new Set([...next.black_list.framings_avoided, "corporate hedging"]),
              ),
            };
          }
          if (lower.includes("never end") && lower.includes("question")) {
            next.black_list = {
              ...next.black_list,
              punctuation_avoid: Array.from(
                new Set([...next.black_list.punctuation_avoid, "rhetorical_question_end"]),
              ) as PunctuationRule[],
            };
          }
          if (lower.includes("shorter paragraph")) {
            next.writing_voice = {
              ...next.writing_voice,
              rhythm: {
                ...next.writing_voice.rhythm,
                paragraph_length: "1–2 sentences max",
              },
            };
          }
          return { dna: next, dnaEditNote: instruction };
        }),

      // ----- Black List mutators -----
      addBlackListPhrase: (phrase) =>
        set((st) => {
          if (!st.dna || !phrase.trim()) return {};
          const exists = st.dna.black_list.phrases_never_used.some(
            (p) => p.toLowerCase() === phrase.toLowerCase(),
          );
          if (exists) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                phrases_never_used: [...st.dna.black_list.phrases_never_used, phrase.trim()],
              },
              evolution_log: [
                { date: todayISO(), change: `added "${phrase.trim()}" to black list` },
                ...st.dna.evolution_log,
              ],
            },
          };
        }),
      removeBlackListPhrase: (phrase) =>
        set((st) => {
          if (!st.dna) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                phrases_never_used: st.dna.black_list.phrases_never_used.filter(
                  (p) => p !== phrase,
                ),
              },
            },
          };
        }),
      togglePunctuationRule: (rule) =>
        set((st) => {
          if (!st.dna) return {};
          const has = st.dna.black_list.punctuation_avoid.includes(rule);
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                punctuation_avoid: has
                  ? st.dna.black_list.punctuation_avoid.filter((r) => r !== rule)
                  : [...st.dna.black_list.punctuation_avoid, rule],
              },
            },
          };
        }),
      addBlackListFraming: (framing) =>
        set((st) => {
          if (!st.dna || !framing.trim()) return {};
          if (st.dna.black_list.framings_avoided.includes(framing.trim())) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                framings_avoided: [...st.dna.black_list.framings_avoided, framing.trim()],
              },
            },
          };
        }),
      removeBlackListFraming: (framing) =>
        set((st) => {
          if (!st.dna) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                framings_avoided: st.dna.black_list.framings_avoided.filter(
                  (f) => f !== framing,
                ),
              },
            },
          };
        }),
      addBlackListTone: (tone) =>
        set((st) => {
          if (!st.dna || !tone.trim()) return {};
          if (st.dna.black_list.tones_beneath.includes(tone.trim())) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                tones_beneath: [...st.dna.black_list.tones_beneath, tone.trim()],
              },
            },
          };
        }),
      removeBlackListTone: (tone) =>
        set((st) => {
          if (!st.dna) return {};
          return {
            dna: {
              ...st.dna,
              black_list: {
                ...st.dna.black_list,
                tones_beneath: st.dna.black_list.tones_beneath.filter((t) => t !== tone),
              },
            },
          };
        }),

      dismissMigrationBanner: () => set({ migrationBannerDismissed: true }),

      generateInitialDraft: (topic) => {
        const { dna } = get();
        if (!dna) throw new Error("DNA must be built first");
        const set0 = generateDraftSet({ topic, dna });
        const id = newId();
        const draft: Draft = {
          id,
          ...set0,
          status: "awaiting_edits",
          createdAt: new Date().toISOString(),
          thread: [
            {
              id: newId(),
              kind: "agent_note",
              at: new Date().toISOString(),
              body: "Draft sent to your inbox. Reply with edits, or say 'approve' to finalize.",
            },
          ],
        };
        set((st) => ({ drafts: [draft, ...st.drafts] }));
        return draft;
      },

      createDraft: (topic) => get().generateInitialDraft(topic),

      appendThread: (draftId, entry) =>
        set((st) => ({
          drafts: st.drafts.map((d) =>
            d.id === draftId
              ? { ...d, thread: [...d.thread, { ...entry, id: newId() }] }
              : d,
          ),
        })),

      regenerateDraft: (draftId, instruction) => {
        const { dna, drafts } = get();
        if (!dna) return;
        const draft = drafts.find((d) => d.id === draftId);
        if (!draft) return;
        const tightened = draft.bodyLong
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);
        const respun = enforceBlackList(
          [
            tightened[0],
            tightened[2] ?? tightened[1],
            tightened[1],
            ...tightened.slice(3),
          ]
            .filter(Boolean)
            .join("\n\n"),
          dna,
        );

        set((st) => ({
          drafts: st.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  bodyLong: respun,
                  thread: [
                    ...d.thread,
                    {
                      id: newId(),
                      kind: "user_reply",
                      at: new Date().toISOString(),
                      body: instruction,
                    },
                    {
                      id: newId(),
                      kind: "draft",
                      at: new Date().toISOString(),
                      body: "Revised draft sent.",
                      version: d.thread.filter((t) => t.kind === "draft").length + 2,
                    },
                  ],
                }
              : d,
          ),
        }));
      },

      approveDraft: (draftId) =>
        set((st) => ({
          drafts: st.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  status: "approved",
                  thread: [
                    ...d.thread,
                    {
                      id: newId(),
                      kind: "agent_note",
                      at: new Date().toISOString(),
                      body: "Approved. Final copy ready to paste into LinkedIn.",
                    },
                  ],
                }
              : d,
          ),
        })),

      archiveDraft: (draftId) =>
        set((st) => ({
          drafts: st.drafts.map((d) =>
            d.id === draftId ? { ...d, status: "archived" } : d,
          ),
        })),

      completeOnboarding: () => set({ onboardingComplete: true }),
      reset: () =>
        set({
          onboardingComplete: false,
          agentName: "",
          agentEmailAlias: "",
          samples: [],
          selections: [],
          dna: null,
          drafts: [],
          dnaEditNote: "",
          migrationBannerDismissed: false,
        }),
    }),
    {
      name: "voiceprint-v0",
      version: 2,
      // Migrate any persisted v1 DNA shape to v2 on load.
      migrate: (persistedState, _fromVersion) => {
        const s = persistedState as Partial<VoiceprintState> & { dna?: any };
        if (s?.dna && (s.dna.version === 1 || !s.dna.version || s.dna.never_says)) {
          try {
            s.dna = migrateDNAv1(s.dna as VoiceDNAv1);
            s.migrationBannerDismissed = false;
          } catch {
            s.dna = null;
          }
        }
        return s as VoiceprintState;
      },
    },
  ),
);

export { suggestTopics, scanBlackList };
