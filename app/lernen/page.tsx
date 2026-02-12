"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decodeSharedPayload, getStudentLearning, setStudentLearning, type StudentLearning } from "@/lib/classes";
import { MessageSquare, BookOpen, Link2, Plus } from "lucide-react";

export default function LernenPage() {
  const searchParams = useSearchParams();
  const [learning, setLearningState] = useState<StudentLearning | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [ownTopic, setOwnTopic] = useState("");

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const payload = decodeSharedPayload(dataParam);
      if (payload) {
        const next: StudentLearning = {
          className: payload.className,
          topics: payload.topics,
          tone: payload.tone,
        };
        setStudentLearning(next);
        setLearningState(next);
        setLoaded(true);
        return;
      }
    }
    setLearningState(getStudentLearning());
    setLoaded(true);
  }, [searchParams]);

  function handleLoadFromUrl() {
    const url = pasteUrl.trim();
    if (!url) return;
    try {
      const u = new URL(url);
      const data = u.searchParams.get("data");
      if (data) {
        const payload = decodeSharedPayload(data);
        if (payload) {
          const next: StudentLearning = {
            className: payload.className,
            topics: payload.topics,
            tone: payload.tone,
          };
          setStudentLearning(next);
          setLearningState(next);
          setPasteUrl("");
        }
      }
    } catch {
      /* ignore */
    }
  }

  function addOwnTopic() {
    const t = ownTopic.trim();
    if (!t) return;
    const current = getStudentLearning();
    const topics = current?.topics?.length ? [...current.topics, t] : [t];
    const next: StudentLearning = {
      className: current?.className ?? "Eigene Themen",
      topics,
      tone: current?.tone,
    };
    setStudentLearning(next);
    setLearningState(next);
    setOwnTopic("");
  }

  if (!loaded) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lernen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Themen von deiner Lehrerin oder deinem Lehrer – oder eigene Themen hinzufügen.
          </p>
        </div>

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
            <ul className="space-y-2">
              {learning.topics.map((topic, i) => (
                <li key={i}>
                  <Link
                    href={`/magic-chat?topic=${encodeURIComponent(topic)}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-foreground">{topic}</span>
                    <span className="flex items-center gap-1.5 text-sm text-primary">
                      <MessageSquare className="h-4 w-4" />
                      Chat starten
                    </span>
                  </Link>
                </li>
              ))}
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
          </>
        )}
      </div>
    </div>
  );
}
