"use client";

import { useClassesStore } from "@/lib/classes";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const MOODS = [
  { value: 1 as const, emoji: "😔", label: "Schlecht" },
  { value: 2 as const, emoji: "😕", label: "Nicht so gut" },
  { value: 3 as const, emoji: "😐", label: "Okay" },
  { value: 4 as const, emoji: "🙂", label: "Gut" },
  { value: 5 as const, emoji: "😄", label: "Super!" },
];

export function StimmungsCheck() {
  const moods = useClassesStore((s) => s.studentMoods);
  const addMood = useClassesStore((s) => s.addMood);

  const today = new Date().toISOString().split("T")[0];
  const todayMood = moods.find((m) => m.date === today);

  return (
    <Card className="border border-border rounded-xl overflow-hidden bg-card/95">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-pink-500" />
          <span className="text-sm font-medium text-foreground">
            Wie geht es dir heute?
          </span>
          {todayMood && (
            <span className="text-xs text-muted-foreground ml-auto">
              Heute: {MOODS.find((m) => m.value === todayMood.mood)?.label}
            </span>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => addMood(m.value)}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer ${
                todayMood?.mood === m.value
                  ? "bg-primary/10 border-2 border-primary/30 scale-110"
                  : "hover:bg-muted border-2 border-transparent hover:scale-105"
              }`}
              title={m.label}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
        {/* Weekly streak */}
        {moods.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 justify-center">
            <span className="text-[11px] text-muted-foreground">Letzte 7 Tage:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const dateStr = d.toISOString().split("T")[0];
                const entry = moods.find((m) => m.date === dateStr);
                return (
                  <div
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${
                      !entry
                        ? "bg-muted"
                        : entry.mood >= 4
                        ? "bg-emerald-400"
                        : entry.mood === 3
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                    title={`${dateStr}: ${entry ? MOODS.find((m) => m.value === entry.mood)?.label : "Kein Eintrag"}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
