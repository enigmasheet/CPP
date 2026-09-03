"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Topic {
  slug: string;
  name: string;
}

export default function TopicSidebar({
  topics,
  slug,
  topicSlug,
}: {
  topics: Topic[];
  slug: string;
  topicSlug: string;
}) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Open topic navigation">
        <Menu className="w-5 h-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <nav className="flex flex-col gap-2 mt-8">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-3">Topics</p>
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/subjects/${slug}/learn/${t.slug}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                t.slug === topicSlug
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
