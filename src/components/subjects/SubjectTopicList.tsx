"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { MAX_SCORE_PERCENTAGE, LEARN_PROGRESS_KEY_PREFIX } from "@/lib/constants";
import type { Topic } from "@/config/subjects";

interface Props {
  slug: string;
  topics: Topic[];
  noteCounts: Record<string, number>;
}

function getTopicProgress(
  slug: string,
  topicSlug: string,
  totalNotes: number
): { completed: number; total: number; percent: number } {
  if (typeof window === "undefined") return { completed: 0, total: totalNotes, percent: 0 };
  try {
    const saved = localStorage.getItem(`${LEARN_PROGRESS_KEY_PREFIX}${slug}-${topicSlug}`);
    if (!saved) return { completed: 0, total: totalNotes, percent: 0 };
    const ids: number[] = JSON.parse(saved);
    const completed = ids.length;
    const percent = totalNotes > 0 ? Math.round((completed / totalNotes) * MAX_SCORE_PERCENTAGE) : 0;
    return { completed, total: totalNotes, percent };
  } catch {
    return { completed: 0, total: totalNotes, percent: 0 };
  }
}

export default function SubjectTopicList({ slug, topics, noteCounts }: Props) {
  const [progressMap] = useState(() => {
    const map: Record<string, { completed: number; total: number; percent: number }> = {};
    for (const topic of topics) {
      map[topic.slug] = getTopicProgress(slug, topic.slug, noteCounts[topic.slug] ?? 0);
    }
    return map;
  });

  const totalCompleted = Object.values(progressMap).reduce((sum, p) => sum + p.completed, 0);
  const totalNotes = Object.values(progressMap).reduce((sum, p) => sum + p.total, 0);

  return (
    <>
      {totalCompleted > 0 && (
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {totalCompleted}/{totalNotes} notes completed
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const progress = progressMap[topic.slug];
          const hasProgress = progress && progress.completed > 0;

          return (
            <Link key={topic.slug} href={`/subjects/${slug}/learn/${topic.slug}`}>
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
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
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
    </>
  );
}
