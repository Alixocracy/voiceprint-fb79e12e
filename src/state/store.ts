import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ArchetypeSelection,
  Draft,
  ThreadEntry,
  VoiceDNA,
  VoiceSample,
} from "@/data/types";
import { generateDraftSet, generateVoiceDNA, suggestTopics } from "@/data/generate";

interface VoiceprintState {
  // onboarding flag
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
  dnaEditNote: string; // last plain-English edit instruction

  // Step 6 / Dashboard
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
  // Fake but Agnic-shaped — agent-1371 style. Confirmed wow-moment format.
  return `${slug}@agent.agnic.ai`;
};

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
          const next = { ...st.dna };
          next.evolution_log = [
            { date: new Date().toISOString().slice(0, 10), change: instruction },
            ...next.evolution_log,
          ];
          // tiny smart-rules so the user feels the edit landed
          const lower = instruction.toLowerCase();
          if (lower.includes("less corporate")) {
            next.register = {
              ...next.register,
              primary: "plain-spoken precise",
              avoids: Array.from(
                new Set([...next.register.avoids, "corporate hedging"]),
              ),
            };
          }
          if (lower.includes("never end") && lower.includes("question")) {
            next.never_says = Array.from(
              new Set([...next.never_says, "ending posts with rhetorical questions"]),
            );
          }
          if (lower.includes("shorter paragraph")) {
            next.rhythm = { ...next.rhythm, paragraph_length: "1–2 sentences max" };
          }
          return { dna: next, dnaEditNote: instruction };
        }),

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
        // simple deterministic re-spin — swap order of paragraphs and tighten
        const tightened = draft.bodyLong
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);
        // move the second paragraph after the first body paragraph for a "feel of change"
        const respun = [
          tightened[0],
          tightened[2] ?? tightened[1],
          tightened[1],
          ...tightened.slice(3),
        ]
          .filter(Boolean)
          .join("\n\n");

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
        }),
    }),
    { name: "voiceprint-v0" },
  ),
);

export { suggestTopics };
