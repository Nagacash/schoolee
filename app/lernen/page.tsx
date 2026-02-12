"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { decodeSharedPayload, useClassesStore, type StudentLearning, type StudentNote } from "@/lib/classes";
import { GLOSSARY_LANGUAGES, TERM_GLOSSARY, type GlossaryLanguage } from "@/lib/term-glossary";
import { FocusTimer } from "@/components/focus-timer";
import { MessageSquare, BookOpen, Link2, Plus, CheckCircle2, ChevronDown, ChevronUp, Trash2, FileText, PenLine, Clock } from "lucide-react";
import { StimmungsCheck } from "@/components/stimmungs-check";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Gerade eben";
  if (mins < 60) return `Vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `Vor ${days} Tag${days > 1 ? "en" : ""}`;
}

export default function LernenPage() {
  const searchParams = useSearchParams();
  const learning = useClassesStore((s) => s.studentLearning);
  const setStudentLearning = useClassesStore((s) => s.setStudentLearning);
  const teacherClasses = useClassesStore((s) => s.teacherClasses);
  const studentClassName = useClassesStore((s) => s.studentClassName);
  const studentClassId = useClassesStore((s) => s.studentClassId);
  const setStudentClass = useClassesStore((s) => s.setStudentClass);
  const studentCompletedLessons = useClassesStore((s) => s.studentCompletedLessons);
  const studentNotes = useClassesStore((s) => s.studentNotes);
  const addNote = useClassesStore((s) => s.addNote);
  const updateNote = useClassesStore((s) => s.updateNote);
  const deleteNote = useClassesStore((s) => s.deleteNote);
  const [loaded, setLoaded] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const [ownTopic, setOwnTopic] = useState("");
  const [classInput, setClassInput] = useState(studentClassName ?? "");
  const [glossaryLang, setGlossaryLang] = useState<GlossaryLanguage>("en");

  function cycleStatus(
    topic: string,
    currentStatus: "open" | "in_progress" | "done" = "open"
  ) {
    const order: Array<"open" | "in_progress" | "done"> = [
      "open",
      "in_progress",
      "done",
    ];
    const idx = order.indexOf(currentStatus);
    const nextStatus = order[(idx + 1) % order.length];
    const base = learning ?? { className: "Eigene Themen", topics: [], tone: undefined, statuses: {} };
    const nextStatuses = { ...(base.statuses ?? {}) };
    nextStatuses[topic] = nextStatus;
    const next: StudentLearning = {
      ...base,
      statuses: nextStatuses,
    };
    setStudentLearning(next);
  }

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const payload = decodeSharedPayload(dataParam);
      if (payload) {
        const next: StudentLearning = {
          className: payload.className,
          topics: payload.topics,
            tone: payload.tone,
            statuses: {},
        };
        setStudentLearning(next);
      }
    }
    setLoaded(true);
  }, [searchParams, setStudentLearning]);

  function handleLoadFromUrl() {
    const raw = pasteUrl.trim();
    if (!raw) return;

    // Try full URL first
    try {
      const u = new URL(raw);
      const data = u.searchParams.get("data");
      if (data) {
        const payload = decodeSharedPayload(data);
        if (payload) {
          const next: StudentLearning = {
            className: payload.className,
            topics: payload.topics,
            tone: payload.tone,
            statuses: {},
          };
          setStudentLearning(next);
          setPasteUrl("");
          return;
        }
      }
    } catch {
      // not a full URL – try to interpret as ?data=... or raw code
      let data = raw;
      const idx = raw.indexOf("data=");
      if (idx !== -1) {
        data = raw.slice(idx + "data=".length);
      }
      const payload = decodeSharedPayload(data);
      if (payload) {
        const next: StudentLearning = {
          className: payload.className,
          topics: payload.topics,
          tone: payload.tone,
          statuses: {},
        };
        setStudentLearning(next);
        setPasteUrl("");
      }
    }
  }

  function addOwnTopic() {
    const t = ownTopic.trim();
    if (!t) return;
    const current = learning;
    const topics = current?.topics?.length ? [...current.topics, t] : [t];
    const nextStatuses = { ...(current?.statuses ?? {}) };
    nextStatuses[t] = "open";
    const next: StudentLearning = {
      className: current?.className ?? "Eigene Themen",
      topics,
      tone: current?.tone,
      statuses: nextStatuses,
    };
    setStudentLearning(next);
    setOwnTopic("");
  }

  if (!loaded) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const activeClass =
    teacherClasses.find((c) => c.id === studentClassId) ||
    teacherClasses.find((c) => c.name === studentClassName);
  const lessons = activeClass?.lessons ?? [];

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lernen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Themen von deiner Lehrerin oder deinem Lehrer – oder eigene Themen hinzufügen.
          </p>
        </div>

        <Card className="border border-border rounded-xl overflow-hidden bg-card/95">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-sm">Was bedeuten diese Wörter?</CardTitle>
            <CardDescription className="text-xs">
              Kurze Erklärungen zu wichtigen Wörtern – in deiner Sprache.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Sprache auswählen:</span>
              {GLOSSARY_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setGlossaryLang(lang.code)}
                  className={`rounded-full px-3 py-1 border text-xs font-medium transition-colors ${
                    glossaryLang === lang.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-border hover:bg-muted/80"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <ul className="space-y-1.5 text-xs">
              {TERM_GLOSSARY.map((term) => (
                <li key={term.key} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="font-semibold text-foreground min-w-[80px]">
                    {term.de}
                  </span>
                  <span className="text-muted-foreground">
                    {term.translations[glossaryLang] ?? term.explanationDe}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <StimmungsCheck />

        <Card className="border border-border rounded-xl overflow-hidden bg-card/95">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-sm flex items-center justify-between gap-2">
              <span>Meine Klasse</span>
              {studentClassName && (
                <span className="text-xs text-muted-foreground">
                  {studentClassName}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="z.B. 8a, Biologie 9"
                className="rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-lg shrink-0"
                onClick={() => {
                  const name = classInput.trim();
                  if (!name) return;
                  const match =
                    teacherClasses.find(
                      (c) => c.name.toLowerCase() === name.toLowerCase()
                    ) ?? undefined;
                  setStudentClass(name, match?.id);
                }}
              >
                Speichern
              </Button>
            </div>
            {teacherClasses.length > 0 && (
              <p className="text-[11px] text-muted-foreground">
                Vorschläge:&nbsp;
                {teacherClasses.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClassInput(c.name);
                      setStudentClass(c.name, c.id);
                    }}
                    className="underline-offset-2 hover:underline text-xs text-primary mr-2"
                  >
                    {c.name}
                    {idx < teacherClasses.length - 1 ? "," : ""}
                  </button>
                ))}
              </p>
            )}
          </CardContent>
        </Card>

        {!learning?.topics?.length ? (
          <Card className="border border-border rounded-xl overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Link von deiner Lehrerin / deinem Lehrer
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Öffne den Link, den du bekommen hast – oder füge ihn hier ein.
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="https://.../lernen?data=..."
                  className="rounded-lg"
                />
                <Button onClick={handleLoadFromUrl} className="rounded-lg shrink-0">
                  Öffnen
                </Button>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium mb-2">Oder eigenes Thema hinzufügen</p>
                <div className="flex gap-2">
                  <Input
                    value={ownTopic}
                    onChange={(e) => setOwnTopic(e.target.value)}
                    placeholder="z.B. Photosynthese"
                    className="rounded-lg"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOwnTopic())}
                  />
                  <Button type="button" onClick={addOwnTopic} className="rounded-lg shrink-0 gap-1">
                    <Plus className="h-4 w-4" />
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {learning.className && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{learning.className}</span>
              </div>
            )}

            {learning?.topics?.length > 0 && (
              <FocusTimer topics={learning.topics} />
            )}

            <ul className="space-y-2">
              {learning.topics.map((topic, i) => {
                const isExpanded = expandedTopic === topic;
                const topicNotes = studentNotes.filter(
                  (n) => n.topic === topic
                );
                return (
                  <li key={i}>
                    <div className="rounded-xl border border-border bg-card overflow-hidden transition-colors">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTopic(isExpanded ? null : topic)
                              }
                              className="flex items-center gap-2 group"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {topic}
                              </span>
                            </button>
                            {topicNotes.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                {topicNotes.length} Notiz{topicNotes.length !== 1 ? "en" : ""}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              cycleStatus(
                                topic,
                                learning.statuses?.[topic] ?? "open"
                              )
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors w-fit ${
                              (learning.statuses?.[topic] ?? "open") === "open"
                                ? "bg-amber-50/70 text-amber-700 border-amber-200"
                                : (learning.statuses?.[topic] ?? "open") ===
                                  "in_progress"
                                ? "bg-sky-50/80 text-sky-700 border-sky-200"
                                : "bg-emerald-50/80 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {(() => {
                              const status =
                                learning.statuses?.[topic] ?? "open";
                              if (status === "open")
                                return "Offen · Tippe für In Arbeit";
                              if (status === "in_progress")
                                return "In Arbeit · Tippe für Verstanden";
                              return "Verstanden · Tippe für Offen";
                            })()}
                          </button>
                        </div>
                        <Link
                          href={`/magic-chat?topic=${encodeURIComponent(topic)}`}
                          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/90 shrink-0"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat starten
                        </Link>
                      </div>

                      {/* Expanded notes section */}
                      {isExpanded && (
                        <div className="border-t border-border mx-4 mb-4 pt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                              <PenLine className="h-4 w-4 text-primary" />
                              Notizbuch
                            </h3>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs gap-1"
                              onClick={() => addNote(topic)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Neue Notiz
                            </Button>
                          </div>

                          {topicNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic py-4 text-center">
                              Noch keine Notizen. Klicke &quot;Neue Notiz&quot; um
                              loszulegen.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {topicNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className="rounded-lg border border-border bg-muted/30 p-4 space-y-2"
                                >
                                  <Textarea
                                    value={note.content}
                                    onChange={(e) =>
                                      updateNote(note.id, e.target.value)
                                    }
                                    placeholder="Deine Notizen hier schreiben..."
                                    className="min-h-[100px] bg-background/50 resize-y"
                                  />
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      Zuletzt bearbeitet:{" "}
                                      {relativeTime(note.updatedAt)}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                      onClick={() => deleteNote(note.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-2">Eigenes Thema hinzufügen</p>
              <div className="flex gap-2">
                <Input
                  value={ownTopic}
                  onChange={(e) => setOwnTopic(e.target.value)}
                  placeholder="z.B. Neues Thema"
                  className="rounded-lg"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOwnTopic())}
                />
                <Button type="button" onClick={addOwnTopic} className="rounded-lg shrink-0 gap-1">
                  <Plus className="h-4 w-4" />
                  Hinzufügen
                </Button>
              </div>
            </div>

            {lessons.length > 0 && (
              <div className="pt-6 border-t border-border/70 space-y-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Deine Aufgaben aus der Klasse
                </h2>
                <ul className="space-y-2">
                  {lessons.map((lesson) => {
                    const done = studentCompletedLessons.includes(lesson.id);
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/90 px-3 py-2"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-foreground">
                            {lesson.title}
                          </span>
                          {lesson.description && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.description}
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant={done ? "outline" : "default"}
                          size="sm"
                          className="rounded-lg text-xs px-3"
                          onClick={() =>
                            useClassesStore
                              .getState()
                              .toggleLessonCompleted(lesson.id)
                          }
                        >
                          {done ? "Erledigt" : "Als erledigt markieren"}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
