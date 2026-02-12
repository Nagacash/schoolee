"use client";

import { useState, useMemo } from "react";
import Papa from "papaparse";
import { LehrerOnly } from "@/components/lehrer-only";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Upload, Loader2 } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

export default function InsightsPage() {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    schwächen: string[];
    empfehlungen: string[];
    summary: string;
  } | null>(null);

  const parsed = useMemo(() => {
    if (!csvText.trim()) return null;
    const result = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    if (result.errors.length) return null;
    return result.data;
  }, [csvText]);

  const chartDataBySubject = useMemo(() => {
    if (!parsed || !parsed.length) return [];
    const byFach: Record<string, { sum: number; count: number }> = {};
    let noteKey = "Note";
    const first = parsed[0];
    const key = Object.keys(first).find(
      (k) => k.toLowerCase().includes("note") || k.toLowerCase().includes("grade")
    );
    if (key) noteKey = key;
    const fachKey = Object.keys(first).find(
      (k) => k.toLowerCase().includes("fach") || k.toLowerCase().includes("subject")
    ) || "Fach";

    for (const row of parsed) {
      const fach = String(row[fachKey] ?? "Sonstige").trim();
      const n = parseFloat(String(row[noteKey] ?? "0").replace(",", "."));
      if (Number.isNaN(n)) continue;
      if (!byFach[fach]) byFach[fach] = { sum: 0, count: 0 };
      byFach[fach].sum += n;
      byFach[fach].count += 1;
    }
    return Object.entries(byFach).map(([name, v]) => ({
      name,
      durchschnitt: Math.round((v.sum / v.count) * 10) / 10,
      anzahl: v.count,
    }));
  }, [parsed]);

  const gradeDistribution = useMemo(() => {
    if (!parsed || !parsed.length) return [];
    let noteKey = "Note";
    const first = parsed[0];
    const key = Object.keys(first).find(
      (k) => k.toLowerCase().includes("note") || k.toLowerCase().includes("grade")
    );
    if (key) noteKey = key;
    const count: Record<string, number> = {};
    for (const row of parsed) {
      const n = String(row[noteKey] ?? "").trim() || "?";
      count[n] = (count[n] || 0) + 1;
    }
    return Object.entries(count).map(([grade, value]) => ({ grade, value }));
  }, [parsed]);

  async function handleAnalyze() {
    if (!csvText.trim()) {
      setError("Bitte zuerst CSV einfügen oder hochladen.");
      return;
    }
    setError(null);
    setAnalysis(null);
    setLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyse fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file, "UTF-8");
  }

  return (
    <LehrerOnly>
    <div className="container py-10">
      <div className="mx-auto max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Insights</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            CSV hochladen → KI analysiert: Schwächen, Empfehlungen und coole Charts.
          </p>
        </div>

        <Card className="shadow-md rounded-xl border border-border overflow-hidden bg-card">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">CSV-Daten</CardTitle>
            <p className="text-sm text-muted-foreground">
              Erwartet z.B. Spalten: Name, Fach, Note, Kommentar
            </p>
          </CardHeader>
          <CardContent>
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="sr-only"
                    onChange={handleFile}
                  />
                  <Button type="button" variant="outline" asChild>
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Datei wählen
                    </span>
                  </Button>
                </label>
                <Button onClick={handleAnalyze} disabled={loading || !csvText.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analysiere…
                    </>
                  ) : (
                    "Analysieren"
                  )}
                </Button>
              </div>
              <textarea
                className="mt-3 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Oder CSV hier einfügen (z.B. Name,Fach,Note,Kommentar&#10;Anna,Mathe,2,Gut&#10;...) "
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6 flex flex-col items-center">
            <Card className="shadow-md rounded-xl border border-border w-full max-w-3xl overflow-hidden bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle>Zusammenfassung</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {analysis.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-xl border border-border w-full max-w-3xl overflow-hidden bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle>Schwächen</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="mx-auto max-w-2xl list-disc list-outside pl-5 space-y-2 text-foreground/90 leading-relaxed">
                  {analysis.schwächen.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-xl border border-border w-full max-w-3xl overflow-hidden bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle>Empfehlungen</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="mx-auto max-w-2xl list-disc list-outside pl-5 space-y-2 text-foreground/90 leading-relaxed">
                  {analysis.empfehlungen.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {(chartDataBySubject.length > 0 || gradeDistribution.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl mx-auto">
            {chartDataBySubject.length > 0 && (
              <Card className="shadow-md rounded-xl border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle>Durchschnitt nach Fach</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataBySubject}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="durchschnitt" fill="hsl(var(--primary))" name="Ø Note" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            {gradeDistribution.length > 0 && (
              <Card className="shadow-md rounded-xl border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle>Notenverteilung</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          dataKey="value"
                          nameKey="grade"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(payload: { grade?: string; value?: number }) => `${payload.grade ?? ""}: ${payload.value ?? ""}`}
                        >
                          {gradeDistribution.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
    </LehrerOnly>
  );
}
