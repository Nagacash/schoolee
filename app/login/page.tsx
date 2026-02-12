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
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md border border-border shadow-md rounded-xl overflow-hidden bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-center">Anmelden</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Wähle deine Rolle und gib deinen Namen ein.
          </p>
          <p className="text-xs text-muted-foreground/80 text-center mt-1">
            Kostenlos, keine Anmeldung nötig – sofort loslegen.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Ich bin</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("lehrer")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    role === "lehrer"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <GraduationCap className="h-8 w-8" />
                  <span className="font-semibold">Lehrer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("schüler")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    role === "schüler"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <UserRound className="h-8 w-8" />
                  <span className="font-semibold">Schüler</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-name">Name</Label>
              <Input
                id="login-name"
                type="text"
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                autoComplete="name"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full rounded-xl" size="lg">
              Anmelden
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
