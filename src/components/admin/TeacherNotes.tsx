"use client";

import { useState } from "react";
import { teacherNotes, NoteSection } from "@/data/teacher-notes";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronLeft, ChevronRight, List } from "lucide-react";

export default function TeacherNotes() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const current = teacherNotes[activeSection];
  const total = teacherNotes.length;

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
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-200 overflow-hidden border-r border-border bg-muted/30 flex-shrink-0`}
      >
        <div className="w-72 h-full overflow-y-auto p-3">
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Curriculum</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {total}
            </Badge>
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
                <span className="text-xs opacity-60 mr-2">{section.id}.</span>
                {section.title}
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
            >
              <List className="w-4 h-4" />
            </Button>
            <Badge variant="outline">
              {activeSection + 1} / {total}
            </Badge>
            <span className="text-sm font-medium">{current.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goPrev}
              disabled={activeSection === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={activeSection === total - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              {current.id}. {current.title}
            </h1>
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
