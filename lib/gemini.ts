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

function buildSystemInstruction(targetLang?: string): string {
  const base =
    "Du bist Naggy Magic Chat für Schule (Lehrer und Schüler). Antworte prägnant, klar strukturiert (z.B. Überschriften, Listen, Quiz-Fragen + Lösungen). Nutze ggf. Emojis wie 📄 für Dokumente oder 🌿 für Biologie.";

  if (!targetLang) return base;

  switch (targetLang) {
    case "en":
      return (
        base +
        "\n\nSehr wichtig: Antworte immer in einfacher, klarer deutscher Sprache. Nutze Überschriften und Listen, wenn es passt."
      );
    case "ar":
      return (
        base +
        "\n\nSehr wichtig: Antworte immer in einfacher, klarer deutscher Sprache. Nutze Überschriften und Listen, wenn es passt."
      );
    case "tr":
      return (
        base +
        "\n\nSehr wichtig: Antworte immer in einfacher, klarer deutscher Sprache. Nutze Überschriften und Listen, wenn es passt."
      );
    case "uk":
      return (
        base +
        "\n\nSehr wichtig: Antworte immer in einfacher, klarer deutscher Sprache. Nutze Überschriften und Listen, wenn es passt."
      );
    default:
      return base;
  }
}

function getLanguageHeading(code?: string): string {
  switch (code) {
    case "en":
      return "English";
    case "ar":
      return "العربية";
    case "tr":
      return "Türkçe";
    case "uk":
      return "Українська";
    default:
      return "Übersetzung";
  }
}

export async function chat(
  messages: ChatMessage[],
  targetLang?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: buildSystemInstruction(targetLang),
  });

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: contents.slice(0, -1) });
  const last = messages[messages.length - 1];
  if (last.role !== "user") throw new Error("Last message must be user");
  const result = await chat.sendMessage(last.content);
  const germanText = result.response.text().trim();

  // Wenn keine Zielsprache gewählt ist, nur Deutsch zurückgeben.
  if (!targetLang) return germanText;

  const heading = getLanguageHeading(targetLang);

  // Zweiten Aufruf für die Übersetzung in die Zielsprache.
  const translateModel = genAI.getGenerativeModel({ model: MODEL });
  const translatePrompt = `Übersetze den folgenden Text in ${heading} in einfacher Sprache. Erkläre alles vollständig, aber fasse dich möglichst klar und verständlich. Lasse keine Inhalte weg.\n\nText (Deutsch):\n${germanText}`;
  const translateResult = await translateModel.generateContent(translatePrompt);
  const translated = translateResult.response.text().trim();

  // Kombiniere Deutsch + Übersetzung in einem strukturierten Markdown-Format.
  return `## Deutsch\n\n${germanText}\n\n---\n\n## ${heading}\n\n${translated}`;
}

export async function* chatWithStream(
  messages: ChatMessage[],
  targetLang?: string
): AsyncGenerator<string, void, unknown> {
  // Für Fälle mit Zielsprache nutzen wir die kombinierte Antwort aus `chat`
  // und streamen sie als einen Block (einfach, aber robust).
  if (targetLang) {
    const full = await chat(messages, targetLang);
    yield full;
    return;
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: buildSystemInstruction(targetLang),
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
