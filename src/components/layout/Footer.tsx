export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Interactive C++ learning platform for bachelor students
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>50+ MCQs</span>
            <span>10 Topics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
