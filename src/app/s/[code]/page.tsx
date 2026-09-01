"use client";

import { useState, useEffect, use } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Loader2,
  ClipboardList,
  Gamepad2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface SessionItem {
  contentType: string;
  contentId: string;
  gameType?: string;
}

interface SessionInfo {
  title: string;
  type: string;
  items: SessionItem[];
  isActive: boolean;
}

interface Answer {
  contentId: string | undefined;
  contentType: string | undefined;
  selected: number | null;
}

interface FinalResult {
  totalScore: number;
  totalPossible: number;
  percentage: number;
}

export default function StudentSessionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    fetch(`/api/sessions/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setSession(data);
        }
      });
  }, [code]);

  useEffect(() => {
    if (!joined || finished) return;
    const timer = setInterval(() => setTimeTaken((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [joined, finished]);

  const handleJoin = async () => {
    const res = await fetch(`/api/sessions/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined }),
    });
    const data = await res.json();
    setStudentCode(data.studentCode);
    setJoined(true);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    const currentItem = session?.items[currentIndex];
    const answer = {
      contentId: currentItem?.contentId,
      contentType: currentItem?.contentType,
      selected,
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex < (session?.items.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      submitAnswers(newAnswers);
    }
  };

  const submitAnswers = async (finalAnswers: Answer[]) => {
    setSubmitting(true);
    const res = await fetch(`/api/sessions/${code}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentCode,
        answers: finalAnswers,
      }),
    });
    const data = await res.json();
    setFinalResult(data);
    setFinished(true);
    setSubmitting(false);
  };

  if (!session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!session.isActive) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="max-w-sm w-full">
            <CardContent className="pt-6 text-center">
              <Lock className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Session Closed</h2>
              <p className="text-muted-foreground">
                This session is no longer accepting responses.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (!joined) {
    return (
      <AppShell>
        <PageHeader title={session.title} />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
              <ClipboardList className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <CardTitle>Ready to Start</CardTitle>
              <p className="text-sm text-muted-foreground">
                {session.items.length} exercises
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button onClick={handleJoin} className="w-full">
                Start Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (finished && finalResult) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-3xl font-bold mb-4">Session Complete!</h1>
              <div className="text-6xl font-bold mb-4">
                {finalResult.percentage}%
              </div>
              <p className="text-muted-foreground mb-2">
                {finalResult.totalScore} / {finalResult.totalPossible} points
              </p>
              <p className="text-muted-foreground mb-6">
                Time: {Math.floor(timeTaken / 60)}:
                {(timeTaken % 60).toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-muted-foreground">
                You can close this window now.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (submitting) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-muted-foreground mt-4">Submitting your answers...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentItem = session.items[currentIndex];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground truncate flex-1 mr-4">
            {session.title}
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {currentIndex + 1}/{session.items.length}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              {Math.floor(timeTaken / 60)}:
              {(timeTaken % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <Progress
          value={((currentIndex + 1) / session.items.length) * 100}
          className="mb-6"
        />

        <p className="text-center text-muted-foreground mb-4">
          {currentItem.contentType === "mcq" ? "Multiple Choice" : "Game"}
        </p>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-lg mb-4 text-muted-foreground text-center">
              Exercise {currentIndex + 1} of {session.items.length}
            </p>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            This exercise type is coming soon.
          </p>
        </div>

        {showResult ? (
          <>
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIndex === session.items.length - 1 ? (
                "Finish Session"
              ) : (
                <>
                  Next Exercise
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleCheck}
            disabled={selected === null}
            className="w-full"
            size="lg"
          >
            Check Answer
          </Button>
        )}
      </div>
    </AppShell>
  );
}
