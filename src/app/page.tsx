import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  LogIn,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { SUBJECTS, getTopics, getNoteCounts } from "@/config/subjects";
import { STUDENT_TOPICS_FILTER } from "@/lib/constants";

const allSubjects = Object.values(SUBJECTS);
const firstSlug = allSubjects[0]?.slug;

export default function Home() {
  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-linear-to-r from-zinc-600 via-zinc-900 to-black dark:from-zinc-100 dark:via-white dark:to-zinc-400 bg-clip-text text-transparent">
                TeachMate
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Interactive learning platform for bachelor students.
              Learn at your own pace, practice through teacher-led sessions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/subjects/${firstSlug}/learn`} className={buttonVariants({ size: "lg" })}>
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning
              </Link>
              <Link href="/join" className={buttonVariants({ size: "lg", variant: "outline" })}>
                <LogIn className="w-4 h-4 mr-2" />
                Join Session
              </Link>
              <Link href="/my-progress" className={buttonVariants({ size: "lg", variant: "outline" })}>
                <BarChart3 className="w-4 h-4 mr-2" />
                My Progress
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Subjects</h2>
          <p className="text-muted-foreground mt-2">{allSubjects.length} subjects available</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubjects.map((subject) => {
            const topics = getTopics(subject.slug).filter((t) => t.slug !== STUDENT_TOPICS_FILTER);
            const noteCounts = getNoteCounts(subject.slug);
            const totalNotes = topics.reduce((sum, t) => sum + (noteCounts[t.slug] ?? 0), 0);

            return (
              <Link key={subject.slug} href={`/subjects/${subject.slug}/learn`}>
                <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer">
                  <CardHeader>
                    <div className="text-primary mb-2">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{topics.length} topics</span>
                      <span>{totalNotes} notes</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Study Materials"
            description="Structured curriculum with topics covering fundamentals to advanced concepts"
            href={`/subjects/${firstSlug}/learn`}
          />
          <FeatureCard
            icon={<GraduationCap className="w-8 h-8" />}
            title="Practice Quizzes"
            description="Join teacher-led sessions or practice with standalone topic quizzes"
            href="/join"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Track Progress"
            description="Monitor your learning journey, review completed topics, and check quiz scores"
            href="/my-progress"
          />
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
