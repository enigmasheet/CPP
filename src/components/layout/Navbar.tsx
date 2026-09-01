"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BookOpen, FlaskConical, LogIn, Shield } from "lucide-react";

const navLinks = [
  { href: "/subjects/cpp", label: "Learn", icon: BookOpen },
  { href: "/subjects/cpp/mcq", label: "Quizzes", icon: FlaskConical },
  { href: "/join", label: "Join Session", icon: LogIn },
  { href: "/admin", label: "Teacher", icon: Shield },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <FlaskConical className="w-5 h-5" />
          <span>C++ Master</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={buttonVariants({
                  variant: isActive ? "secondary" : "ghost",
                  size: "sm",
                })}
              >
                <Icon className="w-4 h-4 mr-2" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={buttonVariants({
                      variant: isActive ? "secondary" : "ghost",
                    })}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
