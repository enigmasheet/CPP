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
      { slug: "basics", name: "Basics", description: "Introduction, Variables, Data Types, I/O, Operators", count: 14 },
      { slug: "control-flow", name: "Control Flow", description: "Conditionals, Loops, switch, break/continue", count: 15 },
      { slug: "functions", name: "Functions", description: "Declaration, Parameters, Return Values, Structure", count: 4 },
      { slug: "arrays-strings", name: "Arrays & Strings", description: "Array Indexing, Loops, Strings, getline()", count: 5 },
      { slug: "pointers-references", name: "Pointers & References", description: "Memory Addresses, Dereferencing, References", count: 3 },
      { slug: "structures", name: "Structures", description: "Custom Data Types, Struct Usage", count: 1 },
      { slug: "oop", name: "OOP", description: "Classes, Inheritance, Polymorphism, Exception Handling", count: 8 },
      { slug: "file-handling", name: "File Handling", description: "File I/O, Reading/Writing Files", count: 1 },
      { slug: "stl", name: "STL", description: "Standard Template Library, Vectors", count: 2 },
      { slug: "practice", name: "Practice & Projects", description: "Problem-Solving, Array Problems, Mini Projects", count: 3 },
      { slug: "teacher-plans", name: "Teaching Plans", description: "Teaching Patterns, Checklists (Teacher Only)", count: 4 },
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
