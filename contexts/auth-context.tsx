"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "lehrer" | "schüler";

export interface AuthUser {
  role: Role;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  hasHydrated: boolean;
  login: (role: Role, name: string) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

const useAuthStoreInternal = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: (role, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set({ user: { role, name: trimmed } });
      },
      logout: () => set({ user: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "naggy-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Zustand is global; this is just a semantic wrapper for the app tree.
  return children;
}

export function useAuth() {
  const user = useAuthStoreInternal((s) => s.user);
  const hasHydrated = useAuthStoreInternal((s) => s.hasHydrated);
  const login = useAuthStoreInternal((s) => s.login);
  const logout = useAuthStoreInternal((s) => s.logout);

  return {
    user,
    isLoading: !hasHydrated,
    login,
    logout,
  };
}
