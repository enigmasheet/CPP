"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";
import { getTopics, getSubject } from "@/config/subjects";
import { notFound } from "next/navigation";
import { MAX_SCORE_PERCENTAGE, STUDENT_TOPICS_FILTER, LEARN_PROGRESS_KEY_PREFIX } from "@/lib/constants";

const SLUG = "cpp";
const SUBJECT = getSubject(SLUG);
const TOPICS = getTopics(SLUG).filter((t) => t.slug !== STUDENT_TOPICS_FILTER);

const TOPIC_NOTE_COUNTS: Record<string, number> = {
  basics: 14,
  "control-flow": 15,
  functions: 4,
  "arrays-strings": 5,
  "pointers-references": 3,
  structures: 1,
  oop: 8,
  "file-handling": 1,
  stl: 2,
  "memory-management": 5,
  templates: 5,
  "modern-cpp": 5,
  "best-practices": 4,
  practice: 3,
};

function getTopicProgress(topicSlug: string): { completed: number; total: number } {
  if (typeof window === "undefined") return { completed: 0, total: 0 };
  try {
    const saved = localStorage.getItem(`${LEARN_PROGRESS_KEY_PREFIX}${SLUG}-${topicSlug}`);
    const total = TOPIC_NOTE_COUNTS[topicSlug] ?? 0;
    if (!saved) return { completed: 0, total };
    const ids: number[] = JSON.parse(saved);
    return { completed: ids.length, total };
  } catch {
    return { completed: 0, total: 0 };
  }
}

function loadAllProgress(): Record<string, { completed: number; total: number }> {
  const map: Record<string, { completed: number; total: number }> = {};
  for (const topic of TOPICS) {
    map[topic.slug] = getTopicProgress(topic.slug);
  }
  return map;
}

function SubjectContent() {
  const [progressMap] = useState<Record<string, { completed: number; total: number }>>(() => loadAllProgress());

  if (!SUBJECT) return null;

  const totalCompleted = Object.values(progressMap).reduce((sum, p) => sum + p.completed, 0);
  const totalNotes = Object.values(progressMap).reduce((sum, p) => sum + p.total, 0);

  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold tracking-tight">{SUBJECT.name}</h1>
          <p className="mt-2 text-muted-foreground">{SUBJECT.description}</p>
          <div className="flex gap-4 mt-4 items-center">
            <Link href={`/subjects/${SLUG}/learn`} className={buttonVariants({ size: "sm" })}>
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
            </Link>
            {totalCompleted > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {totalCompleted}/{totalNotes} notes completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold mb-6">Topics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => {
            const progress = progressMap[topic.slug];
            const hasProgress = progress && progress.completed > 0;

            return (
              <Link key={topic.slug} href={`/subjects/${SLUG}/learn/${topic.slug}`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer group relative">
                  {hasProgress && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {topic.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                    {hasProgress && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {progress.completed}/{progress.total} notes
                          </span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round((progress.completed / progress.total) * MAX_SCORE_PERCENTAGE)}%` }}
                          />
                        </div>
                      </div>
                    )}
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

export default function SubjectPage() {
  if (!SUBJECT) return notFound();
  return <SubjectContent />;
}
