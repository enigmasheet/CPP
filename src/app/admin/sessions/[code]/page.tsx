"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Clock,
} from "lucide-react";
import Link from "next/link";
import QRCode from "@/components/shared/QRCode";
import EditSessionDialog from "@/components/admin/EditSessionDialog";

interface SessionData {
  code: string;
  title: string;
  type: string;
  section?: string;
  isActive: boolean;
  items: { contentType: string; contentId: string }[];
  timeLimit?: number;
  createdAt: string;
}

interface Result {
  studentCode: string;
  name?: string;
  totalScore: number;
  totalPossible: number;
  percentage: number;
  timeTaken?: number;
  completedAt: string;
}

interface Stats {
  totalStudents: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
}

interface QuestionAnalytic {
  totalAttempts: number;
  correctCount: number;
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
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["session-results", code],
    queryFn: () => fetch(`/api/sessions/${code}/results`).then((r) => r.json()),
    refetchInterval: 5000,
  });

  const session = data?.session as SessionData | undefined;
  const results = (data?.results as Result[]) || [];
  const stats = (data?.stats as Stats) || null;
  const questionAnalytics = (data?.questionAnalytics as Record<string, QuestionAnalytic>) || {};

  const toggleMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/sessions/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !session?.isActive }),
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["session-results", code] });
      const previous = queryClient.getQueryData(["session-results", code]);
      queryClient.setQueryData(["session-results", code], (old: typeof data) => ({
        ...old,
        session: { ...old?.session, isActive: !old?.session?.isActive },
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["session-results", code], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session-results", code] });
    },
  });

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
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
                  {session.timeLimit && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.timeLimit} min
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={copyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={session.isActive ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleMutation.mutate()}
                    disabled={toggleMutation.isPending}
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
                {session.isActive && (
                  <Badge variant="outline" className="w-full justify-center mt-2 text-green-600 dark:text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                    Live - Auto-updating
                  </Badge>
                )}
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

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => {
                const headers = ["Name", "Student Code", "Score", "Percentage", "Time (s)", "Completed"];
                const rows = results.map((r) => [
                  r.name || `Student ${r.studentCode}`,
                  r.studentCode,
                  `${r.totalScore}/${r.totalPossible}`,
                  `${r.percentage}%`,
                  r.timeTaken?.toString() || "",
                  new Date(r.completedAt).toLocaleString(),
                ]);
                const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${session?.title || code}-results.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Export CSV
              </Button>
            </div>

            {Object.keys(questionAnalytics).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(questionAnalytics).map(([id, qa]) => {
                      const correctPct = qa.totalAttempts > 0 ? Math.round((qa.correctCount / qa.totalAttempts) * 100) : 0;
                      return (
                        <div key={id} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground w-20 shrink-0 truncate" title={id}>
                            {id.slice(-6)}
                          </span>
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${correctPct >= 70 ? "bg-green-500" : correctPct >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${correctPct}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-medium w-12 text-right">{correctPct}%</span>
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            {qa.correctCount}/{qa.totalAttempts}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
                        <TableHead className="hidden sm:table-cell">Time</TableHead>
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
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell font-mono">
                            {r.timeTaken ? `${Math.floor(r.timeTaken / 60)}:${(r.timeTaken % 60).toString().padStart(2, "0")}` : "—"}
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
      {session && (
        <EditSessionDialog
          session={session}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ["session-results", code] });
          }}
        />
      )}
    </AppShell>
  );
}
