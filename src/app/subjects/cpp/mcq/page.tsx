import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const topics = [
  { name: "Basics", slug: "basics", description: "Variables, Data Types, I/O" },
  { name: "Control Flow", slug: "control-flow", description: "if/else, loops, switch" },
  { name: "Functions", slug: "functions", description: "Declaration, Overloading" },
  { name: "OOP", slug: "oop", description: "Classes, Inheritance, Polymorphism" },
  { name: "Pointers", slug: "pointers", description: "Memory, Dereferencing" },
  { name: "References", slug: "references", description: "Pass by reference" },
  { name: "STL", slug: "stl", description: "Vectors, Maps, Sets" },
  { name: "Memory Management", slug: "memory-management", description: "new/delete, RAII" },
  { name: "Templates", slug: "templates", description: "Function/Class templates" },
  { name: "Modern C++", slug: "modern-cpp", description: "auto, lambda, smart pointers" },
];

export default function MCQTopicsPage() {
  return (
    <AppShell>
      <PageHeader
        title="MCQ Quizzes"
        description="Choose a topic to test your knowledge"
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/subjects/cpp/mcq/${topic.slug}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/subjects/cpp" className={buttonVariants({ variant: "ghost" })}>
            Back to C++ Overview
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
