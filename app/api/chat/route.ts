import { chat, chatWithStream } from "@/lib/gemini";
import type { ChatMessage } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, stream: useStream, language } = body as {
      messages?: { role: string; content: string }[];
      stream?: boolean;
      language?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const last = messages[messages.length - 1];
    if (last.role !== "user" || typeof last.content !== "string") {
      return new Response(
        JSON.stringify({ error: "Last message must be user with content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalized: ChatMessage[] = messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? ""),
    }));

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Nur ohne Sprache im Streaming-Modus arbeiten.
    // Wenn eine Sprache für Übersetzung gesetzt ist, nutzen wir den einfachen JSON-Weg,
    // damit Fehler nicht den Stream hart abbrechen.
    if (useStream !== false && !language) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chatWithStream(normalized, language)) {
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    const text = await chat(normalized, language);
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat API error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Chat failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
