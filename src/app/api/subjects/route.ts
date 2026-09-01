import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";

export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find({}).lean();
    return NextResponse.json(subjects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}
