/**
 * Teacher classes and topics – stored in localStorage.
 * Shared link encodes class data so students can open it without a backend.
 */

export interface TeacherClass {
  id: string;
  name: string;
  description?: string;
  topics: string[];
  tone?: "freundlich" | "formell" | "einfach";
}

const TEACHER_CLASSES_KEY = "paddy-teacher-classes";
const STUDENT_LEARNING_KEY = "paddy-student-learning";

export function getTeacherClasses(): TeacherClass[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TEACHER_CLASSES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setTeacherClasses(classes: TeacherClass[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEACHER_CLASSES_KEY, JSON.stringify(classes));
  } catch {
    /* ignore */
  }
}

export function saveTeacherClass(cls: TeacherClass): void {
  const list = getTeacherClasses();
  const idx = list.findIndex((c) => c.id === cls.id);
  const next = idx >= 0 ? [...list] : [...list, cls];
  if (idx >= 0) next[idx] = cls;
  else next[next.length - 1] = cls;
  setTeacherClasses(next);
}

export function deleteTeacherClass(id: string): void {
  setTeacherClasses(getTeacherClasses().filter((c) => c.id !== id));
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

/** Student: current learning context (from shared link or own list) */
export interface StudentLearning {
  className?: string;
  topics: string[];
  tone?: string;
}

export function getStudentLearning(): StudentLearning | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STUDENT_LEARNING_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StudentLearning;
    return data && Array.isArray(data.topics) ? data : null;
  } catch {
    return null;
  }
}

export function setStudentLearning(learning: StudentLearning): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STUDENT_LEARNING_KEY, JSON.stringify(learning));
  } catch {
    /* ignore */
  }
}
