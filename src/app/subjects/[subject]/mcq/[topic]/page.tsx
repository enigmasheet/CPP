"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface Question {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  difficulty: string;
  topic: string;
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const params = useParams();
  const subject = params.subject as string;
  const topic = params.topic as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (!quizStarted) return;
    const timer = setInterval(() => setTimeTaken((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [quizStarted]);

  useEffect(() => {
    if (!topic) return;
    fetch("/api/quiz/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, limit: 10 }),
    })
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions ?? []);
        setQuizStarted(true);
      });
  }, [topic]);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === questions[currentIdx].correctAnswer) {
      setCorrectCount((c) => c + 1);
      toast.success("Correct!");
    } else {
      toast.error("Wrong answer");
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setScore(finalScore);
      setQuizFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <AppShell>
        <LoadingSpinner />
      </AppShell>
    );
  }

  if (quizFinished) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
              <div className="text-6xl font-bold mb-4">{score}%</div>
              <p className="text-muted-foreground mb-2">
                {correctCount} / {questions.length} correct
              </p>
              <p className="text-muted-foreground mb-6">
                Time: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, "0")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => window.location.reload()}>Try Again</Button>
                <Link href={`/subjects/${subject}/mcq`} className={buttonVariants({ variant: "outline" })}>Other Topics</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const q = questions[currentIdx];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/subjects/${subject}/mcq`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {currentIdx + 1}/{questions.length}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">
              {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <Progress value={((currentIdx + 1) / questions.length) * 100} className="mb-6" />

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={q.difficulty === "easy" ? "default" : q.difficulty === "medium" ? "secondary" : "destructive"}>
                {q.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground">{q.topic}</span>
            </div>

            <p className="text-lg mb-4 whitespace-pre-wrap">{q.question}</p>

            {q.codeSnippet && (
              <pre className="bg-muted p-4 rounded-lg text-sm text-green-400 overflow-x-auto font-mono mb-4">
                {q.codeSnippet}
              </pre>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3 mb-6">
          {q.options.map((option, idx) => {
            let variant: "default" | "outline" | "destructive" = "outline";
            let className = "";

            if (showResult && idx === q.correctAnswer) {
              variant = "default";
              className = "bg-green-500/20 border-green-500 text-green-400";
            } else if (showResult && idx === selected) {
              variant = "destructive";
              className = "bg-red-500/20 border-red-500 text-red-400";
            } else if (selected === idx) {
              variant = "default";
            }

            return (
              <Button
                key={idx}
                variant={variant}
                className={`w-full justify-start text-left h-auto p-4 ${className}`}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
              >
                <span className="font-mono text-sm text-muted-foreground mr-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </Button>
            );
          })}
        </div>

        {showResult ? (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className={`p-4 rounded-lg ${selected === q.correctAnswer ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {selected === q.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <p className="font-semibold">
                      {selected === q.correctAnswer ? "Correct!" : "Wrong!"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{q.explanation}</p>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentIdx === questions.length - 1 ? (
                "Finish Quiz"
              ) : (
                <>
                  Next Question
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
