import { NextResponse, type NextRequest } from "next/server";
import { getGameQuestions } from "@/content/registry";
import { GAME_TYPES, DEFAULT_SUBJECT_SLUG } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameType: string }> }
) {
  try {
    const { gameType } = await params;
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject") || DEFAULT_SUBJECT_SLUG;

    if (!GAME_TYPES.some((t) => t.id === gameType)) {
      return NextResponse.json({ error: "Invalid game type" }, { status: 404 });
    }

    const questions = getGameQuestions(subject, gameType);

    if (questions.length === 0) {
      return NextResponse.json({ error: "Game not found for this subject" }, { status: 404 });
    }

    return NextResponse.json(questions);
  } catch {
    return NextResponse.json({ error: "Failed to load game" }, { status: 500 });
  }
}
