export interface Topic {
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface SubjectConfig {
  name: string;
  slug: string;
  description: string;
  topics: Topic[];
}

export const SUBJECTS: Record<string, SubjectConfig> = {
  cpp: {
    name: "C++ Programming",
    slug: "cpp",
    description: "Master C++ from basics to advanced concepts",
    topics: [
      { slug: "basics", name: "Basics", description: "Variables, Data Types, I/O, Operators", count: 12 },
      { slug: "control-flow", name: "Control Flow", description: "if/else, loops, switch, break/continue", count: 11 },
      { slug: "functions", name: "Functions", description: "Declaration, Overloading, Recursion", count: 9 },
      { slug: "oop", name: "OOP", description: "Classes, Inheritance, Polymorphism", count: 11 },
      { slug: "pointers", name: "Pointers", description: "Memory addresses, Dereferencing, Arithmetic", count: 9 },
      { slug: "references", name: "References", description: "Pass by reference, Const references, Rvalue references", count: 8 },
      { slug: "stl", name: "STL", description: "Vectors, Maps, Sets, Iterators", count: 10 },
      { slug: "memory-management", name: "Memory Management", description: "new/delete, RAII, Memory leaks", count: 8 },
      { slug: "templates", name: "Templates", description: "Function/Class templates, Specialization", count: 7 },
      { slug: "modern-cpp", name: "Modern C++", description: "auto, lambda, smart pointers, move semantics", count: 9 },
      { slug: "best-practices", name: "Best Practices", description: "Common pitfalls, coding standards, modern idioms", count: 11 },
    ],
  },
};

export function getSubject(slug: string): SubjectConfig | undefined {
  return SUBJECTS[slug];
}

export function getTopics(subjectSlug: string): Topic[] {
  return SUBJECTS[subjectSlug]?.topics ?? [];
}

export function getTopic(subjectSlug: string, topicSlug: string): Topic | undefined {
  return SUBJECTS[subjectSlug]?.topics.find((t) => t.slug === topicSlug);
}

export function getAllSubjectSlugs(): string[] {
  return Object.keys(SUBJECTS);
}

export function getTotalQuestions(subjectSlug: string): number {
  return getTopics(subjectSlug).reduce((sum, t) => sum + t.count, 0);
}
