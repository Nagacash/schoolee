import Link from "next/link";
import { BookOpen, BarChart3, MessageSquare, Sparkles, Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="no-print mt-auto bg-card/40 backdrop-blur-xl">
      <div className="bg-gradient-to-r from-transparent via-primary/30 to-transparent h-px" />
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 w-fit cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-md group-hover:shadow-primary/30 transition-shadow duration-300">
                <Flame className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Naga<span className="text-primary ml-0.5">Codex</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Deine coole Schul-App – Stunden planen, Noten verstehen, mit KI chatten.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            <Link
              href="/lesson-planner"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              Lesson Planner
            </Link>
            <Link
              href="/insights"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md cursor-pointer"
            >
              <BarChart3 className="h-4 w-4" />
              Insights
            </Link>
            <Link
              href="/magic-chat"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Magic Chat
            </Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Für Lehrer & Schüler
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Naga Codex. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
