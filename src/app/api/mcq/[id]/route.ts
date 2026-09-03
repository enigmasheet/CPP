import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mcq = await MCQ.findById(id).lean();
    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }
    return NextResponse.json(mcq);
  } catch {
    return NextResponse.json({ error: "Failed to fetch MCQ" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const mcq = await MCQ.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }
    return NextResponse.json(mcq);
  } catch {
    return NextResponse.json({ error: "Failed to update MCQ" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const mcq = await MCQ.findByIdAndDelete(id).lean();
    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete MCQ" }, { status: 500 });
  }
}
