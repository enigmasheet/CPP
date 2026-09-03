import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Resource from "@/models/Resource";
import { createResourceSchema } from "@/lib/validations";

export const POST = withDB(async (request) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { resources } = body;

  if (!Array.isArray(resources) || resources.length === 0) {
    return NextResponse.json({ error: "No resources provided" }, { status: 400 });
  }

  const validated = [];
  const errors: string[] = [];

  for (let i = 0; i < resources.length; i++) {
    const parsed = createResourceSchema.safeParse(resources[i]);
    if (parsed.success) {
      validated.push(parsed.data);
    } else {
      errors.push(`Item ${i + 1}: ${parsed.error.message}`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 }
    );
  }

  const result = await Resource.insertMany(validated);
  return NextResponse.json({ imported: result.length }, { status: 201 });
});
