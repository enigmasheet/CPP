"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/content/CodeBlock";
import { CheckCircle, XCircle, ArrowRight, Trophy } from "lucide-react";

interface GameQuestion {
  id: string;
  question: string;
  codeSnippet: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

interface OutputPredictorProps {
  questions: GameQuestion[];
  onComplete: (score: number) => void;
}

export default function OutputPredictor({ questions, onComplete }: OutputPredictorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];

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
    } else {
      setFinished(true);
      onComplete(score + (selected === current.correctAnswer ? 0 : 0));
    }
  };

  if (finished) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Score: {score} / {questions.length}
          </p>
          <Badge variant={score >= questions.length * 0.7 ? "default" : "secondary"}>
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
          <CardTitle className="text-lg">Output Predictor</CardTitle>
          <Badge variant="outline">
            {currentIndex + 1} / {questions.length}
          </Badge>
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
              <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>
        {showResult && current.explanation && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-2">
              {selected === current.correctAnswer ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-muted-foreground">{current.explanation}</p>
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
            Check Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
