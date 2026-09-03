import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getSubject, getTopics } from "@/config/subjects";
import { verifyAdmin } from "@/lib/auth";

export default async function MCQTopicsPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) redirect("/join");

  const { subject: slug } = await params;
  const subject = getSubject(slug);
  if (!subject) redirect("/join");
  const topics = getTopics(slug);

  return (
    <AppShell>
      <PageHeader
        title={`${subject.name} - MCQ Quizzes`}
        description="Choose a topic to test your knowledge"
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/subjects/${slug}/mcq/${topic.slug}`}>
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={`/subjects/${slug}`} className={buttonVariants({ variant: "ghost" })}>
            Back to {subject.name} Overview
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
