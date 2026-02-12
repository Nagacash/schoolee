"use client";

import Link from "next/link";
import { LehrerOnly } from "@/components/lehrer-only";
import { useClassesStore, encodeSharedPayload, type TeacherClass } from "@/lib/classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart3, Link2, Users } from "lucide-react";
import { useState } from "react";

export default function LehrerOverviewPage() {
  const classes = useClassesStore((s) => s.teacherClasses);
  const setTeacherClasses = useClassesStore((s) => s.setTeacherClasses);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyShareLink(cls: TeacherClass) {
    const payload = {
      className: cls.name,
      topics: cls.topics.length ? cls.topics : ["Allgemein"],
      tone: cls.tone,
    };
    const data = encodeSharedPayload(payload);
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const origin = base?.replace(/\/$/, "") || "";
    const url = `${origin}/lernen?data=${data}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cls.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function removeLesson(cls: TeacherClass, lessonId: string) {
    const updated = classes.map((c) =>
      c.id === cls.id
        ? {
            ...c,
            lessons: (c.lessons ?? []).filter((l) => l.id !== lessonId),
          }
        : c
    );
    setTeacherClasses(updated);
  }

  return (
    <LehrerOnly>
      <div className="container py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Übersicht</h1>
              <p className="text-sm text-muted-foreground">
                Alle Klassen im Blick – mit Schnellzugriff auf Planen, Insights und Lernlinks.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl gap-2">
              <Link href="/lehrer/klassen">
                <Users className="h-4 w-4" />
                Meine Klassen
              </Link>
            </Button>
          </div>

          {classes.length === 0 ? (
            <Card className="rounded-xl border border-border bg-card/95">
              <CardHeader>
                <CardTitle className="text-lg">Noch keine Klassen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Lege deine erste Klasse an, um Themen zu teilen und Lernlinks für deine Schüler zu erstellen.
                </p>
                <Button asChild className="rounded-xl">
                  <Link href="/lehrer/klassen">Klasse anlegen</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-sm"
                >
                  <CardHeader className="border-b border-border/70 pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          {cls.name || "Unbenannte Klasse"}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {cls.topics.length} Thema{cls.topics.length === 1 ? "" : "en"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {cls.topics.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Beispielthemen:{" "}
                        {cls.topics.slice(0, 3).join(", ")}
                        {cls.topics.length > 3 ? " …" : ""}
                      </p>
                    )}
                    {cls.lessons && cls.lessons.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Aufgaben ({cls.lessons.length}):
                        </p>
                        <ul className="space-y-1">
                          {cls.lessons.slice(0, 3).map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between gap-2 text-xs text-muted-foreground"
                            >
                              <span className="truncate">{lesson.title}</span>
                              <button
                                type="button"
                                onClick={() => removeLesson(cls, lesson.id)}
                                className="text-destructive hover:underline"
                              >
                                Löschen
                              </button>
                            </li>
                          ))}
                          {cls.lessons.length > 3 && (
                            <li className="text-[11px] text-muted-foreground">
                              … weitere {cls.lessons.length - 3} Aufgaben
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5"
                        onClick={() => copyShareLink(cls)}
                      >
                        <Link2 className="h-4 w-4" />
                        {copiedId === cls.id ? "Link kopiert" : "Link teilen"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5"
                        asChild
                      >
                        <Link href="/lesson-planner">
                          <BookOpen className="h-4 w-4" />
                          Planen
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5"
                        asChild
                      >
                        <Link href="/insights">
                          <BarChart3 className="h-4 w-4" />
                          Insights
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </LehrerOnly>
  );
}

