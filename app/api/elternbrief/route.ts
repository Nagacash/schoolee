import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { className, topics, tone, type, customNote } = body;

    if (!className || !topics?.length) {
      return NextResponse.json(
        { error: "className and topics required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: MODEL });

    const toneInstruction =
      tone === "formell"
        ? "formell und professionell"
        : tone === "einfach"
          ? "einfach und verständlich"
          : "freundlich und einladend";

    const typeMap: Record<string, string> = {
      wochenbericht: "einen Wochenbericht über den aktuellen Unterrichtsstand",
      elternbrief: "einen Elternbrief mit den wichtigsten Informationen",
      leistungsinfo: "eine Leistungsinformation mit Empfehlungen",
      ausflug:
        "eine Einladung/Information zu einem geplanten Ausflug oder Event",
    };

    const prompt = `Du bist ein erfahrener Lehrer. Schreibe ${typeMap[type] || typeMap.elternbrief} für die Klasse "${className}".

Aktuelle Themen: ${topics.join(", ")}
Ton: ${toneInstruction}
${customNote ? `Zusätzliche Hinweise: ${customNote}` : ""}

Formatiere den Brief professionell mit:
- Anrede
- Einleitung
- Hauptteil (Themen, Fortschritt, ggf. Empfehlungen)
- Schluss mit freundlichem Gruß
- Unterschriftszeile "[Ihr Name], Klassenlehrer/in ${className}"

Schreibe in einfachem, klarem Deutsch. Kein Markdown, nur Fließtext mit Absätzen.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ content: text });
  } catch (err) {
    console.error("elternbrief API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
