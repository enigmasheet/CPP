/* eslint-disable no-console */
import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import Subject from "../src/models/Subject";
import MCQ from "../src/models/MCQ";
import Resource from "../src/models/Resource";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cpp-cms";

const resources = [
  {
    topic: "Basics",
    title: "Hello World in C++",
    type: "code",
    content: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "Basics",
    title: "Variables and Data Types",
    type: "code",
    content: `#include <iostream>
using namespace std;

int main() {
    int age = 25;
    double salary = 50000.50;
    char grade = 'A';
    string name = "John";
    bool isStudent = true;

    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Salary: " << salary << endl;
    cout << "Grade: " << grade << endl;
    cout << "Student: " << isStudent << endl;

    return 0;
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "Control Flow",
    title: "If-Else Statement",
    type: "code",
    content: `#include <iostream>
using namespace std;

int main() {
    int marks = 85;

    if (marks >= 90) {
        cout << "Grade: A+" << endl;
    } else if (marks >= 80) {
        cout << "Grade: A" << endl;
    } else if (marks >= 70) {
        cout << "Grade: B" << endl;
    } else {
        cout << "Grade: C" << endl;
    }

    return 0;
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "Control Flow",
    title: "For Loop Pattern",
    type: "code",
    content: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "* ";
        }
        cout << endl;
    }
    return 0;
}`,
    language: "cpp",
    difficulty: "beginner",
  },
  {
    topic: "Functions",
    title: "Function Overloading",
    type: "code",
    content: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(2, 3) << endl;        // 5
    cout << add(2.5, 3.5) << endl;    // 6
    cout << add(1, 2, 3) << endl;     // 6
    return 0;
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "OOP",
    title: "Class and Object",
    type: "code",
    content: `#include <iostream>
using namespace std;

class Car {
private:
    string brand;
    int year;

public:
    Car(string b, int y) : brand(b), year(y) {}

    void display() {
        cout << year << " " << brand << endl;
    }

    ~Car() {
        cout << brand << " destroyed" << endl;
    }
};

int main() {
    Car car1("Toyota", 2020);
    Car car2("Honda", 2022);

    car1.display();
    car2.display();

    return 0;
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "OOP",
    title: "Inheritance and Polymorphism",
    type: "code",
    content: `#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() {
        cout << "..." << endl;
    }
};

class Dog : public Animal {
public:
    void speak() override {
        cout << "Woof!" << endl;
    }
};

class Cat : public Animal {
public:
    void speak() override {
        cout << "Meow!" << endl;
    }
};

int main() {
    Animal* animals[] = { new Dog(), new Cat(), new Animal() };

    for (Animal* a : animals) {
        a->speak();
    }

    for (Animal* a : animals) {
        delete a;
    }

    return 0;
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "Pointers",
    title: "Pointer Basics",
    type: "code",
    content: `#include <iostream>
using namespace std;

int main() {
    int x = 42;
    int* ptr = &x;

    cout << "Value of x: " << x << endl;
    cout << "Address of x: " << &x << endl;
    cout << "Value of ptr: " << ptr << endl;
    cout << "Dereferenced ptr: " << *ptr << endl;

    *ptr = 100;
    cout << "New value of x: " << x << endl;

    return 0;
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "STL",
    title: "Vector and Map",
    type: "code",
    content: `#include <iostream>
#include <vector>
#include <map>
using namespace std;

int main() {
    vector<int> nums = {10, 20, 30, 40, 50};

    for (int n : nums) {
        cout << n << " ";
    }
    cout << endl;

    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;

    for (auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }

    return 0;
}`,
    language: "cpp",
    difficulty: "intermediate",
  },
  {
    topic: "Modern C++",
    title: "Lambda Expressions",
    type: "code",
    content: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9};

    sort(nums.begin(), nums.end(), [](int a, int b) {
        return a < b;
    });

    for (int n : nums) {
        cout << n << " ";
    }
    cout << endl;

    auto square = [](int x) { return x * x; };
    cout << "Square of 5: " << square(5) << endl;

    return 0;
}`,
    language: "cpp",
    difficulty: "advanced",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const subjectsData = JSON.parse(fs.readFileSync(path.join(__dirname, "subjects.json"), "utf-8"));
    const mcqsData = JSON.parse(fs.readFileSync(path.join(__dirname, "mcqs.json"), "utf-8"));

    await Subject.deleteMany({});
    await MCQ.deleteMany({});
    await Resource.deleteMany({});

    console.log("Cleared existing data");

    const subject = await Subject.create(subjectsData[0]);
    console.log("Created subject:", subject.name);

    const mcqsWithSubject = mcqsData.map((mcq: Record<string, unknown>) => ({
      ...mcq,
      subject: subject._id,
    }));
    await MCQ.insertMany(mcqsWithSubject);
    console.log("Created", mcqsWithSubject.length, "MCQs");

    const resourcesWithSubject = resources.map((r: Record<string, unknown>) => ({
      ...r,
      subject: subject._id,
    }));
    await Resource.insertMany(resourcesWithSubject);
    console.log("Created", resourcesWithSubject.length, "resources");

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
