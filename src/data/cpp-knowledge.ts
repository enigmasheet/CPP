export interface KnowledgeSection {
  id: string;
  title: string;
  category: "bugs" | "tricky" | "teaching" | "reference";
  content: string;
}

export const cppKnowledge: KnowledgeSection[] = [
  // ─── HIDDEN BUGS & PITFALLS ───────────────────────────────────────
  {
    id: "bug-1",
    title: "Integer Overflow",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
int x = 2147483647;  // Max int
x = x + 1;          // Undefined behavior!
std::cout << x;     // Could print -2147483648
\`\`\`

## Why It Happens

\`int\` has a fixed range. When it exceeds the maximum, it wraps around to the minimum (or vice versa). This is **undefined behavior** in C++.

## How to Fix

\`\`\`cpp
long long x = 2147483647LL;
x = x + 1;  // Now safe: 214783648
\`\`\`

Or use \`<climits>\` to check limits before operations:

\`\`\`cpp
#include <climits>

if (x > INT_MAX - 1)
{
    std::cout << "Overflow would occur!";
}
\`\`\`

## Teaching Point

Show students this in class. Ask: "What do you think happens?" Let them guess before revealing the answer.`,
  },
  {
    id: "bug-2",
    title: "Dangling Pointer",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
int* p;

{
    int x = 10;
    p = &x;
}

std::cout << *p;  // Undefined behavior! x is destroyed
\`\`\`

## Why It Happens

\`x\` goes out of scope when the block ends. The pointer \`p\` now points to memory that is no longer valid.

## How to Fix

\`\`\`cpp
int* p;

{
    int x = 10;
    p = &x;
    std::cout << *p;  // Use while x is alive
}

// Don't use p here!
\`\`\`

Or use dynamic allocation:

\`\`\`cpp
int* p = new int(10);
// ... use p ...
delete p;
\`\`\``,
  },
  {
    id: "bug-3",
    title: "Memory Leak",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
void leaky()
{
    int* arr = new int[1000];
    // Forgot to delete!
    return;
}
\`\`\`

## Why It Happens

Memory allocated with \`new\` is not automatically freed. If you forget \`delete\`, the memory is leaked until the program ends.

## How to Fix

\`\`\`cpp
void safe()
{
    int* arr = new int[1000];
    // ... use arr ...
    delete[] arr;  // Always clean up!
}
\`\`\`

Or better, use \`std::vector\`:

\`\`\`cpp
void best()
{
    std::vector<int> arr(1000);
    // No delete needed! Automatically cleaned up.
}
\`\`\`

> **Teaching Point:** This is why we prefer stack allocation and RAII over raw \`new\`/\`delete\`.`,
  },
  {
    id: "bug-4",
    title: "Undefined Behavior - Accessing Out of Bounds",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};
std::cout << arr[10];  // Undefined behavior!
\`\`\`

## Why It Happens

C++ does not check array bounds. Accessing beyond the array size reads whatever is in that memory location.

## Consequences

- Program might crash
- Program might print garbage values
- Program might appear to work correctly (worst case: hard to debug!)

## How to Fix

\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};

for (int i = 0; i < 5; i++)  // i < 5, not i <= 5
{
    std::cout << arr[i];
}
\`\`\`

Or use \`std::vector\` with \`.at()\`:

\`\`\`cpp
std::vector<int> v = {10, 20, 30};
std::cout << v.at(10);  // Throws std::out_of_range
\`\`\``,
  },
  {
    id: "bug-5",
    title: "Shadowing Variables",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
int x = 10;

void foo()
{
    int x = 20;  // Shadows the global x!
    std::cout << x;  // Prints 20, not 10
}
\`\`\`

## Why It Happens

The local \`x\` "shadows" the global \`x\`. Inside \`foo()\`, \`x\` refers to the local variable.

## How to Fix

Use different names:

\`\`\`cpp
int globalX = 10;

void foo()
{
    int localX = 20;
    std::cout << localX;  // Clear!
}
\`\`\`

Or use \`::\` to access the global:

\`\`\`cpp
int x = 10;

void foo()
{
    int x = 20;
    std::cout << ::x;  // Prints 10 (global)
}
\`\`\`

> **Teaching Point:** Enable compiler warnings (\`-Wshadow\`) to catch this.`,
  },
  {
    id: "bug-6",
    title: "Pass by Value vs Reference",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
void increment(int x)
{
    x = x + 1;  // Modifies local copy!
}

int main()
{
    int a = 5;
    increment(a);
    std::cout << a;  // Still 5, not 6!
}
\`\`\`

## Why It Happens

\`x\` is a copy of \`a\`. Changes to \`x\` do not affect \`a\`.

## How to Fix

Use a reference:

\`\`\`cpp
void increment(int& x)
{
    x = x + 1;  // Modifies the original!
}

int main()
{
    int a = 5;
    increment(a);
    std::cout << a;  // 6
}
\`\`\`

## When to Use Each

| Pass by Value | Pass by Reference |
|---------------|-------------------|
| Small types (int, char) | Large objects (string, vector) |
| When you need a copy | When you need to modify the original |
| Read-only parameters | Output parameters |`,
  },
  {
    id: "bug-7",
    title: "Const Correctness",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
class Rectangle
{
public:
    int width, height;

    int area()
    {
        return width * height;
    }
};

void printArea(const Rectangle& r)
{
    // r.area();  // Compiler error! area() is not const
    std::cout << r.width;  // OK: reading is fine
}
\`\`\`

## Why It Happens

\`area()\` is not marked as \`const\`, so it cannot be called on a \`const\` reference.

## How to Fix

Mark methods that don't modify the object as \`const\`:

\`\`\`cpp
class Rectangle
{
public:
    int width, height;

    int area() const  // Added const!
    {
        return width * height;
    }
};
\`\`\`

> **Teaching Point:** Always mark methods as \`const\` if they don't modify the object.`,
  },
  {
    id: "bug-8",
    title: "Off-by-One Errors",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};

for (int i = 0; i <= 5; i++)  // Wrong: i <= 5
{
    std::cout << arr[i];  // arr[5] is out of bounds!
}
\`\`\`

## Why It Happens

Arrays are 0-indexed. Array of size 5 has indices 0, 1, 2, 3, 4. Index 5 is out of bounds.

## How to Fix

\`\`\`cpp
for (int i = 0; i < 5; i++)  // Correct: i < 5
{
    std::cout << arr[i];
}
\`\`\`

## Common Pattern

\`\`\`text
Size 5:
Index: 0  1  2  3  4
       ^              ^
     start          end (exclusive)
\`\`\`

> **Teaching Tip:** Write the loop bounds on the board and have students verify each case.`,
  },
  {
    id: "bug-9",
    title: "Slicing Problem",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
class Base
{
public:
    virtual void print() { std::cout << "Base"; }
};

class Derived : public Base
{
public:
    void print() override { std::cout << "Derived"; }
};

int main()
{
    Derived d;
    Base b = d;  // Slicing! Derived part is lost
    b.print();   // Prints "Base", not "Derived"
}
\`\`\`

## Why It Happens

When you assign a derived object to a base object by value, the derived-specific parts are "sliced off."

## How to Fix

Use pointers or references:

\`\`\`cpp
int main()
{
    Derived d;
    Base* b = &d;  // Pointer: no slicing
    b->print();    // Prints "Derived"
}
\`\`\`

Or:

\`\`\`cpp
int main()
{
    Derived d;
    Base& b = d;   // Reference: no slicing
    b.print();     // Prints "Derived"
}
\`\`\``,
  },
  {
    id: "bug-10",
    title: "std::endl vs \"\\n\"",
    category: "bugs",
    content: `## The Subtle Issue

\`\`\`cpp
std::cout << "Hello" << std::endl;  // Flushes buffer
std::cout << "Hello" << "\\n";      // Does not flush
\`\`\`

## Why It Matters

\`std::endl\` does two things:
1. Outputs a newline
2. Flushes the output buffer

Flushing is expensive! In tight loops, it can slow your program significantly.

## Example

\`\`\`cpp
// Slow
for (int i = 0; i < 100000; i++)
{
    std::cout << i << std::endl;  // Flushes every time!
}

// Fast
for (int i = 0; i < 100000; i++)
{
    std::cout << i << "\\n";  // No unnecessary flushing
}
\`\`\`

## When to Use std::endl

- When you need to ensure output is displayed immediately (e.g., before a crash-prone section)
- When the program is about to wait for input

> **Teaching Point:** Default to \`"\\n"\`. Only use \`std::endl\` when you need to flush.`,
  },
  {
    id: "bug-11",
    title: "Virtual Functions in Constructors",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
class Base
{
public:
    Base() { print(); }
    virtual void print() { std::cout << "Base"; }
};

class Derived : public Base
{
public:
    void print() override { std::cout << "Derived"; }
};

int main()
{
    Derived d;  // Prints "Base", not "Derived"!
}
\`\`\`

## Why It Happens

When \`Base()\` runs, the \`Derived\` part of the object doesn't exist yet. So virtual dispatch calls \`Base::print()\`, not \`Derived::print()\`.

## Rule

> Never call virtual functions in constructors or destructors.

## How to Fix

Use a separate initialization method:

\`\`\`cpp
class Base
{
public:
    Base() { init(); }
    virtual void init() { std::cout << "Base"; }
};
\`\`\`

Or better, avoid the pattern entirely.`,
  },
  {
    id: "bug-12",
    title: "Temporary Object Lifetime",
    category: "bugs",
    content: `## The Bug

\`\`\`cpp
const char* getWord()
{
    return "Hello";  // OK: string literal has static lifetime
}

const char* getWord2()
{
    std::string s = "Hello";
    return s.c_str();  // BUG! s is destroyed here
}
\`\`\`

## Why It Happens

\`s\` is a local variable. When the function returns, \`s\` is destroyed. The pointer returned by \`.c_str()\` becomes dangling.

## How to Fix

Return the string object:

\`\`\`cpp
std::string getWord2()
{
    std::string s = "Hello";
    return s;  // OK: copy returned (or RVO applied)
}
\`\`\``,
  },

  // ─── TRICKY OUTPUT PROGRAMS ───────────────────────────────────────
  {
    id: "tricky-1",
    title: "Increment Order",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    int i = 5;
    std::cout << i++ + ++i;
    return 0;
}
\`\`\`

## Answer

**Undefined behavior!** The result depends on the compiler.

Some compilers output \`12\`, others \`13\`, others \`11\`.

## Why

The expression \`i++ + ++i\` modifies \`i\` twice without a sequence point between them. This is undefined in C++.

## Teaching Point

This is a great quiz question. Show students different compiler outputs and explain why the behavior is undefined.`,
  },
  {
    id: "tricky-2",
    title: "sizeof Surprises",
    category: "tricky",
    content: `## Program 1

\`\`\`cpp
char str[] = "Hello";
std::cout << sizeof(str);  // 6 (not 5!)
\`\`\`

## Why

\`sizeof\` includes the null terminator \`'\\0'\`.

## Program 2

\`\`\`cpp
char* str = "Hello";
std::cout << sizeof(str);  // 8 (pointer size, not string length!)
\`\`\`

## Why

\`str\` is a pointer, not an array. \`sizeof\` returns the size of the pointer.

## Program 3

\`\`\`cpp
int arr[10];
std::cout << sizeof(arr);  // 40 (10 * 4 bytes)
\`\`\`

## Rule

\`\`\`text
Array: sizeof gives total size
Pointer: sizeof gives pointer size (4 or 8 bytes)
\`\`\``,
  },
  {
    id: "tricky-3",
    title: "Reference to Const",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    int x = 10;
    const int& ref = x;

    ref = 20;  // Error! Cannot modify through const reference
    x = 20;    // OK: x is not const

    std::cout << ref;  // 20 (ref sees the change)
    return 0;
}
\`\`\`

## Teaching Point

A \`const\` reference prevents modification through that reference, but the original variable can still change. This is important for function parameters.`,
  },
  {
    id: "tricky-4",
    title: "String Literal Array Decay",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    char a[] = "Hello";
    char* b = "Hello";

    a[0] = 'J';  // OK
    // b[0] = 'J';  // Runtime error! Undefined behavior

    std::cout << a << "\\n";  // Jello
    std::cout << b << "\\n";  // Hello
    return 0;
}
\`\`\`

## Why

- \`a\` is a modifiable array (copy of the string)
- \`b\` is a pointer to a string literal (read-only memory)

## Teaching Point

Always use \`const char*\` for string literals: \`const char* b = "Hello";\``,
  },
  {
    id: "tricky-5",
    title: "Implicit Conversions",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    int a = 3;
    int b = 2;
    double result = a / b;  // 1.0, not 1.5!

    std::cout << result;
    return 0;
}
\`\`\`

## Why

\`a / b\` is integer division (result: \`1\`). The conversion to \`double\` happens after the division.

## Fix

\`\`\`cpp
double result = static_cast<double>(a) / b;  // 1.5
\`\`\`

Or:

\`\`\`cpp
double result = 1.0 * a / b;  // 1.5
\`\`\``,
  },
  {
    id: "tricky-6",
    title: "Operator Precedence Trap",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    int x = 2 + 3 * 4;   // 14, not 20!
    int y = (2 + 3) * 4; // 20

    std::cout << x << "\\n" << y;
    return 0;
}
\`\`\`

## Precedence Table (Simplified)

\`\`\`text
Highest: ()  []  ->
         *  /  %
         +  -
         <  <=  >  >=
         == !=
         &&
         ||
         =
\`\`\`

## Teaching Point

When in doubt, use parentheses to make the intent clear.`,
  },
  {
    id: "tricky-7",
    title: "Switch Fallthrough",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    int x = 1;

    switch (x)
    {
        case 1:
            std::cout << "One ";
            // No break! Falls through
        case 2:
            std::cout << "Two ";
            // No break! Falls through
        case 3:
            std::cout << "Three ";
            break;
    }

    return 0;
}
\`\`\`

## Output

\`\`\`text
One Two Three
\`\`\`

## Teaching Point

Always use \`break\` in \`case\` statements unless you intentionally want fallthrough. Modern compilers warn about this.`,
  },
  {
    id: "tricky-8",
    title: "Ternary Operator Type Mismatch",
    category: "tricky",
    content: `## Program

\`\`\`cpp
#include <iostream>

int main()
{
    bool condition = true;
    auto result = condition ? 5 : 3.5;

    std::cout << result;   // 5.0 (not 5!)
    std::cout << typeid(result).name();
    return 0;
}
\`\`\`

## Why

The ternary operator requires both branches to have the same type. \`5\` (int) and \`3.5\` (double) are different. The int is promoted to double.

## Fix

\`\`\`cpp
auto result = condition ? 5.0 : 3.5;  // Both double
\`\`\`

Or:

\`\`\`cpp
int result = condition ? 5 : 3;  // Both int
\`\`\``,
  },

  // ─── TEACHING PROGRAMS ────────────────────────────────────────────
  {
    id: "teach-1",
    title: "Hello World Variations",
    category: "teaching",
    content: `## Basic

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "Hello World!" << std::endl;
    return 0;
}
\`\`\`

## With Variables

\`\`\`cpp
#include <iostream>
#include <string>

int main()
{
    std::string name;
    std::cout << "What is your name? ";
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}
\`\`\`

## With Multiple Outputs

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "========================" << std::endl;
    std::cout << "      MY PROFILE" << std::endl;
    std::cout << "========================" << std::endl;
    std::cout << "Name: Abhay" << std::endl;
    std::cout << "Course: BSc CS" << std::endl;
    std::cout << "========================" << std::endl;
    return 0;
}
\`\`\`

> **Teaching Tip:** Start with basic, then add complexity. Let students type each version.`,
  },
  {
    id: "teach-2",
    title: "Calculator Program",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>

int main()
{
    double num1, num2;
    char op;

    std::cout << "Enter first number: ";
    std::cin >> num1;

    std::cout << "Enter operator (+, -, *, /): ";
    std::cin >> op;

    std::cout << "Enter second number: ";
    std::cin >> num2;

    switch (op)
    {
        case '+':
            std::cout << num1 << " + " << num2 << " = " << num1 + num2;
            break;
        case '-':
            std::cout << num1 << " - " << num2 << " = " << num1 - num2;
            break;
        case '*':
            std::cout << num1 << " * " << num2 << " = " << num1 * num2;
            break;
        case '/':
            if (num2 != 0)
                std::cout << num1 << " / " << num2 << " = " << num1 / num2;
            else
                std::cout << "Error: Division by zero!";
            break;
        default:
            std::cout << "Invalid operator!";
    }

    return 0;
}
\`\`\`

> **Teaching Tip:** Ask students to add modulo (\`%\`) support and a loop to keep calculating.`,
  },
  {
    id: "teach-3",
    title: "Number Guessing Game",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <cstdlib>
#include <ctime>

int main()
{
    std::srand(std::time(0));
    int secret = std::rand() % 100 + 1;
    int guess;
    int attempts = 0;

    std::cout << "I'm thinking of a number between 1 and 100." << std::endl;

    do
    {
        std::cout << "Enter your guess: ";
        std::cin >> guess;
        attempts++;

        if (guess > secret)
            std::cout << "Too high!" << std::endl;
        else if (guess < secret)
            std::cout << "Too low!" << std::endl;
        else
            std::cout << "Correct! You got it in " << attempts << " attempts." << std::endl;
    }
    while (guess != secret);

    return 0;
}
\`\`\`

> **Teaching Tip:** Ask students to add a difficulty level (easy: 1-50, medium: 1-100, hard: 1-1000).`,
  },
  {
    id: "teach-4",
    title: "Student Grade System",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>

struct Student
{
    std::string name;
    int marks[5];
    double average;
    char grade;
};

char calculateGrade(double avg)
{
    if (avg >= 80) return 'A';
    if (avg >= 60) return 'B';
    if (avg >= 40) return 'C';
    return 'F';
}

int main()
{
    int n;
    std::cout << "How many students? ";
    std::cin >> n;

    std::vector<Student> students(n);

    for (int i = 0; i < n; i++)
    {
        std::cout << "\\nEnter details for student " << i + 1 << ":" << std::endl;
        std::cin.ignore();
        std::cout << "Name: ";
        std::getline(std::cin, students[i].name);

        int total = 0;
        for (int j = 0; j < 5; j++)
        {
            std::cout << "Mark " << j + 1 << ": ";
            std::cin >> students[i].marks[j];
            total += students[i].marks[j];
        }

        students[i].average = total / 5.0;
        students[i].grade = calculateGrade(students[i].average);
    }

    std::cout << "\\n=== Results ===" << std::endl;
    for (const auto& s : students)
    {
        std::cout << s.name << " - Average: " << s.average
                  << " - Grade: " << s.grade << std::endl;
    }

    return 0;
}
\`\`\`

> **Teaching Tip:** This combines structs, vectors, arrays, functions, and loops. Great for review.`,
  },
  {
    id: "teach-5",
    title: "Simple Inheritance Example",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <string>

class Animal
{
public:
    std::string name;

    Animal(std::string n) : name(n) {}

    void eat()
    {
        std::cout << name << " is eating." << std::endl;
    }
};

class Dog : public Animal
{
public:
    Dog(std::string n) : Animal(n) {}

    void bark()
    {
        std::cout << name << " says: Woof!" << std::endl;
    }
};

class Cat : public Animal
{
public:
    Cat(std::string n) : Animal(n) {}

    void meow()
    {
        std::cout << name << " says: Meow!" << std::endl;
    }
};

int main()
{
    Dog dog("Buddy");
    Cat cat("Whiskers");

    dog.eat();   // Inherited
    dog.bark();  // Own method

    cat.eat();   // Inherited
    cat.meow();  // Own method

    return 0;
}
\`\`\`

Output:
\`\`\`text
Buddy is eating.
Buddy says: Woof!
Whiskers is eating.
Whiskers says: Meow!
\`\`\``,
  },
  {
    id: "teach-6",
    title: "Polymorphism Demo",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>

class Shape
{
public:
    virtual double area() { return 0; }
    virtual void print()
    {
        std::cout << "Area: " << area() << std::endl;
    }
};

class Circle : public Shape
{
    double radius;
public:
    Circle(double r) : radius(r) {}

    double area() override
    {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape
{
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}

    double area() override
    {
        return width * height;
    }
};

int main()
{
    Shape* shapes[] = {
        new Circle(5),
        new Rectangle(4, 6),
        new Circle(3)
    };

    for (int i = 0; i < 3; i++)
    {
        shapes[i]->print();  // Polymorphic call
        delete shapes[i];
    }

    return 0;
}
\`\`\`

Output:
\`\`\`text
Area: 78.5398
Area: 24
Area: 28.2743
\`\`\`

> **Teaching Point:** The same \`print()\` call produces different output depending on the actual object type.`,
  },
  {
    id: "teach-7",
    title: "File I/O Example",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <fstream>
#include <string>

int main()
{
    // Writing to file
    std::ofstream outFile("students.txt");

    outFile << "Ram 20 85.5" << std::endl;
    outFile << "Shyam 21 90.0" << std::endl;
    outFile << "Hari 19 78.0" << std::endl;
    outFile.close();

    // Reading from file
    std::ifstream inFile("students.txt");
    std::string name;
    int age;
    double marks;

    std::cout << "\\nStudent Records:" << std::endl;
    std::cout << "=================" << std::endl;

    while (inFile >> name >> age >> marks)
    {
        std::cout << name << " (Age: " << age
                  << ", Marks: " << marks << ")" << std::endl;
    }

    inFile.close();
    return 0;
}
\`\`\`

Output:
\`\`\`text
Student Records:
=================
Ram (Age: 20, Marks: 85.5)
Shyam (Age: 21, Marks: 90)
Hari (Age: 19, Marks: 78)
\`\`\``,
  },
  {
    id: "teach-8",
    title: "Vector Sorting Demo",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>

void printVector(const std::vector<int>& v)
{
    for (int x : v)
        std::cout << x << " ";
    std::cout << std::endl;
}

int main()
{
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    std::cout << "Original: ";
    printVector(nums);

    std::sort(nums.begin(), nums.end());
    std::cout << "Sorted:   ";
    printVector(nums);

    std::reverse(nums.begin(), nums.end());
    std::cout << "Reversed: ";
    printVector(nums);

    auto it = std::find(nums.begin(), nums.end(), 8);
    if (it != nums.end())
        std::cout << "Found 8 at index: " << std::distance(nums.begin(), it) << std::endl;

    return 0;
}
\`\`\`

Output:
\`\`\`text
Original: 5 2 8 1 9 3
Sorted:   1 2 3 5 8 9
Reversed: 9 8 5 3 2 1
Found 8 at index: 1
\`\`\``,
  },
  {
    id: "teach-9",
    title: "Operator Overloading",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>

class Point
{
public:
    double x, y;

    Point(double x = 0, double y = 0) : x(x), y(y) {}

    Point operator+(const Point& other)
    {
        return Point(x + other.x, y + other.y);
    }

    bool operator==(const Point& other)
    {
        return (x == other.x && y == other.y);
    }

    friend std::ostream& operator<<(std::ostream& out, const Point& p)
    {
        out << "(" << p.x << ", " << p.y << ")";
        return out;
    }
};

int main()
{
    Point a(1, 2);
    Point b(3, 4);
    Point c = a + b;

    std::cout << a << " + " << b << " = " << c << std::endl;
    std::cout << a << " == " << b << ": " << (a == b ? "true" : "false") << std::endl;

    return 0;
}
\`\`\`

Output:
\`\`\`text
(1, 2) + (3, 4) = (4, 6)
(1, 2) == (3, 4): false
\`\`\``,
  },
  {
    id: "teach-10",
    title: "Exception Handling Demo",
    category: "teaching",
    content: `\`\`\`cpp
#include <iostream>
#include <stdexcept>

double divide(double a, double b)
{
    if (b == 0)
        throw std::runtime_error("Division by zero");
    return a / b;
}

int main()
{
    try
    {
        std::cout << divide(10, 2) << std::endl;   // 5
        std::cout << divide(10, 0) << std::endl;   // Throws
        std::cout << divide(8, 4) << std::endl;    // Never reached
    }
    catch (const std::runtime_error& e)
    {
        std::cout << "Error: " << e.what() << std::endl;
    }

    return 0;
}
\`\`\`

Output:
\`\`\`text
5
Error: Division by zero
\`\`\`

> **Teaching Point:** The third \`divide\` call is never reached because the exception stops execution.`,
  },

  // ─── QUICK REFERENCE ──────────────────────────────────────────────
  {
    id: "ref-1",
    title: "Data Type Sizes",
    category: "reference",
    content: `| Type | Size (typical) | Range (typical) |
|------|----------------|-----------------|
| \`char\` | 1 byte | -128 to 127 |
| \`unsigned char\` | 1 byte | 0 to 255 |
| \`short\` | 2 bytes | -32,768 to 32,767 |
| \`int\` | 4 bytes | -2.1B to 2.1B |
| \`unsigned int\` | 4 bytes | 0 to 4.2B |
| \`long\` | 4-8 bytes | Platform dependent |
| \`long long\` | 8 bytes | -9.2E18 to 9.2E18 |
| \`float\` | 4 bytes | 6-7 decimal digits |
| \`double\` | 8 bytes | 15-16 decimal digits |
| \`bool\` | 1 byte | true / false |

## Verify With Code

\`\`\`cpp
#include <iostream>
#include <climits>

int main()
{
    std::cout << "int: " << sizeof(int) << " bytes" << std::endl;
    std::cout << "int min: " << INT_MIN << std::endl;
    std::cout << "int max: " << INT_MAX << std::endl;
    return 0;
}
\`\`\``,
  },
  {
    id: "ref-2",
    title: "Operator Precedence Table",
    category: "reference",
    content: `| Priority | Operators | Description |
|----------|-----------|-------------|
| 1 (highest) | \`()\` \`[]\` \`->\` \`.\` | Member access |
| 2 | \`!\` \`~\` \`++\` \`--\` \`+\` \`-\` \`*\` \`&\` | Unary |
| 3 | \`*\` \`/\` \`%\` | Multiplicative |
| 4 | \`+\` \`-\` | Additive |
| 5 | \`<<\` \`>>\` | Bitwise shift |
| 6 | \`<\` \`<=\` \`>\` \`>=\` | Relational |
| 7 | \`==\` \`!=\` | Equality |
| 8-12 | \`&&\` \`||\` etc. | Logical |
| 13 | \`?:\` | Ternary |
| 14 (lowest) | \`=\` \`+=\` etc. | Assignment |

> **Teaching Tip:** Don't memorize this. Use parentheses to make intent clear.`,
  },
  {
    id: "ref-3",
    title: "Common STL Complexities",
    category: "reference",
    content: `| Container | Access | Search | Insert/Delete |
|-----------|--------|--------|---------------|
| \`vector\` | O(1) | O(n) | O(n) |
| \`list\` | O(n) | O(n) | O(1) |
| \`map\` | O(log n) | O(log n) | O(log n) |
| \`set\` | O(log n) | O(log n) | O(log n) |
| \`unordered_map\` | O(1) avg | O(1) avg | O(1) avg |
| \`unordered_set\` | O(1) avg | O(1) avg | O(1) avg |

| Algorithm | Complexity |
|-----------|------------|
| \`sort\` | O(n log n) |
| \`find\` | O(n) |
| \`binary_search\` | O(log n) |
| \`reverse\` | O(n) |

> **Teaching Tip:** Show this table when discussing which container to use for a problem.`,
  },
  {
    id: "ref-4",
    title: "ASCII Values",
    category: "reference",
    content: `| Character | ASCII | Character | ASCII |
|-----------|-------|-----------|-------|
| \`'0'\` | 48 | \`'9'\` | 57 |
| \`'A'\` | 65 | \`'Z'\` | 90 |
| \`'a'\` | 97 | \`'z'\` | 122 |
| \`' '\` | 32 | \`'\\n'\` | 10 |

## Useful Patterns

\`\`\`cpp
// Convert digit char to int
int d = c - '0';      // '5' -> 5

// Convert int to digit char
char c = d + '0';      // 5 -> '5'

// Check if char is digit
bool isDigit = (c >= '0' && c <= '9');

// Check if char is uppercase
bool isUpper = (c >= 'A' && c <= 'Z');

// Convert to lowercase
char lower = c + 32;   // 'A' -> 'a'
\`\`\``,
  },
  {
    id: "ref-5",
    title: "C++ Keywords Cheat Sheet",
    category: "reference",
    content: `## Control Flow
\`\`\`text
if  else  switch  case  default
for  while  do  break  continue  return
\`\`\`

## Data Types
\`\`\`text
void  bool  char  int  float  double
const  static  extern  volatile
signed  unsigned  short  long
\`\`\`

## OOP
\`\`\`text
class  struct  union  enum
public  private  protected
virtual  override  friend  this
new  delete
\`\`\`

## Templates & STL
\`\`\`text
template  typename  class
namespace  using  typedef
\`\`\`

## Exception Handling
\`\`\`text
try  catch  throw
\`\`\`

## Other
\`\`\`text
auto  nullptr  true  false
sizeof  typeid  decltype
\`\`\``,
  },
];
