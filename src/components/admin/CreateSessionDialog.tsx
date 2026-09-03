"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  CheckCircle,
  CircleDot,
  Loader2,
  Lock,
  Puzzle,
  FlaskConical,
  Search,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

interface MCQ {
  _id: string;
  topic: string;
  question: string;
  difficulty: string;
}

const GAME_TYPES = [
  { id: "output-predictor", name: "Output Predictor", description: "Predict C++ program output", implemented: false },
  { id: "bug-hunter", name: "Bug Hunter", description: "Find bugs in code snippets", implemented: false },
  { id: "code-golf", name: "Code Golf", description: "Solve problems with fewest characters", implemented: false },
  { id: "speed-code", name: "Speed Code", description: "Race against time to code", implemented: false },
  { id: "memory-match", name: "Memory Match", description: "Match concepts with definitions", implemented: false },
  { id: "syntax-scramble", name: "Syntax Scramble", description: "Arrange code in correct order", implemented: false },
];

export default function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [selectedMcqs, setSelectedMcqs] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState("all");
  const [contentType, setContentType] = useState<"quiz" | "game" | "mixed">("quiz");
  const [creating, setCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");

  const loadMcqs = async () => {
    const res = await fetch("/api/mcq?limit=100");
    const data = await res.json();
    setMcqs(Array.isArray(data) ? data : []);
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && mcqs.length === 0) loadMcqs();
    if (!isOpen) {
      setTitle("");
      setSection("");
      setSelectedMcqs([]);
      setSelectedGames([]);
      setContentType("quiz");
      setCreatedCode(null);
      setSearchQuery("");
      setCopied(false);
      setTimeLimit("");
    }
  };

  const toggleMcq = (id: string) => {
    setSelectedMcqs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGame = (id: string) => {
    setSelectedGames((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!title || (selectedMcqs.length === 0 && selectedGames.length === 0)) return;

    setCreating(true);
    const items = [
      ...selectedMcqs.map((id) => ({ contentType: "mcq" as const, contentId: id })),
      ...selectedGames.map((id) => ({
        contentType: "game" as const,
        contentId: id,
        gameType: id,
      })),
    ];

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type: contentType,
        items,
        section: section || undefined,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      }),
    });

    if (res.ok) {
      const session = await res.json();
      setCreatedCode(session.code);
    }
    setCreating(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/s/${createdCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMcqs = mcqs.filter((m) => {
    const matchesTopic = topicFilter === "all" || m.topic === topicFilter;
    const matchesSearch = searchQuery === "" || 
      m.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const topics = [...new Set(mcqs.map((m) => m.topic))];

  const selectedCount = selectedMcqs.length + selectedGames.length;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          <Button size="sm" />
        }
      >
        <Plus className="w-4 h-4 mr-2" />
        New Session
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {createdCode ? "Session Created" : "Create New Session"}
          </DialogTitle>
        </DialogHeader>

        {createdCode ? (
          <div className="py-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">Share this code with students:</p>
                <div className="text-3xl sm:text-5xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] text-foreground">
                  {createdCode}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">or share link:</p>
                <code className="text-sm bg-muted px-4 py-2 rounded-lg inline-block">
                  {typeof window !== "undefined" ? window.location.origin : ""}/s/{createdCode}
                </code>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Link href={`/admin/sessions/${createdCode}`} className={buttonVariants({ size: "sm" })}>
                  View Session
                </Link>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setCreatedCode(null);
                  setTitle("");
                  setSection("");
                  setSelectedMcqs([]);
                  setSelectedGames([]);
                  setContentType("quiz");
                  setTimeLimit("");
                }}
              >
                Create Another Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Title *</label>
                <Input
                  placeholder="e.g. Week 3 - OOP Quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Section</label>
                <Input
                  placeholder="e.g. CS101 - Section A"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Limit (minutes)</label>
              <Input
                type="number"
                placeholder="No time limit"
                min="1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no time limit. Session auto-closes when time expires.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Content Type</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: "quiz" as const, label: "MCQ Quiz", icon: FlaskConical, description: "Test knowledge with questions" },
                  { id: "game" as const, label: "Games", icon: Puzzle, description: "Interactive learning games" },
                  { id: "mixed" as const, label: "Both", icon: Puzzle, description: "Quiz and games combined" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setContentType(opt.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm ${
                      contentType === opt.id
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <opt.icon className="w-6 h-6" />
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {(contentType === "quiz" || contentType === "mixed") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Select MCQs</label>
                  <span className="text-xs text-muted-foreground">
                    {selectedMcqs.length} selected
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setTopicFilter("all")}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      topicFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({mcqs.length})
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopicFilter(t)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        topicFilter === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t} ({mcqs.filter((m) => m.topic === t).length})
                    </button>
                  ))}
                </div>

                <div className="max-h-64 overflow-y-auto border border-border rounded-xl divide-y divide-border">
                  {filteredMcqs.map((mcq) => (
                    <button
                      key={mcq._id}
                      onClick={() => toggleMcq(mcq._id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedMcqs.includes(mcq._id)
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {selectedMcqs.includes(mcq._id) ? (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <CircleDot className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{mcq.question}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0 hidden sm:flex">
                        <Badge variant="outline" className="text-[10px]">{mcq.topic}</Badge>
                        <Badge variant="outline" className="text-[10px]">{mcq.difficulty}</Badge>
                      </div>
                    </button>
                  ))}
                  {filteredMcqs.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-6">
                      No MCQs found.
                    </p>
                  )}
                </div>
              </div>
            )}

            {(contentType === "game" || contentType === "mixed") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Select Games</label>
                  <span className="text-xs text-muted-foreground">
                    {selectedGames.length} selected
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {GAME_TYPES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => game.implemented && toggleGame(game.id)}
                      disabled={!game.implemented}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                        !game.implemented
                          ? "border-border opacity-60 cursor-not-allowed"
                          : selectedGames.includes(game.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="shrink-0">
                        {game.implemented ? (
                          selectedGames.includes(game.id) ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <CircleDot className="w-5 h-5 text-muted-foreground" />
                          )
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{game.name}</p>
                        <p className="text-[10px] text-muted-foreground">{game.description}</p>
                      </div>
                      {!game.implemented && (
                        <Badge variant="secondary" className="text-[10px] shrink-0">Soon</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!createdCode && (
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={!title || selectedCount === 0 || creating}
              className="w-full sm:w-auto"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create Session ({selectedCount} items)
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
