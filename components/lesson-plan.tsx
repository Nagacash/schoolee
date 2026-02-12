"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LessonPlanResult } from "@/lib/gemini";
import { FileDown } from "lucide-react";

interface LessonPlanProps {
  plan: LessonPlanResult;
  onPrint?: () => void;
}

/** Strip markdown syntax and return clean readable text with proper spacing. */
function cleanMarkdown(text: string): string {
  return text
    // Remove bold / italic markers
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    // Convert markdown bullet lists to clean lines with "• "
    .replace(/^[\t ]*[-*+]\s+/gm, "• ")
    // Convert numbered lists "1. " → "1. " (keep as-is, they're already readable)
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove inline code backticks
    .replace(/`(.+?)`/g, "$1")
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Render cleaned text as paragraphs with proper spacing. */
function CleanText({ text, className = "" }: { text: string; className?: string }) {
  const cleaned = cleanMarkdown(text);
  const paragraphs = cleaned.split(/\n\n+/);

  return (
    <div className={className}>
      {paragraphs.map((para, i) => {
        const lines = para.split("\n");
        return (
          <div key={i} className={i > 0 ? "mt-3" : ""}>
            {lines.map((line, j) => (
              <p key={j} className="leading-relaxed text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function LessonPlan({ plan, onPrint }: LessonPlanProps) {
  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="space-y-6 print-only">
      <div className="flex flex-wrap items-center justify-between gap-2 no-print">
        <h2 className="text-2xl font-bold text-foreground">Dein Stundenplan</h2>
        <Button onClick={handlePrint} className="no-print gap-2 rounded-xl">
          <FileDown className="h-4 w-4" />
          PDF / Drucken
        </Button>
      </div>

      <Card className="shadow-lg rounded-2xl transition-all hover:shadow-xl border border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Lernziele</CardTitle>
        </CardHeader>
        <CardContent>
          <CleanText text={plan.ziele} />
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">Phasen</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {plan.phasen.map((phase, i) => (
            <Card
              key={i}
              className="shadow-lg rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl border border-border/60"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>{phase.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {phase.dauer} min
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CleanText text={phase.beschreibung} className="text-sm" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl border border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Materialien</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-muted-foreground">
            {plan.materialien.map((m, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                {cleanMarkdown(m)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl border border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Hausaufgaben</CardTitle>
        </CardHeader>
        <CardContent>
          <CleanText text={plan.hausaufgaben} />
        </CardContent>
      </Card>
    </div>
  );
}
