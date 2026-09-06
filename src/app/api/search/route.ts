import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";
import Resource from "@/models/Resource";
import Session from "@/models/Session";
import AuditLog from "@/models/AuditLog";
import { teacherNotes } from "@/data/teacher-notes";
import { stripTeachingTips } from "@/lib/utils";
import {
  MIN_SEARCH_QUERY_LENGTH,
  MAX_TOPIC_SEARCH_RESULTS,
  MAX_MCQ_SEARCH_RESULTS,
  MAX_RESOURCE_SEARCH_RESULTS,
  MAX_SESSION_SEARCH_RESULTS,
  MAX_AUDIT_SEARCH_RESULTS,
  SEARCH_SNIPPET_LENGTH,
  SEARCH_TITLE_SNIPPET_LENGTH,
} from "@/lib/constants";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < MIN_SEARCH_QUERY_LENGTH) {
      return NextResponse.json({ topics: [], questions: [], resources: [], sessions: [], auditLogs: [] });
    }

    await connectDB();

    const regex = new RegExp(escapeRegex(q), "i");

    const topics = teacherNotes
      .filter((n) => !n.teacherOnly && (regex.test(n.title) || regex.test(n.content)))
      .slice(0, MAX_TOPIC_SEARCH_RESULTS)
      .map((n) => ({
        id: `topic-${n.id}`,
        title: n.title,
        type: "topic" as const,
        url: `/subjects/cpp/learn/${n.topic}`,
        snippet: stripTeachingTips(n.content).slice(0, SEARCH_SNIPPET_LENGTH).replace(/[#*`]/g, "") + "...",
      }));

    const mcqs = await MCQ.find({
      $or: [{ question: regex }, { "options.text": regex }, { explanation: regex }, { topic: regex }],
    })
      .limit(MAX_MCQ_SEARCH_RESULTS)
      .populate("subject", "slug")
      .lean();
    const questions = mcqs.map((m) => {
      const subjectSlug = (m.subject as unknown as { slug: string })?.slug ?? "cpp";
      return {
        id: `mcq-${m._id}`,
        title: m.question.slice(0, SEARCH_TITLE_SNIPPET_LENGTH),
        type: "question" as const,
        url: `/subjects/${subjectSlug}/mcq/${m.topic}`,
        snippet: m.options.map((o: { text: string }) => o.text).join(" | ").slice(0, SEARCH_SNIPPET_LENGTH),
      };
    });

    const resources = await Resource.find({
      $or: [{ title: regex }, { content: regex }, { topic: regex }],
    })
      .limit(MAX_RESOURCE_SEARCH_RESULTS)
      .populate("subject", "slug")
      .lean();
    const resourceResults = resources.map((r) => {
      const subjectSlug = (r.subject as unknown as { slug: string })?.slug ?? "cpp";
      return {
        id: `resource-${r._id}`,
        title: r.title,
        type: "resource" as const,
        url: `/subjects/${subjectSlug}/resources`,
        snippet: r.description?.slice(0, SEARCH_SNIPPET_LENGTH) || r.content?.slice(0, SEARCH_SNIPPET_LENGTH) || "",
      };
    });

    const sessions = await Session.find({
      $or: [{ title: regex }, { code: regex }, { section: regex }],
    })
      .sort({ createdAt: -1 })
      .limit(MAX_SESSION_SEARCH_RESULTS)
      .lean();
    const sessionResults = sessions.map((s) => ({
      id: `session-${s._id}`,
      title: s.title,
      type: "session" as const,
      url: `/admin/sessions/${s.code}`,
      snippet: `${s.code} · ${s.items.length} items · ${s.isActive ? "Active" : "Closed"}`,
    }));

    const auditLogs = await AuditLog.find({
      $or: [{ section: regex }, { notes: regex }, { topicsCovered: regex }],
    })
      .sort({ date: -1 })
      .limit(MAX_AUDIT_SEARCH_RESULTS)
      .lean();
    const auditResults = auditLogs.map((l) => ({
      id: `audit-${l._id}`,
      title: `${new Date(l.date).toLocaleDateString()} - ${l.section || "No section"}`,
      type: "audit" as const,
      url: "/admin",
      snippet: l.notes?.slice(0, SEARCH_SNIPPET_LENGTH) || l.topicsCovered.join(", ").slice(0, SEARCH_SNIPPET_LENGTH),
    }));

    return NextResponse.json({ topics, questions, resources: resourceResults, sessions: sessionResults, auditLogs: auditResults });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
