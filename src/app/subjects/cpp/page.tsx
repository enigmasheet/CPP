import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code2, Play } from "lucide-react";

const topics = [
  { name: "Basics", slug: "basics", description: "Variables, Data Types, I/O, Operators", count: 8 },
  { name: "Control Flow", slug: "control-flow", description: "if/else, loops, switch, break/continue", count: 6 },
  { name: "Functions", slug: "functions", description: "Declaration, Overloading, Recursion", count: 6 },
  { name: "OOP", slug: "oop", description: "Classes, Inheritance, Polymorphism", count: 8 },
  { name: "Pointers", slug: "pointers", description: "Memory addresses, Dereferencing, Arithmetic", count: 6 },
  { name: "References", slug: "references", description: "Pass by reference, Const references", count: 4 },
  { name: "STL", slug: "stl", description: "Vectors, Maps, Sets, Iterators", count: 6 },
  { name: "Memory Management", slug: "memory-management", description: "new/delete, RAII, Memory leaks", count: 6 },
  { name: "Templates", slug: "templates", description: "Function/Class templates, Specialization", count: 4 },
  { name: "Modern C++", slug: "modern-cpp", description: "auto, lambda, smart pointers, move semantics", count: 6 },
];

export default function SubjectPage() {
  return (
    <AppShell>
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold tracking-tight">C++ Programming</h1>
          <p className="mt-2 text-muted-foreground">Master C++ from basics to advanced concepts</p>
          <div className="flex gap-2 mt-4">
            <Link href="/subjects/cpp/mcq" className={buttonVariants({ size: "sm" })}>
              <Play className="w-4 h-4 mr-2" />
              All Quizzes
            </Link>
            <Link href="/subjects/cpp/resources" className={buttonVariants({ size: "sm", variant: "outline" })}>
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/subjects/cpp/mcq/${topic.slug}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <Badge variant="secondary">
                      <Code2 className="w-3 h-3 mr-1" />
                      {topic.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
