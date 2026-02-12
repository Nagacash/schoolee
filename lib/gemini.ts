import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export interface LessonPlanInput {
  thema: string;
  klasse: number;
  fach: string;
  zeit: number;
  tone?: string;
  klassenName?: string;
}

export interface LessonPhase {
  name: string;
  dauer: number;
  beschreibung: string;
}

export interface LessonPlanResult {
  ziele: string;
  phasen: LessonPhase[];
  materialien: string[];
  hausaufgaben: string;
}

const JSON_BLOCK_REGEX = /```(?:json)?\s*([\s\S]*?)```/;

function extractJson(text: string): string {
  const match = text.match(JSON_BLOCK_REGEX);
  if (match) return match[1].trim();
  return text.trim();
}

export async function generateLessonPlan(
  data: LessonPlanInput,
  context: string
): Promise<LessonPlanResult> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `Du bist Naga Codex Lesson Planner. Nutze diesen Context:
${context}

Thema: ${data.thema} | Klasse: ${data.klasse} | Fach: ${data.fach} | Dauer: ${data.zeit} Minuten${data.klassenName ? `\nKlasse/Gruppe: ${data.klassenName}` : ""}${data.tone ? `\nTon/Stil: Antworte in einem ${data.tone}en Stil.` : ""}

Antworte NUR mit gültigem JSON, kein anderer Text. Schema:
{
  "ziele": "Kompetenzziele als Fließtext",
  "phasen": [
    { "name": "Einstieg", "dauer": 5, "beschreibung": "..." },
    { "name": "Erarbeitung", "dauer": 20, "beschreibung": "..." }
  ],
  "materialien": ["Tafel", "Arbeitsblatt", "..."],
  "hausaufgaben": "Konkrete Hausaufgaben"
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const jsonStr = extractJson(text);
  return JSON.parse(jsonStr) as LessonPlanResult;
}

export interface InsightsResult {
  schwächen: string[];
  empfehlungen: string[];
  summary: string;
}

export async function analyzeGrades(csvOrRows: string | Record<string, unknown>[]): Promise<InsightsResult> {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const dataStr =
    typeof csvOrRows === "string"
      ? csvOrRows
      : JSON.stringify(csvOrRows, null, 2);

  const prompt = `Analysiere diese Noten-/Daten-CSV (oder JSON). Antworte NUR mit gültigem JSON, kein anderer Text:
{
  "schwächen": ["Schwäche 1", "Schwäche 2"],
  "empfehlungen": ["Empfehlung 1", "Empfehlung 2"],
  "summary": "Kurze Zusammenfassung in 1-2 Sätzen"
}

Daten:
${dataStr}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonStr = extractJson(text);
  return JSON.parse(jsonStr) as InsightsResult;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION =
  "Du bist paddy Magic Chat für Lehrer. Antworte prägnant, mit Struktur (z.B. Quiz-Fragen + Lösungen). Nutze ggf. Emojis wie 📄 für Dokumente.";

export async function chat(messages: ChatMessage[]): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: contents.slice(0, -1) });
  const last = messages[messages.length - 1];
  if (last.role !== "user") throw new Error("Last message must be user");
  const result = await chat.sendMessage(last.content);
  return result.response.text();
}

export async function* chatWithStream(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const last = messages[messages.length - 1];
  if (last.role !== "user") throw new Error("Last message must be user");

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(last.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
