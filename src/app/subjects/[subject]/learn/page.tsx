import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { BookOpen, Clock } from "lucide-react";
import { getSubject, getTopics, getAllSubjectSlugs, getNoteCounts } from "@/config/subjects";
import { MINUTES_TO_SECONDS, STUDENT_TOPICS_FILTER } from "@/lib/constants";
import LearnTopicGrid from "@/components/subjects/LearnTopicGrid";

export function generateStaticParams() {
  return getAllSubjectSlugs().map((subject) => ({ subject }));
}

type Props = { params: Promise<{ subject: string }> };

export default async function LearnPage({ params }: Props) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return notFound();

  const topics = getTopics(slug).filter((t) => t.slug !== STUDENT_TOPICS_FILTER);
  const noteCounts = getNoteCounts(slug);
  const totalNotes = topics.reduce((sum, t) => sum + (noteCounts[t.slug] ?? 0), 0);
  const totalMinutes = topics.reduce((sum, t) => {
    const noteCount = noteCounts[t.slug] ?? 0;
    return sum + noteCount * MINUTES_TO_SECONDS;
  }, 0);

  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href={`/subjects/${slug}`} className="hover:text-foreground">
              {subject.name}
            </Link>
            <span>/</span>
            <span>Learn</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Learn {subject.name.replace(" Programming", "")}</h1>
          <p className="mt-2 text-muted-foreground">
            {topics.length} sections covering fundamentals to advanced concepts
          </p>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {totalNotes} notes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{Math.floor(totalMinutes / MINUTES_TO_SECONDS)}h {totalMinutes % MINUTES_TO_SECONDS}m
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <LearnTopicGrid slug={slug} topics={topics} noteCounts={noteCounts} />
      </div>
    </AppShell>
  );
}
