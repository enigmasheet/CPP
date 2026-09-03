"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/content/CodeBlock";
import { CheckCircle, XCircle, ArrowRight, Trophy, Clock } from "lucide-react";
import { PASS_THRESHOLD_RATIO, ASCII_UPPERCASE_A, LOW_TIME_WARNING_SECONDS, DEFAULT_SPEED_CODE_TIME_LIMIT, TIMER_INTERVAL_MS } from "@/lib/constants";

interface SpeedQuestion {
  id: string;
  question: string;
  codeSnippet: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  difficulty: string;
}

interface SpeedCodeProps {
  questions: SpeedQuestion[];
  onComplete: (score: number) => void;
}

export default function SpeedCode({ questions, onComplete }: SpeedCodeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || DEFAULT_SPEED_CODE_TIME_LIMIT);

  const current = questions[currentIndex];
  const totalTime = current?.timeLimit || DEFAULT_SPEED_CODE_TIME_LIMIT;
  const progress = (timeLeft / totalTime) * 100;

  const handleTimeout = useCallback(() => {
    setShowResult(true);
  }, []);

  useEffect(() => {
    if (showResult || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentIndex, showResult, finished, handleTimeout]);

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(questions[currentIndex + 1]?.timeLimit || DEFAULT_SPEED_CODE_TIME_LIMIT);
    } else {
      setFinished(true);
      const lastCorrect = selected === current.correctAnswer ? 1 : 0;
      onComplete(score + (showResult ? 0 : lastCorrect));
    }
  };

  if (finished) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Speed Code Complete!</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Score: {score} / {questions.length}
          </p>
          <Badge variant={score >= questions.length * PASS_THRESHOLD_RATIO ? "default" : "secondary"}>
            {Math.round((score / questions.length) * 100)}%
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Speed Code</CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {currentIndex + 1} / {questions.length}
            </Badge>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className={`text-sm font-mono font-bold ${timeLeft <= LOW_TIME_WARNING_SECONDS ? "text-red-500" : ""}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              progress > 50 ? "bg-green-500" : progress > 20 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{current.question}</p>
        <CodeBlock code={current.codeSnippet} language="cpp" />
        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !showResult && setSelected(idx)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ${
                showResult
                  ? idx === current.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : idx === selected
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-border"
                  : selected === idx
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(ASCII_UPPERCASE_A + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>
        {showResult && current.id && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-2">
              {selected === current.correctAnswer ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-muted-foreground">
                {selected === null
                  ? `Time's up! The answer was: ${current.options[current.correctAnswer]}`
                  : selected === current.correctAnswer
                  ? "Correct!"
                  : `Incorrect. The answer was: ${current.options[current.correctAnswer]}`}
              </p>
            </div>
          </div>
        )}
        {showResult ? (
          <Button onClick={handleNext} className="w-full">
            {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCheck} disabled={selected === null} className="w-full">
            Submit Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
