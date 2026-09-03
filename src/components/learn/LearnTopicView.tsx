"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ChevronRight,
  List,
  BookOpen,
} from "lucide-react";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";

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
  const [currentNoteIdx, setCurrentNoteIdx] = useState(0);

  const currentNote = topicNotes[currentNoteIdx];
  const totalNotes = topicNotes.length;

  const currentTopicIdx = topics.findIndex((t) => t.slug === currentTopic.slug);
  const prevTopic = currentTopicIdx > 0 ? topics[currentTopicIdx - 1] : null;
  const nextTopic =
    currentTopicIdx < topics.length - 1 ? topics[currentTopicIdx + 1] : null;

  const totalTime = topicNotes.reduce((sum, n) => sum + n.estimatedMinutes, 0);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
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
            <p className="text-xs text-muted-foreground">
              {totalNotes} sections · ~{Math.floor(totalTime / 60)}h {totalTime % 60}m
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {topicNotes.map((note, idx) => (
              <button
                key={note.id}
                onClick={() => setCurrentNoteIdx(idx)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  idx === currentNoteIdx
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="font-mono text-xs opacity-60 mr-2">{note.id}.</span>
                {note.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top toolbar */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
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
                  onClick={() => setCurrentNoteIdx(Math.max(0, currentNoteIdx - 1))}
                  disabled={currentNoteIdx === 0}
                  aria-label="Previous section"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setCurrentNoteIdx(Math.min(totalNotes - 1, currentNoteIdx + 1))
                  }
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
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {topicNotes.length === 0 ? (
              <div className="border border-border rounded-lg p-8 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No content available for this topic yet.</p>
              </div>
            ) : currentNote ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-2xl font-bold">{currentNote.title}</h1>
                  <Badge className={DIFFICULTY_COLORS[currentNote.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                    {currentNote.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {currentNote.estimatedMinutes}m
                  </span>
                </div>
                <div className="max-w-none">
                  <MarkdownRenderer content={currentNote.content} />
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="border-t border-border bg-muted/30 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {prevTopic ? (
              <Link
                href={`/subjects/${slug}/learn/${prevTopic.slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {prevTopic.name}
              </Link>
            ) : (
              <div />
            )}
            {nextTopic ? (
              <Link
                href={`/subjects/${slug}/learn/${nextTopic.slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {nextTopic.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <Link
                href={`/subjects/${slug}/mcq`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Start Quizzes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
