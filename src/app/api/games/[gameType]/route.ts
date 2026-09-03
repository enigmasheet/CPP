import { NextRequest, NextResponse } from "next/server";
import { GAME_DATA } from "@/data/games";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameType: string }> }
) {
  try {
    const { gameType } = await params;
    const questions = GAME_DATA[gameType];

    if (!questions) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(questions);
  } catch {
    return NextResponse.json({ error: "Failed to load game" }, { status: 500 });
  }
}
