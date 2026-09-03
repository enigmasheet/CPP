import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Resource from "@/models/Resource";
import { createResourceSchema } from "@/lib/validations";

export const GET = withDB(async (request: NextRequest) => {
  const authError = await requireAdmin();
  if (authError) return authError;

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
});

export const POST = withDB(async (request: NextRequest) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = createResourceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const resource = await Resource.create(parsed.data);
  return NextResponse.json(resource, { status: 201 });
});
