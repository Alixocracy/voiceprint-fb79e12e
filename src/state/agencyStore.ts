import { create } from "zustand";
import { persist } from "zustand/middleware";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// ----- My Documents -----
export interface Folder {
  id: string;
  parent_folder_id: string | null;
  name: string;
  created_at: string;
}

export type DocType = "file" | "link" | "note";
export type ExtractionStatus = "ok" | "failed" | "pending" | "manual";

export interface DocumentItem {
  id: string;
  folder_id: string;
  name: string;
  type: DocType;
  source_url?: string;
  text_content: string;
  text_extraction_status: ExtractionStatus;
  size_chars: number;
  created_at: string;
}

// ----- 7 Systems progress -----
// Keyed by `${week}:${task_index}`
export type WeekTaskKey = string;

export interface WeeklyCheckin {
  week_number: number;
  text: string;
  updated_at: string;
}

// ----- My Voice chat -----
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string;
  reference_doc_ids?: string[];
  reference_truncated?: boolean;
}

interface AgencyState {
  // Documents
  folders: Folder[];
  documents: DocumentItem[];
  createFolder: (name: string, parent?: string | null) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  addDocument: (d: Omit<DocumentItem, "id" | "created_at" | "size_chars"> & { size_chars?: number }) => DocumentItem;
  updateDocumentText: (id: string, text: string, status?: ExtractionStatus) => void;
  deleteDocument: (id: string) => void;
  documentsInFolder: (folder_id: string) => DocumentItem[];

  // My Agents
  installedSkillSlugs: string[];
  notifySkillSlugs: string[];
  installSkill: (slug: string) => void;
  uninstallSkill: (slug: string) => void;
  toggleNotify: (slug: string) => void;

  // 7 Systems
  taskCompletion: Record<WeekTaskKey, string>; // value = ISO completed_at
  checkins: Record<number, WeeklyCheckin>;     // by week_number
  signupAt: string | null;                     // for "current week" calc; set on first visit
  ensureSignup: () => void;
  toggleTask: (week: number, taskIdx: number) => void;
  isTaskComplete: (week: number, taskIdx: number) => boolean;
  setCheckin: (week: number, text: string) => void;
  weeksWithProgress: () => number;

  // My Voice chat
  chatMessages: ChatMessage[];
  pinnedFolderId: string | null;
  setPinnedFolder: (id: string | null) => void;
  appendChatMessage: (m: Omit<ChatMessage, "id" | "at"> & { id?: string; at?: string }) => ChatMessage;
  updateChatMessage: (id: string, patch: Partial<ChatMessage>) => void;
  clearChat: () => void;
}

export const useAgency = create<AgencyState>()(
  persist(
    (set, get) => ({
      // Documents
      folders: [],
      documents: [],
      createFolder: (name, parent = null) => {
        const f: Folder = {
          id: newId(),
          parent_folder_id: parent ?? null,
          name: name.trim() || "Untitled",
          created_at: new Date().toISOString(),
        };
        set((s) => ({ folders: [...s.folders, f] }));
        return f;
      },
      renameFolder: (id, name) =>
        set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, name } : f)) })),
      deleteFolder: (id) =>
        set((s) => {
          // Cascade: collect descendant folder ids
          const allIds = new Set<string>([id]);
          let added = true;
          while (added) {
            added = false;
            for (const f of s.folders) {
              if (f.parent_folder_id && allIds.has(f.parent_folder_id) && !allIds.has(f.id)) {
                allIds.add(f.id);
                added = true;
              }
            }
          }
          return {
            folders: s.folders.filter((f) => !allIds.has(f.id)),
            documents: s.documents.filter((d) => !allIds.has(d.folder_id)),
          };
        }),
      addDocument: (d) => {
        const doc: DocumentItem = {
          id: newId(),
          folder_id: d.folder_id,
          name: d.name,
          type: d.type,
          source_url: d.source_url,
          text_content: d.text_content,
          text_extraction_status: d.text_extraction_status,
          size_chars: d.size_chars ?? d.text_content.length,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ documents: [doc, ...s.documents] }));
        return doc;
      },
      updateDocumentText: (id, text, status) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id
              ? {
                  ...d,
                  text_content: text,
                  size_chars: text.length,
                  text_extraction_status: status ?? "manual",
                }
              : d,
          ),
        })),
      deleteDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
      documentsInFolder: (folder_id) =>
        get().documents.filter((d) => d.folder_id === folder_id),

      // My Agents — three skills are installed by default to match the "My Voice"
      // status board; users can install more (currently no-op for coming_soon).
      installedSkillSlugs: ["voice-dna", "long-form-writer", "short-form-derivatives"],
      notifySkillSlugs: [],
      installSkill: (slug) =>
        set((s) => ({
          installedSkillSlugs: s.installedSkillSlugs.includes(slug)
            ? s.installedSkillSlugs
            : [...s.installedSkillSlugs, slug],
        })),
      uninstallSkill: (slug) =>
        set((s) => ({ installedSkillSlugs: s.installedSkillSlugs.filter((x) => x !== slug) })),
      toggleNotify: (slug) =>
        set((s) => ({
          notifySkillSlugs: s.notifySkillSlugs.includes(slug)
            ? s.notifySkillSlugs.filter((x) => x !== slug)
            : [...s.notifySkillSlugs, slug],
        })),

      // 7 Systems
      taskCompletion: {},
      checkins: {},
      signupAt: null,
      ensureSignup: () =>
        set((s) => (s.signupAt ? {} : { signupAt: new Date().toISOString() })),
      toggleTask: (week, taskIdx) =>
        set((s) => {
          const key = `${week}:${taskIdx}`;
          const next = { ...s.taskCompletion };
          if (next[key]) delete next[key];
          else next[key] = new Date().toISOString();
          return { taskCompletion: next };
        }),
      isTaskComplete: (week, taskIdx) => Boolean(get().taskCompletion[`${week}:${taskIdx}`]),
      setCheckin: (week, text) =>
        set((s) => ({
          checkins: {
            ...s.checkins,
            [week]: { week_number: week, text, updated_at: new Date().toISOString() },
          },
        })),
      weeksWithProgress: () => {
        const tc = get().taskCompletion;
        const weeks = new Set<number>();
        Object.keys(tc).forEach((k) => weeks.add(Number(k.split(":")[0])));
        return weeks.size;
      },

      // Chat
      chatMessages: [],
      pinnedFolderId: null,
      setPinnedFolder: (id) => set({ pinnedFolderId: id }),
      appendChatMessage: (m) => {
        const msg: ChatMessage = {
          id: m.id ?? newId(),
          role: m.role,
          content: m.content,
          at: m.at ?? new Date().toISOString(),
          reference_doc_ids: m.reference_doc_ids,
          reference_truncated: m.reference_truncated,
        };
        set((s) => ({ chatMessages: [...s.chatMessages, msg] }));
        return msg;
      },
      updateChatMessage: (id, patch) =>
        set((s) => ({
          chatMessages: s.chatMessages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      clearChat: () => set({ chatMessages: [], pinnedFolderId: null }),
    }),
    {
      name: "voiceprint-agency-v1",
      version: 1,
    },
  ),
);

// Compute the current week (1-12) from signup date.
export function currentWeek(signupAt: string | null): number {
  if (!signupAt) return 1;
  const start = new Date(signupAt).getTime();
  const diffDays = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  const w = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(12, w));
}
