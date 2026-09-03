import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";
import Resource from "@/models/Resource";
import { teacherNotes } from "@/data/teacher-notes";
import {
  MIN_SEARCH_QUERY_LENGTH,
  MAX_TOPIC_SEARCH_RESULTS,
  MAX_MCQ_SEARCH_RESULTS,
  MAX_RESOURCE_SEARCH_RESULTS,
  SEARCH_SNIPPET_LENGTH,
  SEARCH_TITLE_SNIPPET_LENGTH,
} from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < MIN_SEARCH_QUERY_LENGTH) {
      return NextResponse.json({ topics: [], questions: [], resources: [] });
    }

    await connectDB();

    const regex = new RegExp(q, "i");

    const topics = teacherNotes
      .filter((n) => !n.teacherOnly && (regex.test(n.title) || regex.test(n.content)))
      .slice(0, MAX_TOPIC_SEARCH_RESULTS)
      .map((n) => ({
        id: `topic-${n.id}`,
        title: n.title,
        type: "topic" as const,
        url: `/subjects/cpp/learn/${n.topic}`,
        snippet: n.content.slice(0, SEARCH_SNIPPET_LENGTH).replace(/[#*`]/g, "") + "...",
      }));

    const mcqs = await MCQ.find({ question: regex }).limit(MAX_MCQ_SEARCH_RESULTS).lean();
    const questions = mcqs.map((m) => ({
      id: `mcq-${m._id}`,
      title: m.question.slice(0, SEARCH_TITLE_SNIPPET_LENGTH),
      type: "question" as const,
      url: `/subjects/cpp/mcq/${m.topic}`,
      snippet: m.options.map((o: { text: string }) => o.text).join(" | ").slice(0, SEARCH_SNIPPET_LENGTH),
    }));

    const resources = await Resource.find({ title: regex }).limit(MAX_RESOURCE_SEARCH_RESULTS).lean();
    const resourceResults = resources.map((r) => ({
      id: `resource-${r._id}`,
      title: r.title,
      type: "resource" as const,
      url: `/subjects/cpp/learn`,
      snippet: r.description?.slice(0, SEARCH_SNIPPET_LENGTH) || r.content?.slice(0, SEARCH_SNIPPET_LENGTH) || "",
    }));

    return NextResponse.json({ topics, questions, resources: resourceResults });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
