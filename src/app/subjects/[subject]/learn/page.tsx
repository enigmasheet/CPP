import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { getSubject, getTopics } from "@/config/subjects";
import { notFound } from "next/navigation";
import { teacherNotes } from "@/data/teacher-notes";
import { MINUTES_TO_SECONDS } from "@/lib/constants";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return notFound();
  const topics = getTopics(slug);

  const studentNotes = teacherNotes.filter((n) => !n.teacherOnly);
  const totalMinutes = studentNotes.reduce((sum, n) => sum + n.estimatedMinutes, 0);

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
          <h1 className="text-3xl font-bold tracking-tight">
            Learn {subject.name.replace(" Programming", "")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {studentNotes.length} sections covering fundamentals to advanced concepts
          </p>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {studentNotes.length} sections
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~{Math.floor(totalMinutes / MINUTES_TO_SECONDS)}h {totalMinutes % MINUTES_TO_SECONDS}m
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const topicNotes = studentNotes.filter((n) => n.topic === topic.slug);
            const topicTime = topicNotes.reduce((sum, n) => sum + n.estimatedMinutes, 0);
            return (
              <Link key={topic.slug} href={`/subjects/${slug}/learn/${topic.slug}`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {topic.name}
                      </CardTitle>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{topicNotes.length} sections</span>
                      <span>~{topicTime}m</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
