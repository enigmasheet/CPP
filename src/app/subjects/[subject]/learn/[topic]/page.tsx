import AppShell from "@/components/layout/AppShell";
import LearnTopicView from "@/components/learn/LearnTopicView";
import { getSubject, getTopics, getTopic } from "@/config/subjects";
import { notFound } from "next/navigation";
import { teacherNotes } from "@/data/teacher-notes";

export default async function LearnTopicPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject: slug, topic: topicSlug } = await params;
  const subject = getSubject(slug);
  if (!subject) return notFound();
  const topic = getTopic(slug, topicSlug);
  if (!topic) return notFound();
  const topics = getTopics(slug);

  const topicNotes = teacherNotes
    .filter((n) => n.topic === topicSlug && !n.teacherOnly)
    .map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      difficulty: n.difficulty,
      estimatedMinutes: n.estimatedMinutes,
      topic: n.topic,
    }));

  return (
    <AppShell>
      <LearnTopicView
        topics={topics}
        topicNotes={topicNotes}
        currentTopic={topic}
        slug={slug}
        subjectName={subject.name}
      />
    </AppShell>
  );
}
