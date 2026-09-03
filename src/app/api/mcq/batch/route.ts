import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    const mcqs = await MCQ.find({ _id: { $in: ids } }).lean();
    return NextResponse.json(mcqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch MCQs" }, { status: 500 });
  }
}
