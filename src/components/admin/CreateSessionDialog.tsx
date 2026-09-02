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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Link2, CheckCircle, CircleDot, Loader2 } from "lucide-react";
import Link from "next/link";

interface MCQ {
  _id: string;
  topic: string;
  question: string;
  difficulty: string;
}

const GAME_TYPES = [
  { id: "output-predictor", name: "Output Predictor" },
  { id: "bug-hunter", name: "Bug Hunter" },
  { id: "code-golf", name: "Code Golf" },
  { id: "speed-code", name: "Speed Code" },
  { id: "memory-match", name: "Memory Match" },
  { id: "syntax-scramble", name: "Syntax Scramble" },
];

export default function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [selectedMcqs, setSelectedMcqs] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [topicFilter, setTopicFilter] = useState("all");
  const [creating, setCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const loadMcqs = async () => {
    const res = await fetch("/api/mcq?limit=100");
    const data = await res.json();
    setMcqs(data);
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && mcqs.length === 0) loadMcqs();
    if (!isOpen) {
      setTitle("");
      setSelectedMcqs([]);
      setSelectedGames([]);
      setCreatedCode(null);
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
      ...selectedMcqs.map((id) => ({ contentType: "mcq", contentId: id })),
      ...selectedGames.map((id) => ({
        contentType: "game",
        contentId: id,
        gameType: id,
      })),
    ];

    const determinedType =
      selectedMcqs.length > 0 && selectedGames.length > 0
        ? "mixed"
        : selectedGames.length > 0
        ? "game"
        : "quiz";

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type: determinedType, items }),
    });

    if (res.ok) {
      const session = await res.json();
      setCreatedCode(session.code);
    }
    setCreating(false);
  };

  const filteredMcqs =
    topicFilter === "all"
      ? mcqs
      : mcqs.filter((m) => m.topic === topicFilter);

  const topics = [...new Set(mcqs.map((m) => m.topic))];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        New Session
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {createdCode ? "Session Created" : "Create New Session"}
          </DialogTitle>
        </DialogHeader>

        {createdCode ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">Share this code with students:</p>
            <div className="text-4xl font-mono font-bold tracking-widest">
              {createdCode}
            </div>
            <p className="text-sm text-muted-foreground">
              or share link:
            </p>
            <code className="text-sm bg-muted px-3 py-1 rounded">
              {typeof window !== "undefined" ? window.location.origin : ""}/s/{createdCode}
            </code>
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/s/${createdCode}`
                  );
                }}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Link href={`/admin/sessions/${createdCode}`} className={buttonVariants({ size: "sm" })}>
                View Session
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Title</label>
              <Input
                placeholder="e.g. Week 3 - OOP Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Select MCQs</label>
              <Select value={topicFilter} onValueChange={(v) => setTopicFilter(v || "all")}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMcqs.map((mcq) => (
                      <TableRow
                        key={mcq._id}
                        className="cursor-pointer"
                        onClick={() => toggleMcq(mcq._id)}
                      >
                        <TableCell>
                          {selectedMcqs.includes(mcq._id) ? (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          ) : (
                            <CircleDot className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-xs">{mcq.topic}</TableCell>
                        <TableCell className="text-xs max-w-50 truncate">
                          {mcq.question}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {mcq.difficulty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedMcqs.length} MCQs selected
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Select Games</label>
              <div className="grid grid-cols-2 gap-2">
                {GAME_TYPES.map((game) => (
                  <Button
                    key={game.id}
                    variant={
                      selectedGames.includes(game.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleGame(game.id)}
                    className="justify-start"
                  >
                    {selectedGames.includes(game.id) ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <CircleDot className="w-4 h-4 mr-2" />
                    )}
                    {game.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={
                !title ||
                (selectedMcqs.length === 0 && selectedGames.length === 0) ||
                creating
              }
              className="w-full"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create Session
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
