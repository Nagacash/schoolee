"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownContent } from "@/components/markdown-content";
import { FileDown, BookOpen } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function MagicChatPage() {
  const searchParams = useSearchParams();
  const topicFromUrl = searchParams.get("topic");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (topicFromUrl) {
      setInput((prev) => (prev ? prev : `Erkläre mir das Thema: ${topicFromUrl}`));
    }
  }, [topicFromUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, stream: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: full } : m
          )
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "(Fehler bei der Antwort)" } : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePrintLast() {
    const last = [...messages].reverse().find((m) => m.role === "assistant" && m.content);
    if (!last) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const html = printContentRef.current?.innerHTML ?? "";
    const doc = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>Naga Codex Magic Chat</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 40rem; margin: 0 auto; line-height: 1.6; }
        .md-content p { margin: 0.5em 0; }
        .md-content ul, .md-content ol { margin: 0.5em 0; padding-left: 1.5em; }
        .md-content pre { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 14px; }
        .md-content code { background: #e2e8f0; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .md-content strong { font-weight: 600; }
        h1 { font-size: 1.25rem; margin-bottom: 1rem; }
      </style></head>
      <body>
        <h1>Naga Codex Magic Chat – Antwort</h1>
        <div class="md-content">${html || last.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </body></html>`;
    w.document.write(doc);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && m.content);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Magic Chat</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Quiz, Ideen, Lösungen – chatte mit der KI. Antworten werden schön formatiert angezeigt.
          </p>
        </div>

        {/* Hidden div to capture rendered markdown for print */}
        {lastAssistant && (
          <div
            ref={printContentRef}
            className="absolute left-[-9999px] top-0 w-full max-w-xl [&_pre]:whitespace-pre-wrap [&_ul]:list-disc [&_ol]:list-decimal"
            aria-hidden
          >
            <MarkdownContent content={lastAssistant.content} />
          </div>
        )}

        {topicFromUrl && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-foreground shadow-sm">
            <BookOpen className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold">Thema:</span>
            <span>{topicFromUrl}</span>
          </div>
        )}

        <Card className="rounded-2xl border border-border/80 flex flex-col min-h-[520px] overflow-hidden bg-card/95 backdrop-blur-sm shadow-xl shadow-black/5 dark:shadow-none dark:border-white/10">
          <CardHeader className="border-b border-border/60 bg-muted/20 py-4">
            <CardTitle className="text-lg font-semibold tracking-tight">Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-5 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    z.B. &quot;Quiz Römer Klasse 6&quot; oder &quot;5 Fragen zu Photosynthese mit Lösungen&quot;
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-5 py-3.5 shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground shadow-primary/20 rounded-br-md"
                        : "bg-muted/80 border border-border/60 rounded-bl-md text-foreground"
                    }`}
                  >
                    {m.role === "assistant" && m.content ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0">
                        <MarkdownContent content={m.content} />
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content || "…"}</div>
                    )}
                  </div>
                </div>
              ))}
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border/60 bg-muted/5"
            >
              <div className="flex gap-3 rounded-2xl border-2 border-border bg-background shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 focus-within:shadow-[0_0_0_4px_oklch(0.5_0.14_230/0.08)] transition-all duration-200 dark:bg-card/50 dark:border-white/10">
                <Textarea
                  placeholder="Nachricht schreiben…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="flex-1 min-w-0 min-h-[48px] max-h-[140px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:shadow-none rounded-2xl py-3.5 pl-4"
                  rows={1}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="self-end mb-2 mr-2 shrink-0 h-9 px-5 rounded-xl"
                >
                  Senden
                </Button>
              </div>
            </form>

            {lastAssistant && (
              <div className="no-print px-4 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintLast}
                  className="gap-2 rounded-xl"
                >
                  <FileDown className="h-4 w-4" />
                  Letzte Antwort drucken / PDF
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
