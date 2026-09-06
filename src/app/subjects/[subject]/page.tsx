import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, CheckCircle } from "lucide-react";
import { getSubject, getTopics, getAllSubjectSlugs, getNoteCounts } from "@/config/subjects";
import { STUDENT_TOPICS_FILTER, MAX_SCORE_PERCENTAGE } from "@/lib/constants";
import SubjectTopicList from "@/components/subjects/SubjectTopicList";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSubjectSlugs().map((subject) => ({ subject }));
}

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return {};
  return { title: `${subject.name} | TeachMate`, description: subject.description };
}

export default async function SubjectPage({ params }: Props) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return notFound();

  const topics = getTopics(slug).filter((t) => t.slug !== STUDENT_TOPICS_FILTER);
  const noteCounts = getNoteCounts(slug);
  const totalNotes = topics.reduce((sum, t) => sum + (noteCounts[t.slug] ?? 0), 0);

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
        <p className="mt-2 text-muted-foreground">{subject.description}</p>
        <div className="flex gap-4 mt-4 items-center">
          <Link href={`/subjects/${slug}/learn`} className={buttonVariants({ size: "sm" })}>
            <BookOpen className="w-4 h-4 mr-2" />
            Start Learning
          </Link>
          <span className="text-sm text-muted-foreground">
            {topics.length} topics, {totalNotes} notes
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold mb-6">Topics</h2>
        <SubjectTopicList slug={slug} topics={topics} noteCounts={noteCounts} />
      </div>
    </div>
  );
}
