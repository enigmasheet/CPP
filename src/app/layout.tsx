import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMS | Interactive Learning Platform",
  description:
    "Interactive quizzes, games, code playground, and gamified learning for bachelor students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
