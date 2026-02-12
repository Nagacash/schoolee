import { NextResponse } from "next/server";
import { generateLessonPlan } from "@/lib/gemini";
import { mockLehrplanData } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { thema, klasse, fach, zeit, tone, klassenName } = body;

    if (!thema || typeof thema !== "string" || !thema.trim()) {
      return NextResponse.json(
        { error: "thema is required" },
        { status: 400 }
      );
    }
    const k = Number(klasse);
    if (Number.isNaN(k) || k < 5 || k > 12) {
      return NextResponse.json(
        { error: "klasse must be 5–12" },
        { status: 400 }
      );
    }
    if (!fach || typeof fach !== "string" || !fach.trim()) {
      return NextResponse.json(
        { error: "fach is required" },
        { status: 400 }
      );
    }
    const z = Number(zeit);
    if (Number.isNaN(z) || z < 30 || z > 90) {
      return NextResponse.json(
        { error: "zeit must be 30–90" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await generateLessonPlan(
      { thema: thema.trim(), klasse: k, fach: fach.trim(), zeit: z, tone, klassenName },
      mockLehrplanData
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("lesson-plan API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lesson plan failed" },
      { status: 500 }
    );
  }
}
