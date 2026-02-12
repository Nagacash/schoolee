"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { LehrerOnly } from "@/components/lehrer-only";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LessonPlan } from "@/components/lesson-plan";
import type { LessonPlanResult } from "@/lib/gemini";
import { Loader2, BookOpen } from "lucide-react";
import { getTeacherClasses, type TeacherClass } from "@/lib/classes";

const schema = z.object({
  thema: z.string().min(1, "Thema angeben"),
  klasse: z.number().min(5).max(12),
  fach: z.string().min(1, "Fach angeben"),
  zeit: z.number().min(30).max(90),
});

type FormValues = z.infer<typeof schema>;

export default function LessonPlannerPage() {
  const [plan, setPlan] = useState<LessonPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);

  useEffect(() => {
    setClasses(getTeacherClasses());
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      thema: "Photosynthese",
      klasse: 8,
      fach: "Biologie",
      zeit: 45,
    },
  });

  function handleSelectClass(cls: TeacherClass) {
    setSelectedClass(cls);
    if (cls.topics.length > 0) {
      form.setValue("fach", cls.topics[0]);
    }
  }

  function handleDeselectClass() {
    setSelectedClass(null);
  }

  function handleTopicClick(topic: string) {
    form.setValue("thema", topic);
  }

  async function onSubmit(values: FormValues) {
    setError(null);
    setPlan(null);
    setLoading(true);
    try {
      const res = await fetch("/api/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(selectedClass ? { klassenName: selectedClass.name, tone: selectedClass.tone } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setPlan(data as LessonPlanResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Erstellen des Plans");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LehrerOnly>
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Lesson Planner</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Thema, Klasse, Fach und Dauer – die KI zaubert deinen Stundenplan.
          </p>
        </div>

        {/* Class Selector */}
        <Card className="shadow-md rounded-xl border border-border overflow-hidden bg-card">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Klasse verknüpfen
            </CardTitle>
            <CardDescription className="text-base">
              Optional: Wähle eine gespeicherte Klasse, um Fach und Ton automatisch zu setzen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Noch keine Klassen angelegt →{" "}
                <Link href="/lehrer/klassen" className="underline text-primary font-medium">
                  Klassen verwalten
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => handleSelectClass(cls)}
                      className={`rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedClass?.id === cls.id
                          ? "border-primary ring-1 ring-primary"
                          : "border-border"
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{cls.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cls.topics.length} {cls.topics.length === 1 ? "Thema" : "Themen"}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedClass && (
                  <div className="space-y-3">
                    {selectedClass.topics.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedClass.topics.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => handleTopicClick(topic)}
                            className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDeselectClass}
                    >
                      Verknüpfung lösen
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl border border-border overflow-hidden bg-card">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Deine Eingaben</CardTitle>
            <CardDescription className="text-base">Alles ausfüllen, dann Plan erstellen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="thema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thema</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Photosynthese" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="klasse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Klasse</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Klasse wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 6, 7, 8, 9, 10, 11, 12].map((k) => (
                            <SelectItem key={k} value={String(k)}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fach</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Biologie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zeit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zeit: {field.value} min</FormLabel>
                      <FormControl>
                        <Slider
                          min={30}
                          max={90}
                          step={5}
                          value={[field.value]}
                          onValueChange={([v]) => field.onChange(v)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 text-base font-semibold">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird erstellt…
                    </>
                  ) : (
                    "Stundenplan erstellen"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {plan && (
          <div className="no-print">
            <LessonPlan plan={plan} />
          </div>
        )}
      </div>
    </div>
    </LehrerOnly>
  );
}
