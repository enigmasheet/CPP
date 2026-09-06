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
  noteCounts: Record<string, number>;
}

export const SUBJECTS: Record<string, SubjectConfig> = {
  cpp: {
    name: "C++ Programming",
    slug: "cpp",
    description: "Master C++ from basics to advanced concepts",
    noteCounts: {
      basics: 14,
      "control-flow": 15,
      functions: 4,
      "arrays-strings": 5,
      "pointers-references": 3,
      structures: 1,
      oop: 8,
      "file-handling": 1,
      stl: 2,
      "memory-management": 5,
      templates: 5,
      "modern-cpp": 5,
      "best-practices": 4,
      practice: 3,
      "teacher-plans": 5,
    },
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
  oop: {
    name: "Object Oriented Programming",
    slug: "oop",
    description: "Core OOP concepts — classes, inheritance, polymorphism, and design patterns",
    noteCounts: {
      "classes-objects": 0,
      encapsulation: 0,
      inheritance: 0,
      polymorphism: 0,
      abstraction: 0,
      "solid-principles": 0,
      "design-patterns": 0,
      composition: 0,
    },
    topics: [
      { slug: "classes-objects", name: "Classes & Objects", description: "Defining classes, constructors, destructors, member functions", count: 0 },
      { slug: "encapsulation", name: "Encapsulation", description: "Access modifiers, data hiding, getters/setters", count: 0 },
      { slug: "inheritance", name: "Inheritance", description: "Single, multiple, multilevel inheritance, virtual functions", count: 0 },
      { slug: "polymorphism", name: "Polymorphism", description: "Compile-time vs runtime, function overloading, virtual tables", count: 0 },
      { slug: "abstraction", name: "Abstraction", description: "Abstract classes, interfaces, pure virtual functions", count: 0 },
      { slug: "solid-principles", name: "SOLID Principles", description: "Single Responsibility, Open/Closed, Liskov, Interface Segregation, DI", count: 0 },
      { slug: "design-patterns", name: "Design Patterns", description: "Singleton, Factory, Observer, Strategy patterns", count: 0 },
      { slug: "composition", name: "Composition vs Inheritance", description: "Favoring composition, has-a vs is-a relationships", count: 0 },
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

export function getNoteCounts(subjectSlug: string): Record<string, number> {
  return SUBJECTS[subjectSlug]?.noteCounts ?? {};
}
