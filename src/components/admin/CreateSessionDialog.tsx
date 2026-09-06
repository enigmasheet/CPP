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
import { GAME_TYPES, SESSION_CREATE_MCQ_FETCH_LIMIT, COPY_FEEDBACK_TIMEOUT_MS } from "@/lib/constants";

interface MCQ {
  _id: string;
  topic: string;
  question: string;
  difficulty: string;
}

interface ClassOption {
  _id: string;
  name: string;
  semester?: string;
}

export default function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState<ClassOption[]>([]);
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
    const res = await fetch(`/api/mcq?limit=${SESSION_CREATE_MCQ_FETCH_LIMIT}`);
    const data = await res.json();
    setMcqs(Array.isArray(data) ? data : []);
  };

  const loadClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      if (mcqs.length === 0) loadMcqs();
      loadClasses();
    }
    if (!isOpen) {
      setTitle("");
      setSection("");
      setSelectedClassId("");
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
    setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
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
      <DialogContent className="max-w-[95vw] sm:max-w-3xl lg:max-w-5xl max-h-[90vh] flex flex-col">
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
          <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Session Title *</label>
                <Input
                  placeholder="e.g. Week 3 - OOP Quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Class (optional)</label>
                <select
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                  value={selectedClassId}
                  onChange={(e) => {
                    const cls = classes.find((c) => c._id === e.target.value);
                    setSelectedClassId(e.target.value);
                    if (cls) setSection(cls.name);
                  }}
                >
                  <option value="">No class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}{cls.semester ? ` (${cls.semester})` : ""}
                    </option>
                  ))}
                </select>
                {selectedClassId && (
                  <p className="text-xs text-muted-foreground">
                    Section will be set to &quot;{classes.find((c) => c._id === selectedClassId)?.name}&quot;
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Time Limit (minutes)</label>
                <Input
                  type="number"
                  placeholder="No time limit"
                  min="1"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Leave empty for no limit.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Content Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "quiz" as const, label: "Quiz", icon: FlaskConical },
                    { id: "game" as const, label: "Games", icon: Puzzle },
                    { id: "mixed" as const, label: "Both", icon: Puzzle },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setContentType(opt.id)}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                        contentType === opt.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(contentType === "quiz" || contentType === "mixed") && (
              <div className="flex-1 min-h-0 flex flex-col gap-2">
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

                <div className="flex-1 min-h-0 overflow-y-auto border border-border rounded-xl divide-y divide-border">
                  {filteredMcqs.map((mcq) => (
                    <button
                      key={mcq._id}
                      onClick={() => toggleMcq(mcq._id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Select Games</label>
                  <span className="text-xs text-muted-foreground">
                    {selectedGames.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GAME_TYPES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => game.implemented && toggleGame(game.id)}
                      disabled={!game.implemented}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors text-left ${
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
                            <CheckCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <CircleDot className="w-4 h-4 text-muted-foreground" />
                          )
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{game.name}</p>
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
