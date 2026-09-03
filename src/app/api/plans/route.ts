import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import TeachingPlan from "@/models/TeachingPlan";

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const plans = await TeachingPlan.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const plan = await TeachingPlan.create({
      title: body.title,
      description: body.description || undefined,
      targetDate: body.targetDate || undefined,
      topics: body.topics || [],
      status: body.status || "todo",
      priority: body.priority || "medium",
      notes: body.notes || undefined,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
