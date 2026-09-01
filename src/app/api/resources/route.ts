import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/models/Resource";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const type = searchParams.get("type");
    const difficulty = searchParams.get("difficulty");

    const filter: Record<string, string> = {};
    if (topic) filter.topic = topic;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const resources = await Resource.find(filter).lean();
    return NextResponse.json(resources);
  } catch {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const resource = await Resource.create(body);
    return NextResponse.json(resource, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
