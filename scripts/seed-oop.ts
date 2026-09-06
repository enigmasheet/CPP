/**
 * Seed script: adds placeholder OOP subject, MCQs, and Resources.
 * Run with: npx tsx scripts/seed-oop.ts
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cpp-cms";

const SUBJECTS = [
  {
    name: "C++ Programming",
    slug: "cpp",
    description: "Master C++ from basics to advanced concepts",
    icon: "Code2",
    topics: [
      { name: "Basics", slug: "basics" },
      { name: "Control Flow", slug: "control-flow" },
      { name: "Functions", slug: "functions" },
      { name: "Arrays & Strings", slug: "arrays-strings" },
      { name: "Pointers & References", slug: "pointers-references" },
      { name: "Structures", slug: "structures" },
      { name: "OOP", slug: "oop" },
      { name: "File Handling", slug: "file-handling" },
      { name: "STL", slug: "stl" },
      { name: "Memory Management", slug: "memory-management" },
      { name: "Templates", slug: "templates" },
      { name: "Modern C++", slug: "modern-cpp" },
      { name: "Best Practices", slug: "best-practices" },
      { name: "Practice & Projects", slug: "practice" },
      { name: "Teaching Plans", slug: "teacher-plans" },
    ],
  },
  {
    name: "Object Oriented Programming",
    slug: "oop",
    description: "Core OOP concepts — classes, inheritance, polymorphism, and design patterns",
    icon: "Boxes",
    topics: [
      { name: "Classes & Objects", slug: "classes-objects" },
      { name: "Encapsulation", slug: "encapsulation" },
      { name: "Inheritance", slug: "inheritance" },
      { name: "Polymorphism", slug: "polymorphism" },
      { name: "Abstraction", slug: "abstraction" },
      { name: "SOLID Principles", slug: "solid-principles" },
      { name: "Design Patterns", slug: "design-patterns" },
      { name: "Composition vs Inheritance", slug: "composition" },
    ],
  },
];

const OOP_MCQS = [
  {
    topic: "classes-objects",
    question: "What is a class in object-oriented programming?",
    options: [
      { text: "A blueprint or template for creating objects", isCorrect: true },
      { text: "A specific instance of an object", isCorrect: false },
      { text: "A function that returns an object", isCorrect: false },
      { text: "A variable that stores object data", isCorrect: false },
    ],
    explanation: "A class is a blueprint that defines the structure and behavior (properties and methods) that its objects will have. It is not the object itself but a template for creating objects.",
    difficulty: "easy",
    tags: ["oop", "fundamentals"],
  },
  {
    topic: "classes-objects",
    question: "What is the difference between a class and an object?",
    codeSnippet: `class Car {
  string brand;
  void drive() { /* ... */ }
};

Car myCar;  // What is myCar?`,
    options: [
      { text: "myCar is an object (instance) of the Car class", isCorrect: true },
      { text: "myCar is another class definition", isCorrect: false },
      { text: "myCar is a copy of the Car class source code", isCorrect: false },
      { text: "myCar and Car are the same thing", isCorrect: false },
    ],
    explanation: "An object is a specific instance of a class. 'Car' is the class (blueprint), while 'myCar' is an actual Car object created from that blueprint.",
    difficulty: "easy",
    tags: ["oop", "fundamentals"],
  },
  {
    topic: "encapsulation",
    question: "What is encapsulation in OOP?",
    options: [
      { text: "Bundling data and methods that operate on that data into a single unit, and restricting direct access to some components", isCorrect: true },
      { text: "Creating multiple classes that share the same interface", isCorrect: false },
      { text: "Converting an object into a string representation", isCorrect: false },
      { text: "Copying an object's properties to create a new object", isCorrect: false },
    ],
    explanation: "Encapsulation means bundling data (attributes) and methods (functions) that work on that data within a single unit (class), while restricting direct access to some of the object's components — typically through access modifiers like private, protected, and public.",
    difficulty: "medium",
    tags: ["oop", "encapsulation"],
  },
  {
    topic: "encapsulation",
    question: "Which access modifier allows access only within the same class?",
    options: [
      { text: "private", isCorrect: true },
      { text: "public", isCorrect: false },
      { text: "protected", isCorrect: false },
      { text: "friend", isCorrect: false },
    ],
    explanation: "The 'private' access modifier restricts access to members only within the same class. 'public' allows access from anywhere, 'protected' allows access within the class and its derived classes, and 'friend' grants specific external classes or functions access.",
    difficulty: "easy",
    tags: ["oop", "encapsulation", "access-modifiers"],
  },
  {
    topic: "inheritance",
    question: "What does inheritance allow you to do in OOP?",
    options: [
      { text: "Create a new class based on an existing class, inheriting its properties and methods", isCorrect: true },
      { text: "Create objects without defining a class first", isCorrect: false },
      { text: "Store multiple values in a single variable", isCorrect: false },
      { text: "Execute code before a function is called", isCorrect: false },
    ],
    explanation: "Inheritance allows a new class (derived/child class) to inherit properties and methods from an existing class (base/parent class), promoting code reuse and establishing an is-a relationship.",
    difficulty: "easy",
    tags: ["oop", "inheritance"],
  },
  {
    topic: "inheritance",
    question: "What is the 'is-a' relationship in inheritance?",
    codeSnippet: `class Animal { };
class Dog : public Animal { };`,
    options: [
      { text: "Dog is-a Animal — Dog inherits from Animal", isCorrect: true },
      { text: "Animal is-a Dog — Animal inherits from Dog", isCorrect: false },
      { text: "Dog has-a Animal — Dog contains an Animal member", isCorrect: false },
      { text: "There is no relationship between Dog and Animal", isCorrect: false },
    ],
    explanation: "In this inheritance relationship, Dog is a derived class and Animal is the base class. The 'is-a' relationship means a Dog IS-A type of Animal. This is different from 'has-a' (composition) where one class contains another.",
    difficulty: "medium",
    tags: ["oop", "inheritance", "relationships"],
  },
  {
    topic: "polymorphism",
    question: "What is polymorphism in OOP?",
    options: [
      { text: "The ability of different classes to be treated as the same type through a common interface, with each class providing its own implementation", isCorrect: true },
      { text: "The ability to create multiple constructors for a class", isCorrect: false },
      { text: "The process of converting one data type to another", isCorrect: false },
      { text: "A technique to prevent memory leaks", isCorrect: false },
    ],
    explanation: "Polymorphism ('many forms') allows objects of different classes to be treated as objects of a common base class. The same method call can produce different behavior depending on the actual object type — this is runtime polymorphism achieved through virtual functions.",
    difficulty: "medium",
    tags: ["oop", "polymorphism"],
  },
  {
    topic: "polymorphism",
    question: "What is the difference between compile-time and runtime polymorphism?",
    options: [
      { text: "Compile-time: resolved at compile time (overloading); Runtime: resolved at runtime (virtual functions)", isCorrect: true },
      { text: "They are the same thing with different names", isCorrect: false },
      { text: "Compile-time is faster, runtime is slower", isCorrect: false },
      { text: "Compile-time works with classes, runtime works with structs", isCorrect: false },
    ],
    explanation: "Compile-time polymorphism (static binding) is achieved through function/operator overloading — the compiler decides which function to call. Runtime polymorphism (dynamic binding) uses virtual functions — the decision is made at runtime based on the actual object type.",
    difficulty: "hard",
    tags: ["oop", "polymorphism"],
  },
  {
    topic: "abstraction",
    question: "What is an abstract class?",
    options: [
      { text: "A class that cannot be instantiated and may contain pure virtual functions", isCorrect: true },
      { text: "A class with no member variables", isCorrect: false },
      { text: "A class that only has private members", isCorrect: false },
      { text: "A class that is automatically deleted after use", isCorrect: false },
    ],
    explanation: "An abstract class is a class that cannot be instantiated directly. It typically contains at least one pure virtual function (= 0). Its purpose is to provide a common interface for derived classes. You must derive from it to create usable objects.",
    difficulty: "medium",
    tags: ["oop", "abstraction"],
  },
  {
    topic: "solid-principles",
    question: "What does the 'S' in SOLID stand for?",
    options: [
      { text: "Single Responsibility Principle — a class should have only one reason to change", isCorrect: true },
      { text: "Simple Reasoning Principle — code should be easy to understand", isCorrect: false },
      { text: "Single Return Principle — functions should return only one value", isCorrect: false },
      { text: "Static Reference Principle — references should be static", isCorrect: false },
    ],
    explanation: "The Single Responsibility Principle states that a class should have only one job or responsibility. If a class has multiple responsibilities, it becomes harder to maintain and modify because changes to one responsibility may affect the other.",
    difficulty: "medium",
    tags: ["oop", "solid", "design"],
  },
  {
    topic: "design-patterns",
    question: "What problem does the Singleton pattern solve?",
    options: [
      { text: "Ensures a class has only one instance and provides a global point of access to it", isCorrect: true },
      { text: "Allows objects to notify observers when their state changes", isCorrect: false },
      { text: "Provides a way to create objects without specifying their concrete class", isCorrect: false },
      { text: "Enables two-way communication between objects", isCorrect: false },
    ],
    explanation: "The Singleton pattern restricts the instantiation of a class to one single instance. This is useful for managing shared resources like database connections, configuration settings, or logging where having multiple instances would be problematic.",
    difficulty: "medium",
    tags: ["oop", "design-patterns"],
  },
  {
    topic: "composition",
    question: "What is the difference between composition and inheritance?",
    options: [
      { text: "Composition: has-a relationship (contains another object); Inheritance: is-a relationship (extends another class)", isCorrect: true },
      { text: "They are the same concept", isCorrect: false },
      { text: "Composition is faster than inheritance", isCorrect: false },
      { text: "Inheritance is only for interfaces, composition is for classes", isCorrect: false },
    ],
    explanation: "Composition represents a 'has-a' relationship — a class contains instances of other classes as members. Inheritance represents an 'is-a' relationship — a derived class IS a type of the base class. Composition is generally preferred over inheritance for code reuse because it's more flexible and avoids tight coupling.",
    difficulty: "medium",
    tags: ["oop", "composition", "design"],
  },
];

const OOP_RESOURCES = [
  {
    topic: "classes-objects",
    title: "Basic Class Definition in C++",
    type: "code" as const,
    content: `class Person {
private:
    std::string name;
    int age;

public:
    // Constructor
    Person(const std::string& n, int a) : name(n), age(a) {}

    // Getters
    std::string getName() const { return name; }
    int getAge() const { return age; }

    // Method
    void introduce() const {
        std::cout << "Hi, I'm " << name << " and I'm "
                  << age << " years old." << std::endl;
    }
};

int main() {
    Person p("Alice", 22);
    p.introduce();  // Hi, I'm Alice and I'm 22 years old.
    return 0;
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "encapsulation",
    title: "Access Modifiers Demo",
    type: "code" as const,
    content: `class BankAccount {
private:
    double balance;       // Cannot be accessed outside class

protected:
    std::string owner;    // Accessible in derived classes

public:
    BankAccount(const std::string& owner, double initial)
        : owner(owner), balance(initial) {}

    // Public interface
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    double getBalance() const { return balance; }
};

int main() {
    BankAccount acc("Alice", 1000);
    acc.deposit(500);
    // acc.balance = -999;     // ERROR: balance is private
    // acc.owner = "Bob";      // ERROR: owner is protected
    std::cout << acc.getBalance();  // OK: getBalance is public
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "inheritance",
    title: "Inheritance Hierarchy Example",
    type: "code" as const,
    content: `class Shape {
protected:
    std::string color;
public:
    Shape(const std::string& c) : color(c) {}
    virtual double area() const = 0;  // Pure virtual
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r, const std::string& c)
        : Shape(c), radius(r) {}

    double area() const override {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h, const std::string& c)
        : Shape(c), width(w), height(h) {}

    double area() const override {
        return width * height;
    }
};`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "polymorphism",
    title: "Virtual Functions and Polymorphism",
    type: "code" as const,
    content: `class Animal {
public:
    virtual void speak() const {
        std::cout << "..." << std::endl;
    }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void speak() const override {
        std::cout << "Woof!" << std::endl;
    }
};

class Cat : public Animal {
public:
    void speak() const override {
        std::cout << "Meow!" << std::endl;
    }
};

// Polymorphism in action
void makeSound(const Animal& animal) {
    animal.speak();  // Calls the correct version at runtime
}

int main() {
    Dog dog;
    Cat cat;
    makeSound(dog);  // Woof!
    makeSound(cat);  // Meow!
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "solid-principles",
    title: "SOLID Principles Quick Reference",
    type: "document" as const,
    content: `**SOLID Principles Overview**

**S — Single Responsibility Principle**
A class should have only one reason to change.
Bad: A class that handles both user data AND database queries.
Good: Separate User class and UserRepository class.

**O — Open/Closed Principle**
Classes should be open for extension, closed for modification.
Use inheritance and interfaces to add new behavior without changing existing code.

**L — Liskov Substitution Principle**
Subtypes must be substitutable for their base types.
If you have a function that works with a Base class, it should also work with any Derived class without breaking.

**I — Interface Segregation Principle**
Clients should not be forced to depend on interfaces they don't use.
Prefer many small, specific interfaces over one large, general-purpose interface.

**D — Dependency Inversion Principle**
High-level modules should not depend on low-level modules. Both should depend on abstractions.
Use dependency injection and program to interfaces, not concrete implementations.`,
    difficulty: "intermediate",
  },
  {
    topic: "design-patterns",
    title: "Singleton Pattern Implementation",
    type: "code" as const,
    content: `class Singleton {
private:
    static Singleton* instance;
    Singleton() {}  // Private constructor

public:
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }

    void doSomething() {
        std::cout << "Singleton is working!" << std::endl;
    }

    // Delete copy/move
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};

Singleton* Singleton::instance = nullptr;

int main() {
    Singleton* s1 = Singleton::getInstance();
    Singleton* s2 = Singleton::getInstance();
    // s1 == s2 (same instance)
}`,
    language: "cpp",
    difficulty: "advanced",
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // Seed Subjects
  const Subject = mongoose.model("Subject", new mongoose.Schema({
    name: String, slug: { type: String, unique: true },
    description: String, icon: { type: String, default: "BookOpen" },
    topics: [{ name: String, slug: String }],
    createdAt: { type: Date, default: Date.now },
  }));

  for (const s of SUBJECTS) {
    const doc = await Subject.findOneAndUpdate(
      { slug: s.slug },
      { $setOnInsert: s },
      { upsert: true, returnDocument: "after" }
    );
    console.log(`Subject: ${s.name} (${doc._id})`);
  }

  // Get OOP subject ID
  const oopSubject = await Subject.findOne({ slug: "oop" });
  if (!oopSubject) { console.error("OOP subject not found"); process.exit(1); }

  // Seed MCQs
  const MCQ = mongoose.model("MCQ", new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    topic: String, question: String, codeSnippet: String,
    options: [{ text: String, isCorrect: Boolean }],
    explanation: String, difficulty: String, tags: [String],
    createdAt: { type: Date, default: Date.now },
  }));

  const mcqCount = await MCQ.countDocuments({ subject: oopSubject._id });
  if (mcqCount === 0) {
    const mcqs = OOP_MCQS.map((m) => ({ ...m, subject: oopSubject._id }));
    await MCQ.insertMany(mcqs);
    console.log(`\nInserted ${mcqs.length} OOP MCQs`);
  } else {
    console.log(`\nOOP MCQs already exist (${mcqCount}), skipping`);
  }

  // Seed Resources
  const Resource = mongoose.model("Resource", new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    topic: String, title: String, type: String,
    content: String, language: String, difficulty: String,
    createdAt: { type: Date, default: Date.now },
  }));

  const resCount = await Resource.countDocuments({ subject: oopSubject._id });
  if (resCount === 0) {
    const resources = OOP_RESOURCES.map((r) => ({ ...r, subject: oopSubject._id }));
    await Resource.insertMany(resources);
    console.log(`Inserted ${resources.length} OOP Resources`);
  } else {
    console.log(`OOP Resources already exist (${resCount}), skipping`);
  }

  await mongoose.disconnect();
  console.log("\nDone!");
}

seed().catch((err) => { console.error(err); process.exit(1); });
