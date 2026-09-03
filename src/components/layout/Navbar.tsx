"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUBJECTS } from "@/config/subjects";
import {
  Menu,
  BookOpen,
  FlaskConical,
  LogIn,
  Shield,
  ChevronDown,
  GraduationCap,
  LogOut,
} from "lucide-react";

const subjects = Object.values(SUBJECTS);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => {
        setIsTeacher(data.authenticated);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <FlaskConical className="w-5 h-5" />
          <span className="bg-linear-to-r from-zinc-100 via-white to-zinc-400 bg-clip-text text-transparent">
            TeachMate
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {subjects.length === 1 ? (
            <>
              <Link
                href={`/subjects/${subjects[0].slug}/learn`}
                className={buttonVariants({
                  variant: pathname.includes("/learn") ? "secondary" : "ghost",
                  size: "sm",
                })}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({
                  variant: pathname.startsWith("/subjects") ? "secondary" : "ghost",
                  size: "sm",
                })}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Subjects
                <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {subjects.map((subject) => (
                  <DropdownMenuItem key={subject.slug}>
                    <Link href={`/subjects/${subject.slug}/learn`} className="flex items-center gap-2 w-full">
                      <BookOpen className="w-4 h-4" />
                      <span>{subject.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link
            href="/join"
            className={buttonVariants({
              variant: pathname === "/join" ? "secondary" : "ghost",
              size: "sm",
            })}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Join Session
          </Link>

          {isTeacher && (
            <>
              <Link
                href="/admin"
                className={buttonVariants({
                  variant: pathname === "/admin" ? "secondary" : "ghost",
                  size: "sm",
                })}
              >
                <Shield className="w-4 h-4 mr-2" />
                Teacher
              </Link>
              <button
                onClick={handleLogout}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </button>
            </>
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-2 mt-8">
              {subjects.map((subject) => (
                <Link
                  key={subject.slug}
                  href={`/subjects/${subject.slug}/learn`}
                  className={buttonVariants({
                    variant: pathname.includes(`/subjects/${subject.slug}/learn`) ? "secondary" : "ghost",
                  })}
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Learn {subject.name}
                </Link>
              ))}
              <Link
                href="/join"
                className={buttonVariants({
                  variant: pathname === "/join" ? "secondary" : "ghost",
                })}
                onClick={() => setOpen(false)}
              >
                <LogIn className="w-4 h-4 mr-3" />
                Join Session
              </Link>
              {isTeacher && (
                <>
                  <Link
                    href="/admin"
                    className={buttonVariants({
                      variant: pathname === "/admin" ? "secondary" : "ghost",
                    })}
                    onClick={() => setOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Teacher
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
