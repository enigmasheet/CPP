import { SUBJECTS, getTotalQuestions } from "@/config/subjects";

const totalQuestions = Object.keys(SUBJECTS).reduce(
  (sum, slug) => sum + getTotalQuestions(slug),
  0
);

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            TeachMate - Interactive learning platform for bachelor students
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{totalQuestions}+ MCQs</span>
            <span>{Object.keys(SUBJECTS).length} Subject{Object.keys(SUBJECTS).length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
