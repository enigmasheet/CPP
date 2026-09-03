import AppShell from "@/components/layout/AppShell";
import TopicSidebar from "@/components/layout/TopicSidebar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { getSubject, getTopics, getTopic } from "@/config/subjects";
import { notFound } from "next/navigation";
import { teacherNotes } from "@/data/teacher-notes";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

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

  const topicNotes = teacherNotes.filter(n => n.topic === topicSlug && !n.teacherOnly);

  const currentIdx = topics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null;
  const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null;

  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href={`/subjects/${slug}`} className="hover:text-foreground">
              {subject.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/subjects/${slug}/learn`} className="hover:text-foreground">
              Learn
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span>{topic.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
          <p className="mt-2 text-muted-foreground">{topic.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <nav className="hidden lg:block z-10">
            <div className="sticky top-24 space-y-1 pointer-events-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">Topics</p>
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/subjects/${slug}/learn/${t.slug}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    t.slug === topicSlug
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </nav>

          <TopicSidebar topics={topics} slug={slug} topicSlug={topicSlug} />

          <div className="space-y-8">
            <div className="space-y-6">
              {topicNotes.map((note) => (
                <div key={note.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-lg font-bold">{note.title}</h2>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${DIFFICULTY_COLORS[note.difficulty]}`}>
                      {note.difficulty}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {note.estimatedMinutes}m
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <MarkdownRenderer content={note.content} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              {prevTopic ? (
                <Link
                  href={`/subjects/${slug}/learn/${prevTopic.slug}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {prevTopic.name}
                </Link>
              ) : (
                <div />
              )}
              {nextTopic ? (
                <Link
                  href={`/subjects/${slug}/learn/${nextTopic.slug}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {nextTopic.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <Link
                  href={`/subjects/${slug}/mcq`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Start Quizzes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
