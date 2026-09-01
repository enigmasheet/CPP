"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Shield,
  Plus,
  Eye,
  EyeOff,
  Link2,
  CheckCircle,
  CircleDot,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface MCQ {
  _id: string;
  topic: string;
  question: string;
  difficulty: string;
}

interface Session {
  _id: string;
  code: string;
  title: string;
  type: string;
  isActive: boolean;
  items: { contentType: string; contentId: string; gameType?: string }[];
  createdAt: string;
}

const GAME_TYPES = [
  { id: "output-predictor", name: "Output Predictor" },
  { id: "bug-hunter", name: "Bug Hunter" },
  { id: "code-golf", name: "Code Golf" },
  { id: "speed-code", name: "Speed Code" },
  { id: "memory-match", name: "Memory Match" },
  { id: "syntax-scramble", name: "Syntax Scramble" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setIsAuthenticated(true);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid password");
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <CardTitle>Teacher Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {authError && (
                  <p className="text-sm text-destructive">{authError}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Teacher Dashboard" description="Manage sessions and view results">
        <CreateSessionDialog />
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <SessionsList />
      </div>
    </AppShell>
  );
}

function CreateSessionDialog() {
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
      <DialogTrigger>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
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
                        <TableCell className="text-xs max-w-[200px] truncate">
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

function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      });
  }, []);

  const toggleActive = async (code: string, isActive: boolean) => {
    await fetch(`/api/sessions/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setSessions((prev) =>
      prev.map((s) => (s.code === code ? { ...s, isActive: !isActive } : s))
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session._id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="font-mono text-lg font-bold tracking-wider">
                  {session.code}
                </div>
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.items.length} items
                    <span className="mx-2">-</span>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={session.isActive ? "default" : "secondary"}>
                  {session.isActive ? "Active" : "Closed"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(session.code, session.isActive)}
                >
                  {session.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Link
                  href={`/admin/sessions/${session.code}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <Link2 className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
