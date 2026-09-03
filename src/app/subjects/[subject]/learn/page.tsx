import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { getSubject, getTopics } from "@/config/subjects";
import { notFound } from "next/navigation";
import { teacherNotes } from "@/data/teacher-notes";

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default async function LearnPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) return notFound();
  const topics = getTopics(slug);

  const studentNotes = teacherNotes.filter(n => !n.teacherOnly);
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
          <h1 className="text-3xl font-bold tracking-tight">Learn {subject.name.replace(" Programming", "")}</h1>
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
              ~{Math.round(totalMinutes / 60)} hours
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
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
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Full Curriculum</h2>
          <div className="grid gap-3">
            {teacherNotes.filter(n => !n.teacherOnly).map((note) => (
              <Link
                key={note.id}
                href={`/subjects/${slug}/learn/${note.topic}`}
              >
                <Card className="transition-all hover:border-primary/50 cursor-pointer">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">
                          {note.id}
                        </span>
                        <span className="text-sm font-medium truncate">{note.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${DIFFICULTY_COLORS[note.difficulty]}`}>
                          {note.difficulty}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {note.estimatedMinutes}m
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
