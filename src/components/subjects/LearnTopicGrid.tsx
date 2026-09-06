"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  MINUTES_TO_SECONDS,
  MAX_SCORE_PERCENTAGE,
  LEARN_PROGRESS_KEY_PREFIX,
} from "@/lib/constants";
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
): { completed: number; percent: number } {
  if (typeof window === "undefined") return { completed: 0, percent: 0 };
  try {
    const saved = localStorage.getItem(`${LEARN_PROGRESS_KEY_PREFIX}${slug}-${topicSlug}`);
    if (!saved) return { completed: 0, percent: 0 };
    const ids: number[] = JSON.parse(saved);
    const completed = ids.length;
    const percent = totalNotes > 0 ? Math.round((completed / totalNotes) * MAX_SCORE_PERCENTAGE) : 0;
    return { completed, percent };
  } catch {
    return { completed: 0, percent: 0 };
  }
}

export default function LearnTopicGrid({ slug, topics, noteCounts }: Props) {
  const [progressMap] = useState(() => {
    const map: Record<string, { completed: number; percent: number }> = {};
    for (const topic of topics) {
      map[topic.slug] = getTopicProgress(slug, topic.slug, noteCounts[topic.slug] ?? 0);
    }
    return map;
  });

  const totalNotes = topics.reduce((sum, t) => sum + (noteCounts[t.slug] ?? 0), 0);
  const totalCompleted = Object.values(progressMap).reduce((sum, p) => sum + p.completed, 0);

  return (
    <>
      {totalCompleted > 0 && (
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          {totalCompleted}/{totalNotes} completed
        </p>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const noteCount = noteCounts[topic.slug] ?? 0;
          const topicTime = noteCount * MINUTES_TO_SECONDS;
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
    </>
  );
}
