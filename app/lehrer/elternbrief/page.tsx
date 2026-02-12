"use client";

import { useState } from "react";
import Link from "next/link";
import { LehrerOnly } from "@/components/lehrer-only";
import { useClassesStore, type TeacherClass } from "@/lib/classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Loader2,
  Copy,
  Printer,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const BRIEF_TYPES = [
  { value: "elternbrief", label: "Elternbrief" },
  { value: "wochenbericht", label: "Wochenbericht" },
  { value: "leistungsinfo", label: "Leistungsinfo" },
  { value: "ausflug", label: "Ausflug / Event" },
] as const;

export default function ElternbriefPage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [briefType, setBriefType] = useState("elternbrief");
  const [customNote, setCustomNote] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const classes = useClassesStore((s) => s.teacherClasses);
  const selectedClass = classes.find(
    (c: TeacherClass) => c.id === selectedClassId
  );

  async function handleGenerate() {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/elternbrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass.name,
          topics: selectedClass.topics,
          tone: selectedClass.tone || "freundlich",
          type: briefType,
          customNote: customNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler bei der Generierung");
      }

      setResult(data.content);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <LehrerOnly>
      <div className="container max-w-3xl py-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <Link
            href="/lehrer/overview"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Admin Autopilot
              </h1>
              <p className="text-muted-foreground text-sm">
                KI generiert Elternbriefe, Wochenberichte und
                Leistungsinformationen.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="border border-border shadow-md rounded-xl overflow-hidden bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Brief konfigurieren</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Class selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Klasse auswählen
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">— Klasse wählen —</option>
                {classes.map((c: TeacherClass) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.topics.length} Themen)
                  </option>
                ))}
              </select>
              {selectedClass && (
                <p className="text-xs text-muted-foreground">
                  Themen: {selectedClass.topics.join(", ")}
                </p>
              )}
            </div>

            {/* Brief type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Brief-Typ
              </label>
              <div className="flex flex-wrap gap-2">
                {BRIEF_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => setBriefType(bt.value)}
                    className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ${
                      briefType === bt.value
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 bg-background"
                    }`}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom note */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Zusätzliche Hinweise{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Textarea
                placeholder="z.B. Ausflug am 15. März, Materialien mitbringen…"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={!selectedClass || loading}
              className="w-full rounded-xl gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird generiert…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Brief generieren
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className="border border-border shadow-md rounded-xl overflow-hidden bg-card print-area">
            <CardHeader className="border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Generierter Brief
              </CardTitle>
              <div className="flex items-center gap-2 no-print">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-lg gap-1.5"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Kopiert
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Kopieren
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-lg gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Drucken
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LehrerOnly>
  );
}
