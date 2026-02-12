"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BarChart3,
  MessageSquare,
  Flame,
  LogOut,
  GraduationCap,
  UserRound,
  Users,
  BookMarked,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
    setOpen(false);
  }

  const isLehrer = user?.role === "lehrer";
  const isSchueler = user?.role === "schüler";

  return (
    <nav className="no-print sticky top-0 z-50 w-full px-4 pt-4">
      <div className="mx-auto max-w-7xl rounded-2xl bg-card/70 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-lg">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl cursor-pointer"
          >
            <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-md group-hover:shadow-primary/30 transition-shadow duration-300">
              <Flame className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Naga<span className="text-primary ml-0.5">Codex</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
            {!isLoading && user && (
              <>
                <span className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground border border-border/60 bg-muted/30">
                  {isLehrer ? (
                    <GraduationCap className="h-4 w-4 text-primary" />
                  ) : (
                    <UserRound className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium text-foreground max-w-[10rem] truncate">
                    {user.name}
                  </span>
                  <span className="text-xs">
                    ({isLehrer ? "Lehrer" : "Schüler"})
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Abmelden
                </Button>
              </>
            )}
            {isLehrer && (
              <>
                <Link
                  href="/lehrer/klassen"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  Meine Klassen
                </Link>
                <Link
                  href="/lesson-planner"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  Lesson Planner
                </Link>
                <Link
                  href="/insights"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  Insights
                </Link>
              </>
            )}
            {isSchueler && (
              <Link
                href="/lernen"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <BookMarked className="h-4 w-4" />
                Lernen
              </Link>
            )}
            <Link
              href="/magic-chat"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Magic Chat
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/70 text-foreground shadow-sm hover:bg-muted/80 transition-colors"
              aria-label="Navigation umschalten"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
            {!isLoading && user && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  {isLehrer ? (
                    <GraduationCap className="h-4 w-4 text-primary" />
                  ) : (
                    <UserRound className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium text-foreground truncate max-w-[9rem]">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {isLehrer ? "Lehrer" : "Schüler"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Abmelden
                </button>
              </div>
            )}
            {isLehrer && (
              <>
                <Link
                  href="/lehrer/klassen"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Meine Klassen
                </Link>
                <Link
                  href="/lesson-planner"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Lesson Planner
                </Link>
                <Link
                  href="/insights"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Insights
                </Link>
              </>
            )}
            {isSchueler && (
              <Link
                href="/lernen"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
              >
                <BookMarked className="h-4 w-4" />
                Lernen
              </Link>
            )}
            <Link
              href="/magic-chat"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Magic Chat
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
