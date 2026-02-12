"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, MessageSquare, Users } from "lucide-react";

export default function NeuInDeutschlandPage() {
  const { user } = useAuth();
  const isSchueler = user?.role === "schüler";
  const isLehrer = user?.role === "lehrer";

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Neu in Deutschland
          </h1>
          <p className="text-muted-foreground text-base">
            Hier findest du alles, was dir beim Start in einer neuen Schule hilft – mit einfachen
            Erklärungen und Unterstützung auf deinem Niveau.
          </p>
        </div>

        {isLehrer && (
          <Card className="rounded-xl border border-border bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Für Lehrkräfte: Willkommensklassen
              </CardTitle>
              <CardDescription>
                Lege Klassen an, plane Stunden und teile Lernlinks mit neu zugewanderten Schüler:innen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/lehrer/overview">Übersicht öffnen</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/lehrer/klassen">Klassen verwalten</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/lesson-planner">Lesson Planner</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {isSchueler && (
          <Card className="rounded-xl border border-border bg-card/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="h-5 w-5 text-primary" />
                Für Schüler:innen
              </CardTitle>
              <CardDescription>
                Wähle deine Klasse, lerne Wörter und Themen für den Unterricht und nutze Magic Chat,
                um Fragen in Ruhe zu stellen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-xl gap-2">
                  <Link href="/lernen">
                    <BookMarked className="h-4 w-4" />
                    Lernen starten
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl gap-2">
                  <Link href="/magic-chat">
                    <MessageSquare className="h-4 w-4" />
                    Magic Chat öffnen
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tipp: Auf der Seite <span className="font-semibold">„Lernen“</span> kannst du deine
                Klasse eintragen (z.B. 8a) und Themen als <span className="font-semibold">„Offen“</span>,
                <span className="font-semibold">„In Arbeit“</span> oder <span className="font-semibold">„Verstanden“</span>{" "}
                markieren.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLehrer && !isSchueler && (
          <Card className="rounded-xl border border-border bg-card/95">
            <CardHeader>
              <CardTitle className="text-lg">Bitte zuerst Rolle wählen</CardTitle>
              <CardDescription>
                Melde dich als Schüler:in oder Lehrkraft an, um die passenden Bereiche für dich zu sehen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="rounded-xl">
                <Link href="/login">Zur Anmeldung</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

