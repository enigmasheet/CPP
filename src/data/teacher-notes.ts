export interface NoteSection {
  id: number;
  title: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
}

export const teacherNotes: NoteSection[] = [
  {
    id: 1,
    title: "Course Introduction",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `## Learning Objectives

By the end of this course, students should be able to:

- Understand basic programming concepts
- Write basic C++ programs
- Use variables and data types
- Take input and produce output
- Use operators and expressions
- Make decisions using conditional statements
- Repeat operations using loops
- Create and use functions
- Work with arrays and strings
- Understand pointers and references
- Understand structures
- Understand Object-Oriented Programming
- Create classes and objects
- Apply inheritance and polymorphism
- Work with files
- Use the C++ Standard Library
- Solve programming problems`,
  },
  {
    id: 2,
    title: "What is Programming?",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `## Definition

**Programming is the process of writing instructions that tell a computer how to perform a task.**

### Example Problem

> Calculate the average marks of a student.

A human might think:

\`\`\`text
Get marks
Add marks
Divide by number of subjects
Display result
\`\`\`

A computer needs these instructions expressed in a programming language.

## Program

A **program** is a set of instructions written to solve a particular problem.

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "Hello World!";
    return 0;
}
\`\`\``,
  },
  {
    id: 3,
    title: "What is C++?",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `C++ is a **general-purpose, compiled programming language** that supports procedural, object-oriented, and generic programming.

## Why Learn C++?

- Learning programming fundamentals
- Data structures and algorithms
- Competitive programming
- Game development
- System software
- Embedded systems
- High-performance applications
- Operating systems
- Software engineering`,
  },
  {
    id: 4,
    title: "Compiler",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `A computer does not directly understand normal C++ source code. The source code is processed by a **compiler**.

\`\`\`text
C++ Source Code
       |
    Compiler
       |
Machine Code
       |
    Program
       |
      CPU
\`\`\`

## Important Terms

### Source Code
Code written by the programmer.

### Compiler
Software that translates source code into machine-executable code.

### Executable
The resulting program that the computer can execute.`,
  },
  {
    id: 5,
    title: "Installing C++",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `Students need:

1. C++ compiler
2. Code editor / IDE
3. Terminal or build environment

### Possible Setups

- Visual Studio
- VS Code with a C++ compiler
- Code::Blocks
- Other C++ IDEs
- Online C++ compiler

> **Teaching Tip:** For a classroom, choose one environment and standardize it so students don't spend the entire class troubleshooting different setups.`,
  },
  {
    id: 6,
    title: "First C++ Program",
    difficulty: "beginner",
    estimatedMinutes: 15,
    content: `\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "Hello World!";
    return 0;
}
\`\`\`

## Line-by-Line Explanation

### Line 1: \`#include <iostream>\`
This includes the standard input/output library. We need it for \`std::cout\` and \`std::cin\`.

### Line 2: \`int main()\`
\`main()\` is the entry point of a C++ program. Program execution begins from \`main()\`.

### \`{ }\`
These define a block of code.

### \`std::cout\`
Used to display output.

### \`return 0\`
Indicates that the program finished successfully.`,
  },
  {
    id: 7,
    title: "Printing Output",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## Basic Output

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "Hello";
    return 0;
}
\`\`\`

## Multiple Outputs

\`\`\`cpp
std::cout << "Hello";
std::cout << "World";
\`\`\`

Output: \`HelloWorld\`

## New Line

\`\`\`cpp
std::cout << "Hello\\n";
std::cout << "World";
\`\`\`

Output:
\`\`\`text
Hello
World
\`\`\`

Or:

\`\`\`cpp
std::cout << "Hello" << std::endl;
\`\`\`

## Multiple Values

\`\`\`cpp
std::cout << "Age: " << 20;
\`\`\`

Output: \`Age: 20\``,
  },
  {
    id: 8,
    title: "Comments",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `Comments are ignored by the compiler.

## Single-line Comment

\`\`\`cpp
// This is a comment
\`\`\`

## Multi-line Comment

\`\`\`cpp
/*
   This is
   a multi-line
   comment
*/
\`\`\`

> **Teaching Point:** Comments are for humans, not for the computer.

### Good Example

\`\`\`cpp
// Calculate total price
double total = price * quantity;
\`\`\``,
  },
  {
    id: 9,
    title: "Variables",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## Definition

A variable is a named location used to store data.

\`\`\`cpp
int age = 20;
\`\`\`

Think of it as:

\`\`\`text
age
 |
+------+
|  20  |
+------+
\`\`\`

## Variable Declaration

\`\`\`cpp
int age;
\`\`\`

## Assignment

\`\`\`cpp
age = 20;
\`\`\`

## Declaration + Initialization

\`\`\`cpp
int age = 20;
\`\`\``,
  },
  {
    id: 10,
    title: "Data Types",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## Important Beginner Data Types

| Type | Example | Purpose |
|------|---------|---------|
| \`int\` | \`10\` | Whole numbers |
| \`float\` | \`10.5f\` | Decimal numbers |
| \`double\` | \`10.5\` | More precise decimals |
| \`char\` | \`'A'\` | Single character |
| \`bool\` | \`true\` | True/false |
| \`std::string\` | \`"Ram"\` | Text |

## Examples

\`\`\`cpp
int age = 20;
double salary = 50000.50;
char grade = 'A';
bool passed = true;
std::string name = "Ram";
\`\`\`

For strings, include \`#include <string>\`.`,
  },
  {
    id: 11,
    title: "Character vs String",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `## Important Beginner Concept

Character: \`'A'\` (single quotes)

String: \`"A"\` (double quotes)

Character uses **single quotes**.

String uses **double quotes**.

## Example

\`\`\`cpp
char c = 'A';      // Character
std::string s = "A"; // String
\`\`\`

> **Common Mistake:** Students often confuse \`'A'\` (char) with \`"A"\` (string).`,
  },
  {
    id: 12,
    title: "Constants",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `Sometimes a value should not change.

\`\`\`cpp
const double PI = 3.14159;
\`\`\`

After this, \`PI = 5;\` is not allowed.

## Teaching Example

\`\`\`cpp
const double TAX_RATE = 0.13;

double calculateTax(double amount)
{
    return amount * TAX_RATE;
}
\`\`\`

> **Why constants?** They make programs safer and easier to understand. If a value is named and constant, programmers know it won't change accidentally.`,
  },
  {
    id: 13,
    title: "Input",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `Use \`std::cin\`.

\`\`\`cpp
int age;

std::cout << "Enter your age: ";
std::cin >> age;

std::cout << "You are " << age << " years old.";
\`\`\`

## Multiple Inputs

\`\`\`cpp
int a, b;

std::cin >> a >> b;
\`\`\`

Students can enter: \`10 20\``,
  },
  {
    id: 14,
    title: "Example - Student Information",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
#include <iostream>
#include <string>

int main()
{
    std::string name;
    int age;

    std::cout << "Enter your name: ";
    std::cin >> name;

    std::cout << "Enter your age: ";
    std::cin >> age;

    std::cout << "Name: " << name << "\\n";
    std::cout << "Age: " << age << "\\n";

    return 0;
}
\`\`\`

> **Teaching Tip:** Have students type this program themselves. Do not copy-paste.`,
  },
  {
    id: 15,
    title: "Arithmetic Operators",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `| Operator | Meaning |
|----------|---------|
| \`+\` | Addition |
| \`-\` | Subtraction |
| \`*\` | Multiplication |
| \`/\` | Division |
| \`%\` | Modulus |

## Example

\`\`\`cpp
int a = 10;
int b = 3;

std::cout << a + b;  // 13
std::cout << a - b;  // 7
std::cout << a * b;  // 30
std::cout << a / b;  // 3 (integer division!)
std::cout << a % b;  // 1
\`\`\``,
  },
  {
    id: 16,
    title: "Integer Division",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `## Very Important!

\`\`\`cpp
int result = 10 / 3;
\`\`\`

Result: \`3\` (not 3.3333)

Because both operands are integers.

## Compare

\`\`\`cpp
double result = 10.0 / 3;
\`\`\`

Result: \`3.3333\`

> **Common Mistake:** Students forget that integer division truncates the decimal part.`,
  },
  {
    id: 17,
    title: "Assignment Operators",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `\`\`\`text
=
+=
-=
*=
/=
%=
\`\`\`

## Example

\`\`\`cpp
int x = 10;
x += 5;  // x is now 15
x -= 3;  // x is now 12
x *= 2;  // x is now 24
x /= 4;  // x is now 6
x %= 4;  // x is now 2
\`\`\``,
  },
  {
    id: 18,
    title: "Increment and Decrement",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
x++;
\`\`\`

Equivalent conceptually to: \`x = x + 1;\`

Similarly:

\`\`\`cpp
x--;
\`\`\`

means: \`x = x - 1;\`

## Prefix vs Postfix

\`\`\`cpp
int a = 5;
int b = a++;  // b = 5, a = 6 (postfix: use then increment)
int c = ++a;  // c = 7, a = 7 (prefix: increment then use)
\`\`\`

> **Teaching Tip:** Draw a diagram showing the difference between prefix and postfix.`,
  },
  {
    id: 19,
    title: "Relational Operators",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `Used to compare values.

\`\`\`text
>
<
>=
<=
==
!=
\`\`\`

## Example

\`\`\`cpp
int age = 20;
std::cout << (age >= 18);  // 1 (true)
std::cout << (age < 18);   // 0 (false)
\`\`\`

> **Note:** In C++, \`true\` is represented as \`1\` and \`false\` as \`0\` when printed.`,
  },
  {
    id: 20,
    title: "= vs ==",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `## Very Important!

\`\`\`cpp
x = 10;    // Assignment: Assign 10 to x
x == 10    // Comparison: Is x equal to 10?
\`\`\`

## Common Mistake

\`\`\`cpp
if (x = 10)  // WRONG: This assigns 10 to x!
{
    // Always executes because 10 is truthy
}
\`\`\`

Correct:

\`\`\`cpp
if (x == 10)  // CORRECT: This checks equality
{
    // Executes only if x is 10
}
\`\`\`

> **Teaching Tip:** This is one of the most common bugs in C++. Some compilers warn about assignment in conditions.`,
  },
  {
    id: 21,
    title: "Conditional Statements",
    difficulty: "beginner",
    estimatedMinutes: 20,
    content: `## if

\`\`\`cpp
if (age >= 18)
{
    std::cout << "Adult";
}
\`\`\`

## if-else

\`\`\`cpp
if (age >= 18)
{
    std::cout << "Adult";
}
else
{
    std::cout << "Minor";
}
\`\`\`

## else if

\`\`\`cpp
if (marks >= 80)
{
    std::cout << "A";
}
else if (marks >= 60)
{
    std::cout << "B";
}
else if (marks >= 40)
{
    std::cout << "C";
}
else
{
    std::cout << "Fail";
}
\`\`\``,
  },
  {
    id: 22,
    title: "Logical Operators",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## AND (\`&&\`)

Both conditions must be true.

\`\`\`cpp
if (age >= 18 && age <= 60)
{
    std::cout << "Valid age";
}
\`\`\`

## OR (\`||\`)

At least one condition must be true.

\`\`\`cpp
if (day == "Saturday" || day == "Sunday")
{
    std::cout << "Weekend";
}
\`\`\`

## NOT (\`!\`)

Reverses a Boolean condition.

\`\`\`cpp
if (!isFinished)
{
    std::cout << "Still running";
}
\`\`\``,
  },
  {
    id: 23,
    title: "switch",
    difficulty: "beginner",
    estimatedMinutes: 15,
    content: `Useful when comparing one value against multiple fixed choices.

\`\`\`cpp
int choice;
std::cin >> choice;

switch (choice)
{
    case 1:
        std::cout << "Add";
        break;

    case 2:
        std::cout << "Delete";
        break;

    case 3:
        std::cout << "Exit";
        break;

    default:
        std::cout << "Invalid choice";
}
\`\`\`

> **Teaching Point:** Explain the purpose of \`break\`. Without it, execution "falls through" to the next case.`,
  },
  {
    id: 24,
    title: "Loops",
    difficulty: "beginner",
    estimatedMinutes: 15,
    content: `## Why Loops?

Suppose we need to print:

\`\`\`text
1
2
3
4
5
\`\`\`

Without a loop:

\`\`\`cpp
std::cout << 1;
std::cout << 2;
std::cout << 3;
std::cout << 4;
std::cout << 5;
\`\`\`

With a loop:

\`\`\`cpp
for (int i = 1; i <= 5; i++)
{
    std::cout << i << "\\n";
}
\`\`\`

> **Teaching Tip:** Ask students: "How would you print numbers from 1 to 1,000?" Let them see the problem first.`,
  },
  {
    id: 25,
    title: "for Loop",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## Syntax

\`\`\`cpp
for (initialization; condition; update)
{
    // statements
}
\`\`\`

## Example

\`\`\`cpp
for (int i = 1; i <= 10; i++)
{
    std::cout << i << "\\n";
}
\`\`\``,
  },
  {
    id: 26,
    title: "How a for Loop Executes",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `For:

\`\`\`cpp
for (int i = 1; i <= 3; i++)
\`\`\`

## Execution Trace

\`\`\`text
i = 1
 |
condition true (1 <= 3)
 |
execute body
 |
i++
 |
condition true (2 <= 3)
 |
execute body
 |
i++
 |
condition true (3 <= 3)
 |
execute body
 |
i++
 |
condition false (4 <= 3)
 |
stop
\`\`\`

> **Teaching Tip:** This tracing exercise is extremely useful for beginners. Have students trace loops on paper.`,
  },
  {
    id: 27,
    title: "while Loop",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
int i = 1;

while (i <= 5)
{
    std::cout << i << "\\n";
    i++;
}
\`\`\`

Use \`while\` when repetition depends primarily on a condition.

## Example

\`\`\`cpp
int number;
std::cout << "Enter a positive number: ";
std::cin >> number;

while (number < 0)
{
    std::cout << "Invalid! Try again: ";
    std::cin >> number;
}
\`\`\``,
  },
  {
    id: 28,
    title: "do-while",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
int i = 1;

do
{
    std::cout << i << "\\n";
    i++;
}
while (i <= 5);
\`\`\`

## Important Difference

> \`do-while\` executes the body at least once.

## Example

\`\`\`cpp
int choice;

do
{
    std::cout << "1. Play\\n";
    std::cout << "2. Settings\\n";
    std::cout << "3. Exit\\n";
    std::cout << "Enter choice: ";
    std::cin >> choice;
}
while (choice != 3);
\`\`\``,
  },
  {
    id: 29,
    title: "break and continue",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## break

Stops the loop.

\`\`\`cpp
for (int i = 1; i <= 10; i++)
{
    if (i == 5)
        break;

    std::cout << i << "\\n";
}
\`\`\`

Output: 1 2 3 4

## continue

Skips the current iteration.

\`\`\`cpp
for (int i = 1; i <= 5; i++)
{
    if (i == 3)
        continue;

    std::cout << i << "\\n";
}
\`\`\`

Output: 1 2 4 5`,
  },
  {
    id: 30,
    title: "Functions",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    content: `## Why Functions?

Functions help:

- Organize code
- Reuse code
- Reduce duplication
- Make programs easier to understand
- Break large problems into smaller problems

## Simple Function

\`\`\`cpp
void greet()
{
    std::cout << "Hello";
}
\`\`\`

Call: \`greet();\``,
  },
  {
    id: 31,
    title: "Function Parameters",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
void greet(std::string name)
{
    std::cout << "Hello " << name;
}
\`\`\`

Call: \`greet("Ram");\`

## Multiple Parameters

\`\`\`cpp
void add(int a, int b)
{
    std::cout << a + b;
}
\`\`\`

Call: \`add(10, 20);\``,
  },
  {
    id: 32,
    title: "Return Values",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
int add(int a, int b)
{
    return a + b;
}
\`\`\`

Usage:

\`\`\`cpp
int result = add(10, 20);
std::cout << result;  // 30
\`\`\`

## Function That Returns Boolean

\`\`\`cpp
bool isEven(int n)
{
    return n % 2 == 0;
}
\`\`\`

Usage:

\`\`\`cpp
if (isEven(4))
{
    std::cout << "Even";
}
\`\`\``,
  },
  {
    id: 33,
    title: "Function Structure",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `Teach students to identify:

\`\`\`cpp
int add(int a, int b)
{
    return a + b;
}
\`\`\`

| Part | Meaning |
|------|---------|
| \`int\` | Return type |
| \`add\` | Function name |
| \`int a\` | Parameter |
| \`int b\` | Parameter |
| \`return\` | Sends value back |

## Function Declaration vs Definition

Declaration (prototype):

\`\`\`cpp
int add(int a, int b);
\`\`\`

Definition:

\`\`\`cpp
int add(int a, int b)
{
    return a + b;
}
\`\`\``,
  },
  {
    id: 34,
    title: "Arrays",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `An array stores multiple values of the same type.

\`\`\`cpp
int marks[5];
\`\`\`

Initialize:

\`\`\`cpp
int marks[5] = {80, 70, 90, 60, 85};
\`\`\`

## Partial Initialization

\`\`\`cpp
int arr[5] = {10, 20};  // {10, 20, 0, 0, 0}
\`\`\`

## Zero Initialization

\`\`\`cpp
int arr[5] = {};  // {0, 0, 0, 0, 0}
\`\`\``,
  },
  {
    id: 35,
    title: "Array Indexing",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `C++ arrays start at **index 0**.

\`\`\`text
Index:   0   1   2   3   4
         |   |   |   |   |
Marks:  80  70  90  60  85
\`\`\`

Therefore: \`marks[0]\` is \`80\`.

\`\`\`cpp
std::cout << marks[0];  // 80
std::cout << marks[2];  // 90
\`\`\`

> **Common Mistake:** Accessing \`marks[5]\` on an array of size 5 is out of bounds!`,
  },
  {
    id: 36,
    title: "Arrays + Loops",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `\`\`\`cpp
int marks[5] = {80, 70, 90, 60, 85};

for (int i = 0; i < 5; i++)
{
    std::cout << marks[i] << "\\n";
}
\`\`\`

This is an important point where students begin combining concepts.

## Finding Maximum

\`\`\`cpp
int marks[5] = {80, 70, 90, 60, 85};
int max = marks[0];

for (int i = 1; i < 5; i++)
{
    if (marks[i] > max)
    {
        max = marks[i];
    }
}

std::cout << "Maximum: " << max;
\`\`\``,
  },
  {
    id: 37,
    title: "Strings",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `\`\`\`cpp
std::string name = "Abhay";
\`\`\`

## Useful Operations

\`\`\`cpp
name.length();     // 5
name.empty();      // false
\`\`\`

## Concatenation

\`\`\`cpp
std::string first = "Hello ";
std::string second = "World";
std::string result = first + second;  // "Hello World"
\`\`\`

## Accessing Characters

\`\`\`cpp
std::string name = "Hello";
std::cout << name[0];  // H
std::cout << name[4];  // o
\`\`\``,
  },
  {
    id: 38,
    title: "getline()",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `## Difference

\`\`\`cpp
std::cin >> name;
\`\`\`

Reads one whitespace-delimited value.

\`\`\`cpp
std::getline(std::cin, name);
\`\`\`

Reads a complete line.

## Example

\`\`\`cpp
std::string fullName;

std::cout << "Enter your full name: ";
std::getline(std::cin, fullName);

std::cout << "Hello, " << fullName;
\`\`\`

> **Teaching Tip:** Mix \`cin >>\` and \`getline()\` in exercises to show the difference.`,
  },
  {
    id: 39,
    title: "Pointers",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    content: `Introduce pointers only after students understand variables.

A pointer stores an **address**.

\`\`\`cpp
int x = 10;
int* p = &x;
\`\`\`

Here:

\`\`\`text
x  -> value
&x -> address
p  -> address stored in pointer
*p -> value at that address
\`\`\`

## Key Operators

| Operator | Meaning |
|----------|---------|
| \`&\` | Address-of |
| \`*\` | Dereference |`,
  },
  {
    id: 40,
    title: "Pointer Example",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `\`\`\`cpp
int x = 10;
int* p = &x;

std::cout << x << "\\n";    // 10
std::cout << &x << "\\n";   // address of x
std::cout << p << "\\n";    // same address
std::cout << *p << "\\n";   // 10 (dereference)
\`\`\`

## Modifying via Pointer

\`\`\`cpp
int x = 10;
int* p = &x;

*p = 20;  // Change value at address

std::cout << x;  // 20
\`\`\`

> **Teaching Tip:** Draw memory diagrams showing addresses and values.`,
  },
  {
    id: 41,
    title: "References",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `\`\`\`cpp
int x = 10;
int& ref = x;
\`\`\`

\`ref\` becomes another name for \`x\`.

\`\`\`cpp
ref = 20;
std::cout << x;  // 20
\`\`\`

## References vs Pointers

| Feature | Reference | Pointer |
|---------|-----------|---------|
| Syntax | \`int& ref = x;\` | \`int* p = &x;\` |
| Null | Cannot be null | Can be null |
| Rebinding | Cannot rebind | Can rebind |
| Access | Direct: \`ref\` | Dereference: \`*p\` |`,
  },
  {
    id: 42,
    title: "Structures",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `Structures allow us to group related data.

\`\`\`cpp
struct Student
{
    std::string name;
    int age;
    double marks;
};
\`\`\`

Create:

\`\`\`cpp
Student s;
s.name = "Ram";
s.age = 20;
s.marks = 85.5;
\`\`\`

## Initialization

\`\`\`cpp
Student s = {"Ram", 20, 85.5};
\`\`\`

## Array of Structures

\`\`\`cpp
Student students[3] = {
    {"Ram", 20, 85.5},
    {"Shyam", 21, 90.0},
    {"Hari", 19, 78.0}
};
\`\`\``,
  },
  {
    id: 43,
    title: "Introduction to OOP",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `> Object-Oriented Programming is a way of designing programs around objects that contain data and behavior.

## Important Concepts

\`\`\`text
Class
Object
Encapsulation
Inheritance
Polymorphism
Abstraction
\`\`\`

## Real-World Analogy

\`\`\`text
Class -> Blueprint for a house
Object -> Actual house built from blueprint
\`\`\`

## Benefits

- Code reusability
- Data hiding (security)
- Easier maintenance
- Real-world modeling`,
  },
  {
    id: 44,
    title: "Classes",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `A class is a blueprint for objects.

\`\`\`cpp
class Student
{
public:
    std::string name;
    int age;
};
\`\`\`

Create object:

\`\`\`cpp
Student s1;
s1.name = "Ram";
s1.age = 20;
\`\`\`

## Access Specifiers

| Specifier | Access |
|-----------|--------|
| \`public\` | Accessible from anywhere |
| \`private\` | Accessible only within class |
| \`protected\` | Accessible within class and derived classes |`,
  },
  {
    id: 45,
    title: "Class vs Object",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `Use a real-world analogy.

\`\`\`text
Class
  |
Blueprint

Object
  |
Actual thing created from blueprint
\`\`\`

Example:

\`\`\`text
Class -> Student

Objects:
student1 (Ram, 20)
student2 (Shyam, 21)
student3 (Hari, 19)
\`\`\`

> **Teaching Tip:** Draw diagrams showing one class creating multiple objects.`,
  },
  {
    id: 46,
    title: "Constructors",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `A constructor is called when an object is created.

## Default Constructor

\`\`\`cpp
class Student
{
public:
    Student()
    {
        std::cout << "Student created";
    }
};
\`\`\`

## Parameterized Constructor

\`\`\`cpp
class Student
{
public:
    std::string name;
    int age;

    Student(std::string n, int a)
    {
        name = n;
        age = a;
    }
};
\`\`\`

Create:

\`\`\`cpp
Student s("Ram", 20);
\`\`\`

## Initializer List (Preferred)

\`\`\`cpp
Student(std::string n, int a) : name(n), age(a) {}
\`\`\``,
  },
  {
    id: 47,
    title: "Encapsulation",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    content: `Encapsulation means controlling access to an object's data and behavior.

\`\`\`cpp
class BankAccount
{
private:
    double balance;

public:
    void deposit(double amount)
    {
        if (amount > 0)
            balance += amount;
    }

    double getBalance()
    {
        return balance;
    }
};
\`\`\`

\`\`\`text
private -> internal data
public  -> controlled interface
\`\`\`

## Benefits

- Data protection
- Controlled access
- Easy maintenance
- Flexibility to change internal implementation`,
  },
  {
    id: 48,
    title: "Inheritance",
    difficulty: "advanced",
    estimatedMinutes: 20,
    content: `Inheritance allows one class to derive from another.

\`\`\`text
          Person
            |
     ----------------
     |              |
   Student        Teacher
\`\`\`

\`\`\`cpp
class Person
{
public:
    std::string name;
};

class Student : public Person
{
public:
    int rollNumber;
};
\`\`\`

Usage:

\`\`\`cpp
Student s;
s.name = "Ram";      // Inherited from Person
s.rollNumber = 101;  // Own member
\`\`\`

## Types of Inheritance

- Single
- Multiple
- Multilevel
- Hierarchical
- Hybrid`,
  },
  {
    id: 49,
    title: "Polymorphism",
    difficulty: "advanced",
    estimatedMinutes: 25,
    content: `Polymorphism means: **One interface can have different implementations.**

## Function Overloading

\`\`\`cpp
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
\`\`\`

## Virtual Functions (Runtime Polymorphism)

\`\`\`cpp
class Animal
{
public:
    virtual void sound()
    {
        std::cout << "Animal sound";
    }
};

class Dog : public Animal
{
public:
    void sound() override
    {
        std::cout << "Bark";
    }
};
\`\`\`

\`\`\`cpp
Animal* a = new Dog();
a->sound();  // Output: Bark
\`\`\``,
  },
  {
    id: 50,
    title: "Exception Handling",
    difficulty: "advanced",
    estimatedMinutes: 15,
    content: `Programs can encounter exceptional situations.

\`\`\`cpp
try
{
    int a = 10;
    int b = 0;

    if (b == 0)
        throw "Division by zero";

    std::cout << a / b;
}
catch (const char* msg)
{
    std::cout << "Error: " << msg;
}
\`\`\`

## Keywords

| Keyword | Purpose |
|---------|---------|
| \`try\` | Block of code that might throw |
| \`catch\` | Handles the exception |
| \`throw\` | Signals an exception |

## Standard Exceptions

\`\`\`cpp
#include <stdexcept>

throw std::runtime_error("Something went wrong");
\`\`\``,
  },
  {
    id: 51,
    title: "File Handling",
    difficulty: "advanced",
    estimatedMinutes: 15,
    content: `## Writing to File

\`\`\`cpp
#include <fstream>

std::ofstream file("data.txt");
file << "Hello World";
file.close();
\`\`\`

## Reading from File

\`\`\`cpp
#include <fstream>

std::ifstream file("data.txt");
std::string text;

while (std::getline(file, text))
{
    std::cout << text << "\\n";
}
file.close();
\`\`\`

## Check if File Exists

\`\`\`cpp
std::ifstream file("data.txt");
if (file.is_open())
{
    // File exists, read it
    file.close();
}
\`\`\``,
  },
  {
    id: 52,
    title: "STL",
    difficulty: "advanced",
    estimatedMinutes: 25,
    content: `Introduce the **Standard Template Library** after students understand the basics.

## Important Containers

| Container | Description |
|-----------|-------------|
| \`vector\` | Dynamic array |
| \`array\` | Fixed-size array |
| \`string\` | String class |
| \`map\` | Key-value pairs |
| \`set\` | Unique sorted elements |
| \`stack\` | LIFO |
| \`queue\` | FIFO |
| \`priority_queue\` | Sorted queue |

## Important Algorithms

\`\`\`cpp
sort()
find()
reverse()
\`\`\``,
  },
  {
    id: 53,
    title: "vector",
    difficulty: "advanced",
    estimatedMinutes: 15,
    content: `A vector is a dynamic sequence container.

\`\`\`cpp
#include <vector>

std::vector<int> numbers;

numbers.push_back(10);
numbers.push_back(20);
numbers.push_back(30);
\`\`\`

## Loop

\`\`\`cpp
for (int number : numbers)
{
    std::cout << number << "\\n";
}
\`\`\`

## Size and Access

\`\`\`cpp
numbers.size();    // 3
numbers[0];        // 10
numbers.at(1);     // 20 (with bounds checking)
numbers.pop_back(); // Remove last element
\`\`\`

## 2D Vector

\`\`\`cpp
std::vector<std::vector<int>> matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
\`\`\``,
  },
  {
    id: 54,
    title: "Problem-Solving Practice",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    content: `Students should solve problems continuously.

## Beginner Problems

### Problem 1
Input two numbers and calculate sum, difference, product, quotient.

### Problem 2
Check whether a number is even or odd.

### Problem 3
Find the largest of three numbers.

### Problem 4
Calculate student grade.

### Problem 5
Calculate factorial.

### Problem 6
Check whether a number is prime.

### Problem 7
Reverse a number.

### Problem 8
Check whether a number is palindrome.

> **Teaching Tip:** Start each class with a 10-minute problem-solving warmup.`,
  },
  {
    id: 55,
    title: "Array Problems",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    content: `Students should solve:

1. Find maximum
2. Find minimum
3. Calculate sum
4. Calculate average
5. Search for an element
6. Count even numbers
7. Count odd numbers
8. Reverse array
9. Sort array
10. Find duplicate values

## Example: Find Maximum

\`\`\`cpp
int arr[5] = {23, 55, 2, 67, 12};
int max = arr[0];

for (int i = 1; i < 5; i++)
{
    if (arr[i] > max)
        max = arr[i];
}

std::cout << "Maximum: " << max;
\`\`\``,
  },
  {
    id: 56,
    title: "Mini Project Ideas",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    content: `After fundamentals, give students small projects.

## Project 1 - Student Grade System

Features:
- Enter student
- Enter marks
- Calculate total
- Calculate average
- Determine grade
- Display result

## Project 2 - Calculator

Operations: +, -, *, /, %

## Project 3 - Number Guessing Game

Computer chooses a number. Student guesses. Program responds: Too high, Too low, Correct.

## Project 4 - Student Management System

Store: Student ID, Name, Age, Marks
Operations: Add, Display, Search, Update, Delete

> **Teaching Tip:** Project 4 is excellent for introducing classes and vectors.`,
  },
  {
    id: 57,
    title: "First-Class Teaching Plan",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `## First 90 Minutes

### Part 1 - Introduction (10 minutes)
Discuss: What is programming? Why programming? What is C++? Where is C++ used?

### Part 2 - Environment (15 minutes)
Set up compiler/IDE. Students create their first project.

### Part 3 - Hello World (20 minutes)
Write the first program. Explain every line.

### Part 4 - Modify the Program (15 minutes)
Students create their own version:

\`\`\`cpp
#include <iostream>

int main()
{
    std::cout << "My name is [Name]\\n";
    std::cout << "I am learning C++\\n";
    std::cout << "This is my first program\\n";
    return 0;
}
\`\`\`

### Part 5 - Student Challenge (30 minutes)
Ask students to print a profile card:

\`\`\`text
========================
      MY PROFILE
========================

Name: __________
Age: __________
College: __________
Program: __________

========================
\`\`\``,
  },
  {
    id: 58,
    title: "Recommended Teaching Pattern",
    difficulty: "beginner",
    estimatedMinutes: 10,
    content: `For every new concept, use:

\`\`\`text
1. Problem
      |
2. Why do we need this?
      |
3. Concept
      |
4. Syntax
      |
5. Simple Example
      |
6. Explain Execution
      |
7. Student Exercise
      |
8. More Difficult Problem
\`\`\`

## Example: Loops

**Don't begin with:** "Today we are learning for loops."

**Instead ask:** "How would you print numbers from 1 to 1,000?"

Let students see the problem first. Then introduce:

\`\`\`cpp
for (int i = 1; i <= 1000; i++)
{
    std::cout << i << "\\n";
}
\`\`\`

The syntax now has a **reason**.`,
  },
  {
    id: 59,
    title: "What Students Should NOT Do",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `Avoid making beginners memorize:

\`\`\`text
syntax
syntax
syntax
syntax
\`\`\`

Instead, make them write programs.

## Good Ratio

\`\`\`text
30% Explanation
70% Coding / Practice
\`\`\`

## Questions to Ask Students

During practical classes, walk around and ask:

- What are you trying to solve?
- What does this variable store?
- What is the value of \`i\` here?
- Why is this condition true?
- What happens in the next iteration?
- What happens if the input is \`0\`?
- What happens if the input is negative?

This develops **programming thinking**, not just syntax knowledge.`,
  },
  {
    id: 60,
    title: "Core Topics Checklist",
    difficulty: "beginner",
    estimatedMinutes: 5,
    content: `By the end of the introductory portion, students should know:

- Programming fundamentals
- Algorithms and problem solving
- C++ basics
- Compiler
- Source code
- main()
- cout
- cin
- Comments
- Variables
- Constants
- Data types
- Type conversion
- Operators
- Expressions
- if / else / else if
- switch
- for / while / do-while
- break / continue
- Functions
- Parameters
- Return values
- Arrays
- Strings
- Pointers
- References
- Structures
- Classes / Objects
- Constructors
- Encapsulation
- Inheritance
- Polymorphism
- Exception handling
- File handling
- STL
- Problem solving
- Mini project

---

## Teacher's Golden Rule

> **Don't teach students how to write C++ code. Teach them how to think like programmers using C++.**

A student who memorizes syntax but cannot solve a simple problem has not really learned programming.

A student who can take a problem, break it into smaller steps, choose the appropriate C++ concepts, implement them, test the program, find errors, and improve the solution is actually learning **computer programming**.`,
  },
];
