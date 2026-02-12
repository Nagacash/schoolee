import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatLanguage = "en" | "ar" | "tr" | "uk" | null;

export interface ChatMessageRecord {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  createdAt: string;
  title: string;
  topic?: string | null;
  language: ChatLanguage;
  messages: ChatMessageRecord[];
}

interface ChatStoreState {
  sessions: ChatSession[];
  upsertSession: (session: ChatSession) => void;
  deleteSession: (id: string) => void;
  clearSessions: () => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      upsertSession: (session) => {
        const existing = get().sessions;
        const idx = existing.findIndex((s) => s.id === session.id);
        if (idx === -1) {
          set({ sessions: [{ ...session }, ...existing] });
        } else {
          const current = existing[idx];
          const updated: ChatSession = {
            ...current,
            ...session,
            createdAt: current.createdAt,
          };
          const next = [...existing];
          next[idx] = updated;
          set({ sessions: next });
        }
      },
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      clearSessions: () => set({ sessions: [] }),
    }),
    {
      name: "naggy-magic-chat-history",
    }
  )
);

