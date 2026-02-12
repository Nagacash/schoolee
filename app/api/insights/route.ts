import { NextResponse } from "next/server";
import { analyzeGrades } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { csv, rows } = body;

    let data: string | Record<string, unknown>[];
    if (typeof csv === "string" && csv.trim()) {
      data = csv.trim();
    } else if (Array.isArray(rows) && rows.length > 0) {
      data = rows;
    } else {
      return NextResponse.json(
        { error: "Provide 'csv' (string) or 'rows' (array)" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await analyzeGrades(data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("insights API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
