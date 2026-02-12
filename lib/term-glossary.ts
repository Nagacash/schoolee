export type GlossaryLanguage = "en" | "ar" | "tr" | "uk";

export interface TermEntry {
  key: string;
  de: string;
  explanationDe: string;
  translations: Partial<Record<GlossaryLanguage, string>>;
}

export const GLOSSARY_LANGUAGES: { code: GlossaryLanguage; label: string }[] = [
  { code: "en", label: "Englisch" },
  { code: "ar", label: "Arabisch" },
  { code: "tr", label: "Türkisch" },
  { code: "uk", label: "Ukrainisch" },
];

export const TERM_GLOSSARY: TermEntry[] = [
  {
    key: "thema",
    de: "Thema",
    explanationDe: "Worum es in einer Stunde oder Aufgabe geht.",
    translations: {
      en: "Topic – what the lesson or task is about.",
      ar: "الموضوع – ما تدور حوله الحصة أو الواجب.",
      tr: "Konu – dersin veya ödevin ne hakkında olduğu.",
      uk: "Тема – про що урок або завдання.",
    },
  },
  {
    key: "klasse",
    de: "Klasse",
    explanationDe: "Deine Jahrgangs- oder Lerngruppe, z.B. 8a.",
    translations: {
      en: "Class / grade group, e.g. 8a.",
      ar: "الصف / الشعبة، مثل 8a.",
      tr: "Sınıf / şube, örn. 8a.",
      uk: "Клас / група, наприклад 8a.",
    },
  },
  {
    key: "lernen",
    de: "Lernen",
    explanationDe: "Dein Bereich mit Themen und Aufgaben.",
    translations: {
      en: "Learning – your area with topics and tasks.",
      ar: "التعلّم – قسمك الذي يحتوي على المواضيع والمهام.",
      tr: "Öğrenme – konuların ve görevlerin olduğu alan.",
      uk: "Навчання – твій розділ з темами та завданнями.",
    },
  },
  {
    key: "aufgabe",
    de: "Aufgabe",
    explanationDe: "Eine Sache, die du machen sollst, z.B. Übung oder Hausaufgabe.",
    translations: {
      en: "Task – something you should do, e.g. exercise or homework.",
      ar: "مهمة – شيء يجب أن تقوم به، مثل تمرين أو واجب منزلي.",
      tr: "Görev – yapman gereken şey, örn. alıştırma veya ödev.",
      uk: "Завдання – те, що ти маєш зробити, напр. вправа чи домашнє.",
    },
  },
  {
    key: "status",
    de: "Offen / In Arbeit / Verstanden",
    explanationDe: "Zeigt, wie weit du bei einem Thema bist.",
    translations: {
      en: "\"Open / In progress / Understood\" – shows how far you are with a topic.",
      ar: "«مفتوح / قيد العمل / مفهوم» – يوضّح مدى تقدّمك في الموضوع.",
      tr: "\"Açık / Çalışılıyor / Anlaşıldı\" – bir konuda ne kadar ilerlediğini gösterir.",
      uk: "«Відкрите / У процесі / Зрозуміло» – показує, як ти просуваєшся по темі.",
    },
  },
  {
    key: "notiz",
    de: "Notiz",
    explanationDe: "Eigene kurze Erinnerung oder Idee zu einem Thema.",
    translations: {
      en: "Note – your own short reminder or idea about a topic.",
      ar: "ملاحظة – تذكير قصير أو فكرة عن موضوع.",
      tr: "Not – bir konu hakkında kendi kısa hatırlatman veya fikrin.",
      uk: "Нотатка – власне коротке нагадування чи ідея про тему.",
    },
  },
];

