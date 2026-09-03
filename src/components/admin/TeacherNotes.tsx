"use client";

import { useState } from "react";
import { teacherNotes, type NoteSection } from "@/data/teacher-notes";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronLeft, ChevronRight, List, Clock } from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function TeacherNotes() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const current = teacherNotes[activeSection];
  const total = teacherNotes.length;

  const totalMinutes = teacherNotes.reduce((sum, s) => sum + s.estimatedMinutes, 0);

  const goNext = () => {
    if (activeSection < total - 1) setActiveSection(activeSection + 1);
  };

  const goPrev = () => {
    if (activeSection > 0) setActiveSection(activeSection - 1);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-200 overflow-hidden border-r border-border bg-muted/30 shrink-0`}
      >
        <div className="w-80 h-full overflow-y-auto p-3">
          <div className="flex items-center gap-2 mb-2 px-1">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Curriculum</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {total} sections
            </Badge>
          </div>
          <div className="flex items-center gap-1 px-1 mb-3 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>~{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total</span>
          </div>
          <div className="space-y-0.5">
            {teacherNotes.map((section: NoteSection, idx: number) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  idx === activeSection
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-60">{section.id}.</span>
                  <span className="flex-1 truncate">{section.title}</span>
                  <span className="text-[10px] opacity-60">{section.estimatedMinutes}m</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <List className="w-4 h-4" />
            </Button>
            <Badge variant="outline">
              {activeSection + 1} / {total}
            </Badge>
            <span className="text-sm font-medium">{current.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={DIFFICULTY_COLORS[current.difficulty]}>
              {current.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {current.estimatedMinutes}m
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goPrev}
                disabled={activeSection === 0}
                aria-label="Previous section"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goNext}
                disabled={activeSection === total - 1}
                aria-label="Next section"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold">
                {current.id}. {current.title}
              </h1>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className={DIFFICULTY_COLORS[current.difficulty]}>
                {current.difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ~{current.estimatedMinutes} minutes
              </span>
            </div>
            <MarkdownRenderer content={current.content} />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background/50">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={activeSection === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {current.title}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={activeSection === total - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
