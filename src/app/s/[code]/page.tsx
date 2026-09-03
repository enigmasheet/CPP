"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import CodeBlock from "@/components/content/CodeBlock";
import {
  ArrowRight,
  Loader2,
  ClipboardList,
  Gamepad2,
  Lock,
  CheckCircle,
  XCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface MCQOption {
  text: string;
}

interface MCQData {
  _id: string;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  explanation: string;
  topic: string;
  difficulty: string;
}

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
  timeLimit?: number;
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

interface LeaderboardEntry {
  rank: number;
  name?: string;
  studentCode: string;
  percentage: number;
  totalScore: number;
  totalPossible: number;
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

  const [mcqData, setMcqData] = useState<Record<string, MCQData>>({});
  const mcqIdsLoaded = useRef(new Set<string>());

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [sessionError, setSessionError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    fetch(`/api/sessions/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setSessionError(data.error);
        } else {
          setSession(data);
          if (data.timeLimit) {
            setRemainingTime(data.timeLimit * 60);
          }
          const saved = localStorage.getItem(`session_${code}`);
          if (saved) {
            setStudentCode(saved);
            const savedName = localStorage.getItem(`session_${code}_name`);
            if (savedName) setName(savedName);
            setJoined(true);
          }
        }
      })
      .catch(() => setSessionError("Failed to load session"));
  }, [code]);

  useEffect(() => {
    if (!joined || finished) return;
    const timer = setInterval(() => setTimeTaken((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [joined, finished]);

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0 || finished) return;
    const countdown = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [remainingTime, finished]);

  const submitAnswers = useCallback(async (finalAnswers: Answer[]) => {
    setSubmitting(true);
    const res = await fetch(`/api/sessions/${code}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentCode,
        name: name.trim() || undefined,
        answers: finalAnswers,
        timeTaken,
      }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
      setSubmitting(false);
      return;
    }
    setFinalResult(data);
    setFinished(true);
    setSubmitting(false);
  }, [code, studentCode, name, timeTaken]);

  useEffect(() => {
    if (remainingTime === null || remainingTime > 0 || finished || submitting || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    toast.error("Time's up! Submitting your answers...");
    submitAnswers(answers);
  }, [remainingTime, finished, submitting, answers, submitAnswers]);

  useEffect(() => {
    if (!joined || !session) return;

    const mcqIds = session.items
      .filter((item) => item.contentType === "mcq")
      .map((item) => item.contentId)
      .filter((id) => !mcqIdsLoaded.current.has(id));

    if (mcqIds.length === 0) return;

    const loadMcqs = async () => {
      const results = await Promise.all(
        mcqIds.map((id) =>
          fetch(`/api/mcq/${id}`)
            .then((r) => r.json())
            .then((data) => (data.error ? null : data))
            .catch(() => null)
        )
      );
      const map: Record<string, MCQData> = {};
      results.forEach((mcq) => {
        if (mcq && mcq._id) {
          map[mcq._id] = mcq;
        }
      });
      setMcqData((prev) => ({ ...prev, ...map }));
      mcqIds.forEach((id) => mcqIdsLoaded.current.add(id));
    };

    loadMcqs();
  }, [joined, session]);

  useEffect(() => {
    if (!finished || !studentCode) return;

    const loadLeaderboard = async () => {
      const res = await fetch(`/api/sessions/${code}/leaderboard`);
      const data = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    };

    loadLeaderboard();
  }, [finished, studentCode, code]);

  useEffect(() => {
    if (!joined || finished) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [joined, finished]);

  const handleJoin = async () => {
    setJoinError(null);
    const res = await fetch(`/api/sessions/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined }),
    });
    const data = await res.json();
    if (data.error) {
      setJoinError(data.error);
      return;
    }
    setStudentCode(data.studentCode);
    localStorage.setItem(`session_${code}`, data.studentCode);
    if (name.trim()) {
      localStorage.setItem(`session_${code}_name`, name.trim());
    }
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

  if (!session) {
    if (sessionError) {
      return (
        <AppShell>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <Card className="max-w-sm w-full">
              <CardContent className="pt-6 text-center">
                <Lock className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {sessionError === "Session not found"
                    ? "Invalid Session Code"
                    : "Session Unavailable"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {sessionError === "Session not found"
                    ? "This session code is invalid. Please check the code and try again."
                    : sessionError}
                </p>
                <Link href="/join">
                  <Button variant="outline">Try Another Code</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </AppShell>
      );
    }
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
              <p className="text-muted-foreground mb-4">
                This session is no longer accepting responses.
              </p>
              <Link href="/">
                <Button variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
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
                {session.timeLimit && ` · ${session.timeLimit} min time limit`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                />
                <p className="text-xs text-muted-foreground">Your name will be shown in the teacher&apos;s dashboard</p>
              </div>
              {joinError && (
                <p className="text-sm text-destructive text-center">{joinError}</p>
              )}
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
        <div className="mx-auto max-w-2xl px-4 py-12 space-y-6">
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
              <div className="flex justify-center gap-3">
                <Link href="/">
                  <Button variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/join">
                  <Button variant="outline">Join Another Session</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {leaderboard.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Leaderboard
                  <Badge variant="secondary" className="ml-2">
                    {leaderboard.length} students
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.studentCode}
                      className={`flex items-center justify-between p-2 rounded ${
                        entry.studentCode === studentCode
                          ? "bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm w-6 text-center">
                          {entry.rank}
                        </span>
                        <span className="text-sm font-medium">
                          {entry.name || `Student ${entry.studentCode}`}
                        </span>
                        {entry.studentCode === studentCode && (
                          <Badge variant="outline" className="text-[10px]">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {entry.totalScore}/{entry.totalPossible}
                        </span>
                        <Badge
                          variant={
                            entry.percentage >= 70
                              ? "default"
                              : entry.percentage >= 50
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {entry.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {answers.map((answer, idx) => {
                  const mcq = mcqData[answer.contentId || ""];
                  if (!mcq) return null;
                  const wasCorrect =
                    answer.selected !== null &&
                    mcq.options[answer.selected]?.text !== undefined;
                  return (
                    <div
                      key={idx}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {wasCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Q{idx + 1}. {mcq.question}
                          </p>
                          {mcq.codeSnippet && (
                            <div className="mt-2">
                              <CodeBlock code={mcq.codeSnippet} language="cpp" />
                            </div>
                          )}
                          <div className="mt-2 space-y-1">
                            {mcq.options.map((opt, oIdx) => {
                              const isStudentAnswer = answer.selected === oIdx;
                              return (
                                <div
                                  key={oIdx}
                                   className={`text-xs px-2 py-1 rounded ${
                                    isStudentAnswer && !wasCorrect
                                      ? "bg-destructive/10 text-destructive"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}. {opt.text}
                                </div>
                              );
                            })}
                          </div>
                          {mcq.explanation && (
                            <p className="mt-2 text-xs text-muted-foreground italic">
                              {mcq.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
  const currentMcq = currentItem?.contentType === "mcq"
    ? mcqData[currentItem.contentId]
    : null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = remainingTime !== null && remainingTime <= 60;

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground truncate flex-1 mr-4">
            {session.title}
          </p>
          <div className="flex items-center gap-4">
            {session.timeLimit && remainingTime !== null && (
              <span className={`text-sm font-mono font-medium px-2 py-0.5 rounded ${isLowTime ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                {formatTime(remainingTime)}
              </span>
            )}
            <Badge variant="outline">
              {currentIndex + 1}/{session.items.length}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              {formatTime(timeTaken)}
            </span>
          </div>
        </div>

        <Progress
          value={((currentIndex + 1) / session.items.length) * 100}
          className="mb-6"
        />

        {currentItem.contentType === "mcq" && !mcqData[currentItem.contentId] ? (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading question...</p>
            </CardContent>
          </Card>
        ) : currentItem.contentType === "game" ? (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="font-medium">Game: {currentItem.gameType}</p>
              <p className="text-sm text-muted-foreground mt-1">
                This game is coming soon. Skipping...
              </p>
              <Button onClick={handleNext} className="mt-4" size="lg">
                {currentIndex === session.items.length - 1 ? (
                  "Finish Session"
                ) : (
                  <>
                    Skip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : currentMcq ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{currentMcq.topic}</Badge>
                <Badge variant="outline">{currentMcq.difficulty}</Badge>
              </div>
              <p className="text-lg mb-4">{currentMcq.question}</p>
              {currentMcq.codeSnippet && (
                <div className="mb-4">
                  <CodeBlock code={currentMcq.codeSnippet} language="cpp" />
                </div>
              )}
              <div className="space-y-2">
                {currentMcq.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !showResult && setSelected(idx)}
                    disabled={showResult}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ${
                      showResult
                        ? idx === selected
                          ? selected ===
                            currentMcq.options.findIndex((o) => o.text === opt.text)
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : "border-red-500 bg-red-50 dark:bg-red-950"
                          : "border-border"
                        : selected === idx
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
              {showResult && currentMcq.explanation && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Explanation:</span>{" "}
                    {currentMcq.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Question not available</p>
              <Button onClick={handleNext} className="mt-4" size="lg">
                {currentIndex === session.items.length - 1 ? (
                  "Finish Session"
                ) : (
                  <>
                    Skip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {showResult ? (
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
