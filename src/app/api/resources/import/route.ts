import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/models/Resource";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { resources } = body;

    if (!Array.isArray(resources) || resources.length === 0) {
      return NextResponse.json({ error: "No resources provided" }, { status: 400 });
    }

    const result = await Resource.insertMany(resources);
    return NextResponse.json({ imported: result.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to import resources" }, { status: 500 });
  }
}
