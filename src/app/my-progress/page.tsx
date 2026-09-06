"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, BarChart3, Clock, Trophy } from "lucide-react";
import { getTopics } from "@/config/subjects";
import Link from "next/link";
import { MAX_SCORE_PERCENTAGE, MINUTES_TO_SECONDS, LEADERBOARD_HIGH_THRESHOLD, LEADERBOARD_MEDIUM_THRESHOLD, STUDENT_TOPICS_FILTER, LEARN_PROGRESS_KEY_PREFIX } from "@/lib/constants";

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

interface QuizResult {
  code: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  topic: string;
  timeTaken: number;
}

interface TopicProgress {
  slug: string;
  name: string;
  completed: number;
  total: number;
  percent: number;
}

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

function getQuizResults(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("quiz-results") || "[]");
  } catch {
    return [];
  }
}

function loadTopicProgress(): TopicProgress[] {
  return STUDENT_TOPICS.map((t) => {
    const p = getTopicProgress(t.slug);
    return {
      slug: t.slug,
      name: t.name,
      completed: p.completed,
      total: p.total,
      percent: p.total > 0 ? Math.round((p.completed / p.total) * MAX_SCORE_PERCENTAGE) : 0,
    };
  });
}

export default function MyProgressPage() {
  const [topicProgress] = useState<TopicProgress[]>(() => loadTopicProgress());
  const [quizResults] = useState<QuizResult[]>(() => getQuizResults());

  const totalNotesCompleted = topicProgress.reduce((s, p) => s + p.completed, 0);
  const totalNotes = topicProgress.reduce((s, p) => s + p.total, 0);
  const overallPercent = totalNotes > 0 ? Math.round((totalNotesCompleted / totalNotes) * MAX_SCORE_PERCENTAGE) : 0;
  const topicsStarted = topicProgress.filter((p) => p.completed > 0).length;
  const topicsCompleted = topicProgress.filter((p) => p.percent === MAX_SCORE_PERCENTAGE).length;
  const avgQuizScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length)
    : 0;

  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            My Progress
          </h1>
          <p className="mt-2 text-muted-foreground">Track your learning journey and quiz performance</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{overallPercent}%</p>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{topicsCompleted}/{STUDENT_TOPICS.length}</p>
              <p className="text-xs text-muted-foreground">Topics Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Trophy className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{quizResults.length}</p>
              <p className="text-xs text-muted-foreground">Quizzes Taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <BarChart3 className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{avgQuizScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {totalNotesCompleted}/{totalNotes} notes completed across {topicsStarted} topics
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topicProgress.map((t) => (
                <Link key={t.slug} href={`/subjects/${SLUG}/learn/${t.slug}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    {t.percent === MAX_SCORE_PERCENTAGE ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : t.completed > 0 ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{t.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{t.percent}%</span>
                      </div>
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${t.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quiz History</CardTitle>
          </CardHeader>
          <CardContent>
            {quizResults.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No quizzes taken yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Join a session to start practicing!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {quizResults.slice().reverse().map((r, i) => (
                  <div key={`${r.code}-${i}`} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleDateString()}
                        </span>
                        {r.topic && <Badge variant="secondary" className="text-[10px]">{r.topic}</Badge>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold">{r.percentage}%</p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-0.5" />
                        {Math.floor(r.timeTaken / MINUTES_TO_SECONDS)}:{(r.timeTaken % MINUTES_TO_SECONDS).toString().padStart(2, "0")}
                      </p>
                    </div>
                    <Badge
                      className={
                        r.percentage >= LEADERBOARD_HIGH_THRESHOLD
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : r.percentage >= LEADERBOARD_MEDIUM_THRESHOLD
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {r.score}/{r.totalQuestions}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
