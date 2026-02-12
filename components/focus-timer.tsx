"use client";

import { useState, useEffect, useCallback } from "react";
import { useClassesStore } from "@/lib/classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface FocusTimerProps {
  topics: string[];
}

export function FocusTimer({ topics }: FocusTimerProps) {
  const addStudySession = useClassesStore((s) => s.addStudySession);
  const studySessions = useClassesStore((s) => s.studySessions);

  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0] ?? "");
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const durations = [15, 25, 45];

  // Keep selectedTopic in sync if topics change
  useEffect(() => {
    if (topics.length > 0 && !topics.includes(selectedTopic)) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  // Timer interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setCompleted(true);
          addStudySession(selectedTopic, selectedDuration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, selectedTopic, selectedDuration, addStudySession]);

  const handleStart = useCallback(() => {
    if (completed) {
      // Reset after completion before starting again
      setCompleted(false);
      setTimeLeft(selectedDuration * 60);
    }
    setIsRunning(true);
  }, [completed, selectedDuration]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCompleted(false);
    setTimeLeft(selectedDuration * 60);
  }, [selectedDuration]);

  const handleSelectDuration = useCallback(
    (mins: number) => {
      if (isRunning) return;
      setSelectedDuration(mins);
      setTimeLeft(mins * 60);
      setCompleted(false);
    },
    [isRunning]
  );

  const handleSelectTopic = useCallback(
    (topic: string) => {
      if (isRunning) return;
      setSelectedTopic(topic);
    },
    [isRunning]
  );

  // Today's total minutes
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = studySessions
    .filter((s) => s.completedAt.slice(0, 10) === todayStr)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Card className="rounded-xl border border-border bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Timer className="h-4 w-4 text-primary" />
          Lernzeit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Topic selector */}
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleSelectTopic(topic)}
              disabled={isRunning}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                selectedTopic === topic
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              } disabled:opacity-60`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Duration selector */}
        <div className="flex gap-2 justify-center">
          {durations.map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handleSelectDuration(mins)}
              disabled={isRunning}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                selectedDuration === mins
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              } disabled:opacity-60`}
            >
              {mins} Min.
            </button>
          ))}
        </div>

        {/* Timer circle */}
        <div className="flex justify-center">
          <div
            className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-colors ${
              isRunning
                ? "border-primary"
                : completed
                  ? "border-emerald-500"
                  : "border-primary/20"
            }`}
          >
            {completed ? (
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">
                  Geschafft! 🎉
                </span>
              </div>
            ) : (
              <span className="text-3xl font-mono font-bold text-foreground">
                {display}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isRunning && !completed && (
            <Button
              onClick={handleStart}
              className="bg-primary text-primary-foreground rounded-xl gap-1.5"
              size="sm"
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
          )}
          {isRunning && (
            <Button
              onClick={handlePause}
              className="bg-muted text-foreground rounded-xl gap-1.5"
              size="sm"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          {completed && (
            <Button
              onClick={handleStart}
              className="bg-primary text-primary-foreground rounded-xl gap-1.5"
              size="sm"
            >
              <Play className="h-4 w-4" />
              Nochmal
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="rounded-xl gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Stats */}
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" />
          Heute: {todayMinutes} Min. gelernt
        </div>
      </CardContent>
    </Card>
  );
}
