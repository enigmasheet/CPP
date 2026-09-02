import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  FlaskConical,
  Brain,
  Target,
  Code2,
  Layers,
  LogIn,
} from "lucide-react";
import { SUBJECTS, getTopics, getTotalQuestions } from "@/config/subjects";

const subjectSlug = "cpp";
const subject = SUBJECTS[subjectSlug];
const topics = getTopics(subjectSlug);
const totalQuestions = getTotalQuestions(subjectSlug);

export default function Home() {
  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Master{" "}
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                C++
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Interactive quizzes and hands-on coding practice designed for
              bachelor students
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/subjects/${subjectSlug}`} className={buttonVariants({ size: "lg" })}>
                Start Learning
              </Link>
              <Link href="/join" className={buttonVariants({ size: "lg", variant: "outline" })}>
                <LogIn className="w-4 h-4 mr-2" />
                Join Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FlaskConical className="w-8 h-8" />}
            title="MCQ Quizzes"
            description={`${totalQuestions}+ questions across ${topics.length} topics with instant feedback and explanations`}
            href={`/subjects/${subjectSlug}/mcq`}
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Study Materials"
            description={`Structured content covering ${subject.name} fundamentals to advanced concepts`}
            href={`/subjects/${subjectSlug}`}
          />
          <FeatureCard
            icon={<Code2 className="w-8 h-8" />}
            title="Code Examples"
            description="Syntax-highlighted code snippets with line-by-line explanations"
            href={`/subjects/${subjectSlug}`}
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="C++ Fundamentals"
            description="From basics to modern C++ - covers all essential topics"
            href={`/subjects/${subjectSlug}`}
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Self-Assessment"
            description="Test your knowledge with topic-specific quizzes"
            href={`/subjects/${subjectSlug}/mcq`}
          />
          <FeatureCard
            icon={<Layers className="w-8 h-8" />}
            title={`${topics.length} Topics`}
            description="Basics, Control Flow, Functions, OOP, Pointers, STL, and more"
            href={`/subjects/${subjectSlug}`}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Topics Covered</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/subjects/${subjectSlug}/mcq/${topic.slug}`}
              className="group p-4 bg-card rounded-lg border border-border text-center transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <span className="font-medium group-hover:text-primary transition-colors">
                {topic.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer">
        <CardHeader>
          <div className="text-primary mb-2">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
