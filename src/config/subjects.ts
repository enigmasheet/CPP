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
      { slug: "basics", name: "Basics", description: "Introduction, Variables, Data Types, I/O, Operators", count: 20 },
      { slug: "control-flow", name: "Control Flow", description: "Conditionals, Loops, switch, break/continue", count: 18 },
      { slug: "functions", name: "Functions", description: "Declaration, Parameters, Return Values, Overloading, Lambdas", count: 16 },
      { slug: "arrays-strings", name: "Arrays & Strings", description: "Array Indexing, Loops, Strings, getline()", count: 5 },
      { slug: "pointers-references", name: "Pointers & References", description: "Memory Addresses, Dereferencing, Smart Pointers", count: 15 },
      { slug: "structures", name: "Structures", description: "Custom Data Types, Struct Usage", count: 1 },
      { slug: "oop", name: "OOP", description: "Classes, Inheritance, Polymorphism, Exception Handling", count: 19 },
      { slug: "file-handling", name: "File Handling", description: "File I/O, Reading/Writing Files", count: 1 },
      { slug: "stl", name: "STL", description: "Standard Template Library, Containers, Algorithms", count: 17 },
      { slug: "memory-management", name: "Memory Management", description: "Dynamic Memory, Smart Pointers, RAII", count: 5 },
      { slug: "templates", name: "Templates", description: "Function/Class Templates, Specialization, Concepts", count: 5 },
      { slug: "modern-cpp", name: "Modern C++", description: "auto, Lambdas, Move Semantics, Structured Bindings", count: 5 },
      { slug: "best-practices", name: "Best Practices", description: "Naming, Code Organization, Performance", count: 5 },
      { slug: "practice", name: "Practice & Projects", description: "Problem-Solving, Array Problems, Mini Projects", count: 3 },
      { slug: "teacher-plans", name: "Teaching Plans", description: "Teaching Patterns, Checklists (Teacher Only)", count: 5 },
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
