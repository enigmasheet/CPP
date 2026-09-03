"use client";

import { useState, useEffect, use } from "react";
import AppShell from "@/components/layout/AppShell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Users,
  BarChart3,
  Trophy,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import QRCode from "@/components/shared/QRCode";

interface SessionData {
  code: string;
  title: string;
  type: string;
  isActive: boolean;
  section?: string;
  items: { contentType: string; contentId: string; gameType?: string }[];
  createdAt: string;
}

interface Result {
  studentCode: string;
  name?: string;
  totalScore: number;
  totalPossible: number;
  percentage: number;
  completedAt: string;
}

interface Stats {
  totalStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
}

const STUDENT_NAMES = [
  "Student A", "Student B", "Student C", "Student D", "Student E",
  "Student F", "Student G", "Student H", "Student I", "Student J",
  "Student K", "Student L", "Student M", "Student N", "Student O",
];

function getStudentName(result: Result, index: number): string {
  if (result.name && result.name.trim()) {
    return result.name;
  }
  return STUDENT_NAMES[index % STUDENT_NAMES.length];
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [session, setSession] = useState<SessionData | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/sessions/${code}/results`)
      .then((r) => r.json())
      .then((data) => {
        setSession(data.session);
        setResults(data.results);
        setStats(data.stats);
        setLoading(false);
      });
  }, [code]);

  const toggleActive = async () => {
    if (!session) return;
    await fetch(`/api/sessions/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !session.isActive }),
    });
    setSession((prev) =>
      prev ? { ...prev, isActive: !prev.isActive } : null
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!session) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Session not found</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Join Code
                  </p>
                  <div className="text-3xl font-mono font-bold tracking-widest">
                    {code}
                  </div>
                </div>

                <div className="text-center">
                  <QRCode
                    url={`${typeof window !== "undefined" ? window.location.origin : ""}/s/${code}`}
                    size={180}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p className="truncate font-medium text-foreground">{session.title}</p>
                  {session.section && (
                    <p className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {session.section}
                      </Badge>
                    </p>
                  )}
                  <p className="mt-1">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    {session.items?.length || 0} items
                  </span>
                  <span>
                    {session.items?.filter((i) => i.contentType === "mcq").length || 0} MCQs
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={copyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button
                    variant={session.isActive ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={toggleActive}
                  >
                    {session.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Close
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Reopen
                      </>
                    )}
                  </Button>
                </div>

                <Badge
                  variant={session.isActive ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {session.isActive ? "Active - Accepting Responses" : "Closed"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {stats && (
              <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{stats.averagePercentage}%</div>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-2xl font-bold">{stats.highestPercentage}%</div>
                    <p className="text-xs text-muted-foreground">Highest</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Student Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No submissions yet. Waiting for students to complete...
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead className="hidden sm:table-cell">Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, idx) => (
                        <TableRow key={r.studentCode}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{getStudentName(r, idx)}</span>
                              <span className="block text-xs text-muted-foreground font-mono">{r.studentCode}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {r.totalScore}/{r.totalPossible}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                r.percentage >= 70
                                  ? "default"
                                  : r.percentage >= 50
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {r.percentage}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {new Date(r.completedAt).toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
