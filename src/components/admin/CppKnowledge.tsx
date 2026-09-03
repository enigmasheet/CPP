"use client";

import { useState } from "react";
import { cppKnowledge, type KnowledgeSection } from "@/data/cpp-knowledge";
import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  Lightbulb,
  GraduationCap,
  Book,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: List },
  { id: "bugs", label: "Hidden Bugs", icon: Bug },
  { id: "tricky", label: "Tricky Programs", icon: Lightbulb },
  { id: "teaching", label: "Teaching Programs", icon: GraduationCap },
  { id: "reference", label: "Quick Reference", icon: Book },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  bugs: "destructive",
  tricky: "default",
  teaching: "secondary",
  reference: "outline",
};

export default function CppKnowledge() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered =
    activeCategory === "all"
      ? cppKnowledge
      : cppKnowledge.filter((s) => s.category === activeCategory);

  const current = filtered[activeIndex];
  const total = filtered.length;

  const goNext = () => {
    if (activeIndex < total - 1) setActiveIndex(activeIndex + 1);
  };

  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveIndex(0);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-200 overflow-hidden border-r border-border bg-muted/30 flex-shrink-0`}
      >
        <div className="w-80 h-full overflow-y-auto p-3">
          {/* Category filter */}
          <div className="flex flex-wrap gap-1 mb-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.id)}
                  className="text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Section list */}
          <div className="space-y-0.5">
            {filtered.map((section: KnowledgeSection, idx: number) => (
              <button
                key={section.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  idx === activeIndex
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Badge
                  variant={
                    CATEGORY_COLORS[section.category] as
                      | "destructive"
                      | "default"
                      | "secondary"
                      | "outline"
                  }
                  className="text-[10px] mr-2"
                >
                  {section.category}
                </Badge>
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
              {activeIndex + 1} / {total}
            </Badge>
            <Badge
              variant={
                CATEGORY_COLORS[current?.category] as
                  | "destructive"
                  | "default"
                  | "secondary"
                  | "outline"
              }
            >
              {current?.category}
            </Badge>
            <span className="text-sm font-medium">{current?.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goPrev}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={activeIndex === total - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {current ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">{current.title}</h1>
              <MarkdownRenderer content={current.content} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No items in this category.
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background/50">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {current?.title}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={activeIndex === total - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
