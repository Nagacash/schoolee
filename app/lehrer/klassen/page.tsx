"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LehrerOnly } from "@/components/lehrer-only";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTeacherClasses,
  setTeacherClasses,
  saveTeacherClass,
  deleteTeacherClass,
  encodeSharedPayload,
  type TeacherClass,
} from "@/lib/classes";
import { Plus, Trash2, Copy, Link2, ArrowLeft, BookOpen } from "lucide-react";

const TONE_OPTIONS: { value: TeacherClass["tone"]; label: string }[] = [
  { value: "freundlich", label: "Freundlich" },
  { value: "formell", label: "Formell" },
  { value: "einfach", label: "Einfach" },
];

export default function LehrerKlassenPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<TeacherClass | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setClasses(getTeacherClasses());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) setTeacherClasses(classes);
  }, [classes, loaded]);

  function addClass() {
    const id = crypto.randomUUID();
    setEditing({
      id,
      name: "",
      topics: [],
      tone: "freundlich",
    });
  }

  function saveEdit() {
    if (!editing) return;
    if (!editing.name.trim()) return;
    const next = editing.topics.length ? editing : { ...editing, topics: ["Allgemein"] };
    const list = classes.some((c) => c.id === next.id)
      ? classes.map((c) => (c.id === next.id ? next : c))
      : [...classes, next];
    setClasses(list);
    setTeacherClasses(list);
    setEditing(null);
    setNewTopic("");
  }

  function removeTopic(index: number) {
    if (!editing) return;
    setEditing({ ...editing, topics: editing.topics.filter((_, i) => i !== index) });
  }

  function addTopic() {
    const t = newTopic.trim();
    if (!t || !editing) return;
    if (editing.topics.includes(t)) return;
    setEditing({ ...editing, topics: [...editing.topics, t] });
    setNewTopic("");
  }

  function copyShareLink(cls: TeacherClass) {
    const payload = {
      className: cls.name,
      topics: cls.topics.length ? cls.topics : ["Allgemein"],
      tone: cls.tone,
    };
    const data = encodeSharedPayload(payload);
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/lernen?data=${data}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cls.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <LehrerOnly>
      <div className="container py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meine Klassen</h1>
              <p className="text-sm text-muted-foreground">
                Klassen anlegen, Themen festlegen und Link an Schüler teilen.
              </p>
            </div>
          </div>

          {editing ? (
            <Card className="border border-border rounded-xl overflow-hidden bg-card">
              <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-lg">Klasse bearbeiten</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(null)} className="rounded-lg">
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={saveEdit} className="rounded-lg" disabled={!editing.name.trim()}>
                    Speichern
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Name der Klasse</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="z.B. 8a, Biologie 9"
                    className="rounded-lg mt-1"
                  />
                </div>
                <div>
                  <Label>Ton für die Klasse</Label>
                  <select
                    value={editing.tone ?? "freundlich"}
                    onChange={(e) => setEditing({ ...editing, tone: e.target.value as TeacherClass["tone"] })}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {TONE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Themen / Inhalte</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Thema hinzufügen"
                      className="rounded-lg"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                    />
                    <Button type="button" variant="outline" onClick={addTopic} className="rounded-lg shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {editing.topics.map((t, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-sm"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTopic(i)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Thema entfernen"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button onClick={addClass} className="w-full rounded-xl gap-2" size="lg">
              <Plus className="h-4 w-4" />
              Neue Klasse anlegen
            </Button>
          )}

          <div className="space-y-3">
            {classes.filter((c) => c.id !== editing?.id).map((cls) => (
              <Card key={cls.id} className="border border-border rounded-xl overflow-hidden bg-card">
                <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{cls.name || "Unbenannte Klasse"}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyShareLink(cls)}
                      className="rounded-lg gap-1.5"
                    >
                      {copiedId === cls.id ? (
                        "Kopiert!"
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" />
                          Link teilen
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(cls)}
                      className="rounded-lg"
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                      deleteTeacherClass(cls.id);
                      setClasses(getTeacherClasses());
                    }}
                      className="rounded-lg text-destructive hover:text-destructive"
                      aria-label="Klasse löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {cls.topics.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Themen: {cls.topics.join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Noch keine Themen.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </LehrerOnly>
  );
}
