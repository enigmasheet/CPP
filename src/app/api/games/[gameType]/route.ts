import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const GAME_FILES: Record<string, string> = {
  "output-predictor": "output-predictor.json",
  "bug-hunter": "bug-hunter.json",
  "code-golf": "code-golf.json",
  "speed-code": "speed-code.json",
  "memory-match": "memory-match.json",
  "syntax-scramble": "syntax-scramble.json",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameType: string }> }
) {
  try {
    const { gameType } = await params;
    const fileName = GAME_FILES[gameType];

    if (!fileName) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const filePath = join(process.cwd(), "seed", "games", fileName);
    const data = await readFile(filePath, "utf-8");
    const questions = JSON.parse(data);

    return NextResponse.json(questions);
  } catch {
    return NextResponse.json({ error: "Failed to load game" }, { status: 500 });
  }
}
