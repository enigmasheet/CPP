"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { getTopics } from "@/config/subjects";
import { MINUTES_TO_SECONDS, MAX_SCORE_PERCENTAGE, STUDENT_TOPICS_FILTER } from "@/lib/constants";

const SLUG = "cpp";
const STUDENT_TOPICS = getTopics(SLUG).filter((t) => t.slug !== STUDENT_TOPICS_FILTER);

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

function getStorageKey(topicSlug: string) {
  return `learn-progress-${SLUG}-${topicSlug}`;
}

function getTopicProgress(topicSlug: string, totalNotes: number): { completed: number; percent: number } {
  if (typeof window === "undefined") return { completed: 0, percent: 0 };
  try {
    const saved = localStorage.getItem(getStorageKey(topicSlug));
    if (!saved) return { completed: 0, percent: 0 };
    const ids: number[] = JSON.parse(saved);
    const completed = ids.length;
    const percent = totalNotes > 0 ? Math.round((completed / totalNotes) * MAX_SCORE_PERCENTAGE) : 0;
    return { completed, percent };
  } catch {
    return { completed: 0, percent: 0 };
  }
}

function loadAllProgress(): Record<string, { completed: number; percent: number }> {
  const map: Record<string, { completed: number; percent: number }> = {};
  for (const topic of STUDENT_TOPICS) {
    const noteCount = TOPIC_NOTE_COUNTS[topic.slug] ?? 0;
    map[topic.slug] = getTopicProgress(topic.slug, noteCount);
  }
  return map;
}

export default function LearnPage() {
  const [progressMap] = useState<Record<string, { completed: number; percent: number }>>(() => {
    if (typeof window === "undefined") return {};
    return loadAllProgress();
  });

  const totalNotes = STUDENT_TOPICS.reduce((sum, t) => sum + (TOPIC_NOTE_COUNTS[t.slug] ?? 0), 0);
  const totalCompleted = Object.values(progressMap).reduce((sum, p) => sum + p.completed, 0);
  const totalMinutes = STUDENT_TOPICS.reduce((sum, t) => {
    const noteCount = TOPIC_NOTE_COUNTS[t.slug] ?? 0;
    return sum + noteCount * MINUTES_TO_SECONDS;
  }, 0);

  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href={`/subjects/${SLUG}`} className="hover:text-foreground">
              C++ Programming
            </Link>
            <span>/</span>
            <span>Learn</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Learn C++</h1>
          <p className="mt-2 text-muted-foreground">
            {STUDENT_TOPICS.length} sections covering fundamentals to advanced concepts
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
            {totalCompleted > 0 && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                {totalCompleted}/{totalNotes} completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_TOPICS.map((topic) => {
            const noteCount = TOPIC_NOTE_COUNTS[topic.slug] ?? 0;
            const topicTime = noteCount * MINUTES_TO_SECONDS;
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
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{noteCount} sections</span>
                      <span>~{Math.round(topicTime / MINUTES_TO_SECONDS)}m</span>
                      {hasProgress && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {progress.completed}/{noteCount}
                        </span>
                      )}
                    </div>
                    {hasProgress && (
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
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
