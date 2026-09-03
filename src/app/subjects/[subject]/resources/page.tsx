"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeBlock from "@/components/content/CodeBlock";
import { Search, FileText, Code, Image, Loader2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Resource {
  _id: string;
  title: string;
  topic: string;
  type: "code" | "diagram" | "document";
  content: string;
  language?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: string;
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const TYPE_ICONS = {
  code: Code,
  diagram: Image,
  document: FileText,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => {
        setResources(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const topics = [...new Set(resources.map((r) => r.topic))].sort();

  const filtered = resources.filter((r) => {
    const matchesSearch =
      !search || r.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = topicFilter === "all" || r.topic === topicFilter;
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesTopic && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Browse code examples, diagrams, and documentation
          </p>
        </div>
        <Link
          href="/subjects/cpp"
          className={buttonVariants({ variant: "outline" })}
        >
          Back to Subjects
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
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
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || "all")}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="diagram">Diagram</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {resources.length === 0
              ? "No resources available yet."
              : "No resources match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((resource) => {
            const Icon = TYPE_ICONS[resource.type];
            return (
              <Card key={resource._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      {resource.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="capitalize">
                        {resource.topic}
                      </Badge>
                      <Badge className={DIFFICULTY_COLORS[resource.difficulty]}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {resource.type === "code" && resource.language ? (
                    <CodeBlock code={resource.content} language={resource.language} />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {resource.content}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
