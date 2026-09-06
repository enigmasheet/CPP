"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ChevronRight,
  List,
  BookOpen,
  CheckCircle,
  Home,
  Menu,
} from "lucide-react";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import { MAX_SCORE_PERCENTAGE, MINUTES_TO_SECONDS } from "@/lib/constants";

interface Topic {
  slug: string;
  name: string;
  description: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  difficulty: string;
  estimatedMinutes: number;
  topic: string;
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

function getStorageKey(slug: string, topicSlug: string) {
  return `learn-progress-${slug}-${topicSlug}`;
}

function NoteList({
  topicNotes,
  currentNoteIdx,
  completed,
  setCurrentNoteIdx,
  onMobileClose,
}: {
  topicNotes: Note[];
  currentNoteIdx: number;
  completed: Set<number>;
  setCurrentNoteIdx: (idx: number) => void;
  onMobileClose?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
      {topicNotes.map((note, idx) => (
        <button
          key={note.id}
          onClick={() => {
            setCurrentNoteIdx(idx);
            onMobileClose?.();
          }}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
            idx === currentNoteIdx
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {completed.has(note.id) ? (
            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
          )}
          <span className="truncate">{note.title}</span>
        </button>
      ))}
    </nav>
  );
}

export default function LearnTopicView({
  topics,
  topicNotes,
  currentTopic,
  slug,
  subjectName,
}: {
  topics: Topic[];
  topicNotes: Note[];
  currentTopic: Topic;
  slug: string;
  subjectName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(0);
  const noteContentRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem(getStorageKey(slug, currentTopic.slug));
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {}
    }
    return new Set();
  });

  const toggleComplete = (noteId: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      localStorage.setItem(
        getStorageKey(slug, currentTopic.slug),
        JSON.stringify([...next])
      );
      return next;
    });
  };

  const currentNote = topicNotes[currentNoteIdx];
  const totalNotes = topicNotes.length;

  const currentTopicIdx = topics.findIndex((t) => t.slug === currentTopic.slug);
  const prevTopic = currentTopicIdx > 0 ? topics[currentTopicIdx - 1] : null;
  const nextTopic =
    currentTopicIdx < topics.length - 1 ? topics[currentTopicIdx + 1] : null;

  const totalTime = topicNotes.reduce((sum, n) => sum + n.estimatedMinutes, 0);
  const completedCount = topicNotes.filter((n) => completed.has(n.id)).length;
  const progressPercent = totalNotes > 0 ? Math.round((completedCount / totalNotes) * MAX_SCORE_PERCENTAGE) : 0;

  const goToNote = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(totalNotes - 1, idx));
      setCurrentNoteIdx(clamped);
      noteContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalNotes]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToNote(currentNoteIdx - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNote(currentNoteIdx + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentNoteIdx, goToNote]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Desktop Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r border-border bg-muted/30 shrink-0 hidden lg:block`}
      >
        <div className="w-80 h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm">{currentTopic.name}</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
                aria-label="Collapse sidebar"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {completedCount}/{totalNotes} completed · ~{Math.floor(totalTime / MINUTES_TO_SECONDS)}h {totalTime % MINUTES_TO_SECONDS}m
            </p>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <Link
            href={`/subjects/${slug}/learn`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-b border-border"
          >
            <Home className="w-3.5 h-3.5" />
            All Topics
          </Link>
          <NoteList
            topicNotes={topicNotes}
            currentNoteIdx={currentNoteIdx}
            completed={completed}
            setCurrentNoteIdx={setCurrentNoteIdx}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top toolbar */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile sidebar trigger */}
              <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                <SheetTrigger
                  className="lg:hidden inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Open topic navigation"
                >
                  <Menu className="w-4 h-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border">
                      <h2 className="font-semibold text-sm">{currentTopic.name}</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        {completedCount}/{totalNotes} completed
                      </p>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/subjects/${slug}/learn`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-b border-border"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <Home className="w-3.5 h-3.5" />
                      All Topics
                    </Link>
                    <NoteList
                      topicNotes={topicNotes}
                      currentNoteIdx={currentNoteIdx}
                      completed={completed}
                      setCurrentNoteIdx={setCurrentNoteIdx}
                      onMobileClose={() => setMobileSidebarOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded hover:bg-muted transition-colors hidden lg:block"
                  aria-label="Expand sidebar"
                >
                  <List className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={`/subjects/${slug}`} className="hover:text-foreground">
                  {subjectName}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/subjects/${slug}/learn`} className="hover:text-foreground">
                  Learn
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground">{currentTopic.name}</span>
              </div>
            </div>
            {totalNotes > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentNoteIdx + 1} / {totalNotes}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => goToNote(currentNoteIdx - 1)}
                  disabled={currentNoteIdx === 0}
                  aria-label="Previous section"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => goToNote(currentNoteIdx + 1)}
                  disabled={currentNoteIdx === totalNotes - 1}
                  aria-label="Next section"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Note content */}
        <div ref={noteContentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {topicNotes.length === 0 ? (
              <div className="border border-border rounded-lg p-8 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No content available for this topic yet.</p>
              </div>
            ) : currentNote ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold">{currentNote.title}</h1>
                      <Badge className={DIFFICULTY_COLORS[currentNote.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                        {currentNote.difficulty}
                      </Badge>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {currentNote.estimatedMinutes} min read
                    </span>
                  </div>
                  <Button
                    variant={completed.has(currentNote.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleComplete(currentNote.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {completed.has(currentNote.id) ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
                <div className="max-w-none">
                  <MarkdownRenderer content={currentNote.content} />
                </div>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  {currentNoteIdx > 0 ? (
                    <Button
                      variant="outline"
                      onClick={() => goToNote(currentNoteIdx - 1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {topicNotes[currentNoteIdx - 1]?.title}
                    </Button>
                  ) : (
                    <div />
                  )}
                  {currentNoteIdx < totalNotes - 1 ? (
                    <Button onClick={() => goToNote(currentNoteIdx + 1)}>
                      {topicNotes[currentNoteIdx + 1]?.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : nextTopic ? (
                    <Link
                      href={`/subjects/${slug}/learn/${nextTopic.slug}`}
                      className={buttonVariants({ variant: "default" })}
                    >
                      {nextTopic.name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  ) : (
                    <Link
                      href={`/subjects/${slug}`}
                      className={buttonVariants({ variant: "default" })}
                    >
                      Back to {subjectName}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
