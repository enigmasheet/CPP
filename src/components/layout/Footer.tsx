import Link from "next/link";
import { SUBJECTS } from "@/config/subjects";

const subjectCount = Object.keys(SUBJECTS).length;

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            TeachMate - Interactive learning platform for bachelor students
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href={`/subjects/${Object.keys(SUBJECTS)[0]}/learn`} className="hover:text-foreground transition-colors">
              Learn
            </Link>
            <Link href="/join" className="hover:text-foreground transition-colors">
              Join Session
            </Link>
            <span className="text-muted-foreground">|</span>
            <span>{subjectCount} Subject{subjectCount > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
