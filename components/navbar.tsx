"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart3, MessageSquare, Flame, LogOut, GraduationCap, UserRound, Users, BookMarked } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="no-print sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl rounded-2xl bg-card/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-lg">
        <div className="flex h-16 items-center justify-between px-6">
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
          <div className="flex items-center gap-1 sm:gap-2">
            {!isLoading && user && (
              <>
                <span className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground border border-border/60 bg-muted/30">
                  {user.role === "lehrer" ? (
                    <GraduationCap className="h-4 w-4 text-primary" />
                  ) : (
                    <UserRound className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium text-foreground">{user.name}</span>
                  <span className="text-xs">({user.role === "lehrer" ? "Lehrer" : "Schüler"})</span>
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
            {user?.role === "lehrer" && (
              <>
                <Link
                  href="/lehrer/klassen"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <Users className="h-4 w-4 hidden sm:block" />
                  Meine Klassen
                </Link>
                <Link
                  href="/lesson-planner"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 hidden sm:block" />
                  Lesson Planner
                </Link>
                <Link
                  href="/insights"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4 hidden sm:block" />
                  Insights
                </Link>
              </>
            )}
            {user?.role === "schüler" && (
              <Link
                href="/lernen"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <BookMarked className="h-4 w-4 hidden sm:block" />
                Lernen
              </Link>
            )}
            <Link
              href="/magic-chat"
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 hidden sm:block" />
              Magic Chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
