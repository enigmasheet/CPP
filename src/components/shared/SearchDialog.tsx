"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, HelpCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";

interface SearchResult {
  id: string;
  title: string;
  type: "topic" | "question" | "resource";
  url: string;
  snippet: string;
}

interface SearchData {
  topics: SearchResult[];
  questions: SearchResult[];
  resources: SearchResult[];
}

const TYPE_ICONS = {
  topic: BookOpen,
  question: HelpCircle,
  resource: FileText,
} as const;

const TYPE_LABELS = {
  topic: "Topic",
  question: "Question",
  resource: "Resource",
} as const;

export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchData>({ topics: [], questions: [], resources: [] });
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ topics: [], questions: [], resources: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ topics: [], questions: [], resources: [] });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      requestAnimationFrame(() => {
        setQuery("");
        setResults({ topics: [], questions: [], resources: [] });
      });
    }
  }, [open]);

  const totalResults = results.topics.length + results.questions.length + results.resources.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, questions, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
        {query.length >= 2 && (
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Searching...</p>
            ) : totalResults === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
            ) : (
              <div className="space-y-4">
                {(["topic", "question", "resource"] as const).map((type) => {
                  const items = results[type === "topic" ? "topics" : type === "question" ? "questions" : "resources"];
                  if (items.length === 0) return null;
                  const Icon = TYPE_ICONS[type];
                  return (
                    <div key={type}>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {TYPE_LABELS[type]} ({items.length})
                      </p>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => onOpenChange(false)}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.snippet}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
