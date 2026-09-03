"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface MCQOption {
  text: string;
  isCorrect: boolean;
}

interface MCQ {
  _id: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

const EMPTY_FORM = {
  topic: "",
  question: "",
  codeSnippet: "",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ] as MCQOption[],
  explanation: "",
  difficulty: "medium" as "easy" | "medium" | "hard",
  tags: "",
};

const TOPICS = [
  "basics",
  "control-flow",
  "functions",
  "arrays-strings",
  "pointers-references",
  "structures",
  "oop",
  "file-handling",
  "stl",
  "practice",
];

export default function MCQManagement() {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MCQ | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMCQs();
  }, []);

  const loadMCQs = () => {
    fetch("/api/mcq?limit=500")
      .then((r) => r.json())
      .then((data) => {
        setMcqs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  const filtered = mcqs.filter((mcq) => {
    const matchesSearch =
      !search || mcq.question.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = topicFilter === "all" || mcq.topic === topicFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || mcq.difficulty === difficultyFilter;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (mcq: MCQ) => {
    setEditingId(mcq._id);
    setForm({
      topic: mcq.topic,
      question: mcq.question,
      codeSnippet: mcq.codeSnippet || "",
      options: mcq.options.map((o) => ({ ...o })),
      explanation: mcq.explanation,
      difficulty: mcq.difficulty,
      tags: mcq.tags.join(", "),
    });
    setDialogOpen(true);
  };

  const updateOption = (index: number, field: keyof MCQOption, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((o, i) =>
        i === index ? { ...o, [field]: value } : o
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      topic: form.topic,
      question: form.question,
      codeSnippet: form.codeSnippet || undefined,
      options: form.options,
      explanation: form.explanation,
      difficulty: form.difficulty,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/mcq/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to update");
        toast.success("MCQ updated");
      } else {
        const res = await fetch("/api/mcq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to create");
        toast.success("MCQ created");
      }
      setDialogOpen(false);
      loadMCQs();
    } catch {
      toast.error("Failed to save MCQ");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/mcq/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("MCQ deleted");
      setDeleteTarget(null);
      loadMCQs();
    } catch {
      toast.error("Failed to delete MCQ");
    }
    setDeleting(false);
  };

  const topics = [...new Set(mcqs.map((m) => m.topic))].sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">MCQ Management</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add MCQ
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={topicFilter} onValueChange={(v) => setTopicFilter(v || "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {TOPICS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v || "all")}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} of {mcqs.length} questions
      </p>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No MCQs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mcq) => (
            <Card key={mcq._id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{mcq.question}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {mcq.topic}
                      </Badge>
                      <Badge
                        variant={
                          mcq.difficulty === "easy"
                            ? "default"
                            : mcq.difficulty === "hard"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {mcq.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {mcq.options.filter((o) => o.isCorrect).length > 0
                          ? `Correct: ${mcq.options.find((o) => o.isCorrect)?.text.slice(0, 30)}...`
                          : "No correct answer"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(mcq)}
                      aria-label="Edit MCQ"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(mcq)}
                      aria-label="Delete MCQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit MCQ" : "Create MCQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Topic</label>
                <Select
                  value={form.topic}
                  onValueChange={(v) => setForm((p) => ({ ...p, topic: v || "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v: "easy" | "medium" | "hard") =>
                    setForm((p) => ({ ...p, difficulty: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Question</label>
              <Textarea
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                placeholder="What is the output of this code?"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Code Snippet (optional)</label>
              <Textarea
                value={form.codeSnippet}
                onChange={(e) =>
                  setForm((p) => ({ ...p, codeSnippet: e.target.value }))
                }
                placeholder="#include <iostream>..."
                rows={4}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2 mt-1">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForm((p) => ({
                          ...p,
                          options: p.options.map((o, i) => ({
                            ...o,
                            isCorrect: i === idx,
                          })),
                        }));
                      }}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        opt.isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-border"
                      }`}
                      aria-label={`Mark option ${idx + 1} as correct`}
                    >
                      {opt.isCorrect && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <Input
                      value={opt.text}
                      onChange={(e) => updateOption(idx, "text", e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Explanation</label>
              <Textarea
                value={form.explanation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, explanation: e.target.value }))
                }
                placeholder="Explain why this answer is correct..."
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="e.g. pointers, memory, syntax"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.topic || !form.question}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete MCQ</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this question? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
