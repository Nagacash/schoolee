"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type Role } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    if (!role) {
      setError("Bitte wähle Lehrer oder Schüler.");
      return;
    }
    if (!trimmed) {
      setError("Bitte gib deinen Namen ein.");
      return;
    }
    login(role, trimmed);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left: brand / story */}
        <div className="relative hidden lg:flex w-1/2 items-center justify-center overflow-hidden bg-neutral-950 text-neutral-50">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 60% at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 60%),
                radial-gradient(ellipse 80% 60% at 100% 100%, rgba(255,255,255,0.03) 0%, transparent 60%)
              `,
            }}
          />
          <div className="relative z-10 max-w-md px-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/70 px-4 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Naggy Zugang
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-50">
              Ein Login.
              <br />
              Zwei Perspektiven.
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Lehrer sehen Planung, Insights und KI‑Unterstützung. Schüler sehen Lernen,
              Magic Chat und ihren Fortschritt. Kein Passwort, keine Hürde – nur Klarheit.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-300">
              <div className="space-y-1.5">
                <p className="font-semibold text-neutral-100 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Für Lehrkräfte
                </p>
                <p className="text-neutral-400">
                  Stundenpläne, Klassenlinks, Einsichten – alles an einem Ort.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-neutral-100 flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  Für Schüler
                </p>
                <p className="text-neutral-400">
                  Themen, Erklärungen in zwei Sprachen, Magic Chat als Lernpartner.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <div className="flex w-full lg:w-1/2 items-center justify-center bg-background">
          <Card className="w-full max-w-md border border-border/80 bg-card/90 backdrop-blur-xl rounded-2xl shadow-[0_18px_60px_-40px_rgba(15,23,42,0.9)]">
            <CardHeader className="pb-4 space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Melde dich bei Naggy an
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Rolle wählen, Namen eintragen, fertig. Kein Passwort, kein Account‑Chaos.
              </p>
              <p className="text-xs text-muted-foreground/80">
                Kostenlos · lokal gespeichert · jederzeit wieder änderbar.
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Ich nutze Naggy als</Label>
                  <div className="inline-flex w-full rounded-full border border-border/80 bg-muted/40 p-1">
                    <button
                      type="button"
                      onClick={() => setRole("lehrer")}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all ${
                        role === "lehrer"
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <GraduationCap className="h-4 w-4" />
                      Lehrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("schüler")}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-all ${
                        role === "schüler"
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <UserRound className="h-4 w-4" />
                      Schüler
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-name">Name</Label>
                  <Input
                    id="login-name"
                    type="text"
                    placeholder="Wie sollen wir dich anzeigen?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" className="w-full rounded-full" size="lg">
                  Weiter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
