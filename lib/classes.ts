/**
 * Teacher classes and topics – stored in Zustand (with localStorage persistence).
 * Shared link encodes class data so students can open it without a backend.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StudentNote {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonAssignment {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  topic: string;
  durationMinutes: number;
  completedAt: string;
}

export interface TeacherClass {
  id: string;
  name: string;
  description?: string;
  topics: string[];
  tone?: "freundlich" | "formell" | "einfach";
  lessons?: LessonAssignment[];
}

/** Payload we put in the shared link (no backend – URL holds the data) */
export interface SharedClassPayload {
  className: string;
  topics: string[];
  tone?: string;
}

export function encodeSharedPayload(payload: SharedClassPayload): string {
  const json = JSON.stringify(payload);
  if (typeof window === "undefined") return "";
  return btoa(encodeURIComponent(json)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharedPayload(encoded: string): SharedClassPayload | null {
  try {
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(padded));
    const data = JSON.parse(json) as SharedClassPayload;
    if (!data?.className || !Array.isArray(data?.topics)) return null;
    return { className: data.className, topics: data.topics, tone: data.tone };
  } catch {
    return null;
  }
}

export interface MoodEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  mood: 1 | 2 | 3 | 4 | 5; // 1=very bad, 5=great
  timestamp: string; // full ISO timestamp
}

/** Student: current learning context (from shared link or own list) */
export interface StudentLearning {
  className?: string;
  topics: string[];
  tone?: string;
  /**
   * Optional per-topic status, mapped by topic string.
   * UI uses this to show Offen / In Arbeit / Verstanden chips.
   */
  statuses?: Record<string, "open" | "in_progress" | "done">;
}

interface ClassesState {
  teacherClasses: TeacherClass[];
  studentLearning: StudentLearning | null;
  studentClassId?: string;
  studentClassName?: string;
  studentCompletedLessons: string[];
  studentNotes: StudentNote[];
  setTeacherClasses: (classes: TeacherClass[]) => void;
  setStudentLearning: (learning: StudentLearning | null) => void;
  setStudentClass: (name: string, classId?: string) => void;
  toggleLessonCompleted: (lessonId: string) => void;
  addNote: (topic: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  studySessions: StudySession[];
  addStudySession: (topic: string, durationMinutes: number) => void;
  studentMoods: MoodEntry[];
  addMood: (mood: 1 | 2 | 3 | 4 | 5) => void;
}

export const useClassesStore = create<ClassesState>()(
  persist(
    (set) => ({
      teacherClasses: [],
      studentLearning: null,
      studentClassId: undefined,
      studentClassName: undefined,
      studentCompletedLessons: [],
      studentNotes: [],
      setTeacherClasses: (classes) => set({ teacherClasses: classes }),
      setStudentLearning: (learning) => set({ studentLearning: learning }),
      setStudentClass: (name, classId) =>
        set({
          studentClassName: name,
          studentClassId: classId,
          // reset completed lessons when switching classes
          studentCompletedLessons: [],
        }),
      toggleLessonCompleted: (lessonId) =>
        set((state) => {
          const exists = state.studentCompletedLessons.includes(lessonId);
          return {
            studentCompletedLessons: exists
              ? state.studentCompletedLessons.filter((id) => id !== lessonId)
              : [...state.studentCompletedLessons, lessonId],
          };
        }),
      addNote: (topic) =>
        set((state) => ({
          studentNotes: [
            ...state.studentNotes,
            {
              id: crypto.randomUUID(),
              topic,
              content: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateNote: (id, content) =>
        set((state) => ({
          studentNotes: state.studentNotes.map((n) =>
            n.id === id
              ? { ...n, content, updatedAt: new Date().toISOString() }
              : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          studentNotes: state.studentNotes.filter((n) => n.id !== id),
        })),
      studySessions: [],
      addStudySession: (topic, durationMinutes) =>
        set((state) => ({
          studySessions: [
            ...state.studySessions,
            {
              id: crypto.randomUUID(),
              topic,
              durationMinutes,
              completedAt: new Date().toISOString(),
            },
          ],
        })),
      studentMoods: [],
      addMood: (mood) =>
        set((state) => {
          const today = new Date().toISOString().split("T")[0];
          // Replace today's entry if it already exists
          const filtered = state.studentMoods.filter((m) => m.date !== today);
          return {
            studentMoods: [
              ...filtered,
              { date: today, mood, timestamp: new Date().toISOString() },
            ],
          };
        }),
    }),
    {
      name: "naggy-classes",
    }
  )
);
