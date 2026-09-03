import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import MCQ from "@/models/MCQ";

export const POST = withDB(async (request) => {
  const { ids } = await request.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }

  const mcqs = await MCQ.find({ _id: { $in: ids } }).lean();
  return NextResponse.json(mcqs);
});
