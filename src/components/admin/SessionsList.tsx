"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Link2, Loader2, Trash2, Users, BarChart } from "lucide-react";
import Link from "next/link";

interface Session {
  _id: string;
  code: string;
  title: string;
  type: string;
  isActive: boolean;
  items: { contentType: string; contentId: string; gameType?: string }[];
  createdAt: string;
  submissions?: number;
  avgScore?: number | null;
}

export default function SessionsList() {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: () => fetch("/api/sessions").then((r) => r.json()),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ code, isActive }: { code: string; isActive: boolean }) =>
      fetch(`/api/sessions/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      }),
    onMutate: async ({ code, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        old?.map((s) => (s.code === code ? { ...s, isActive: !isActive } : s))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sessions"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) =>
      fetch(`/api/sessions/${code}`, { method: "DELETE" }),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: ["sessions"] });
      const previous = queryClient.getQueryData<Session[]>(["sessions"]);
      queryClient.setQueryData<Session[]>(["sessions"], (old) =>
        old?.filter((s) => s.code !== code)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sessions"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onSuccess: () => {
      setDeleteTarget(null);
      setDeleting(null);
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Card key={session._id}>
          <CardContent className="py-4 px-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="font-mono text-base sm:text-lg font-bold tracking-wider shrink-0">
                  {session.code}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{session.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {session.items.length} items
                    <span className="mx-1.5">-</span>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {session.submissions ?? 0} submissions
                    </span>
                    {session.avgScore !== null && session.avgScore !== undefined && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BarChart className="w-3 h-3" />
                        Avg: {session.avgScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Badge
                  variant={session.isActive ? "default" : "secondary"}
                  className="hidden sm:inline-flex"
                >
                  {session.isActive ? "Active" : "Closed"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleMutation.mutate({ code: session.code, isActive: session.isActive })}
                  disabled={toggleMutation.isPending}
                  title={session.isActive ? "Close session" : "Open session"}
                  aria-label={session.isActive ? "Close session" : "Open session"}
                >
                  {session.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Link
                  href={`/admin/sessions/${session.code}`}
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  title="View session"
                  aria-label="View session"
                >
                  <Link2 className="w-4 h-4" />
                </Link>
                <Dialog
                  open={deleteTarget?.code === session.code}
                  onOpenChange={(open) => !open && setDeleteTarget(null)}
                >
                  <DialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete session"
                      />
                    }
                    onClick={() => setDeleteTarget(session)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Delete Session</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete session{" "}
                      <span className="font-mono font-bold">{session.code}</span> -{" "}
                      <span className="font-medium">{session.title}</span>?
                      This action cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteTarget(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (deleteTarget) {
                            setDeleting(deleteTarget.code);
                            deleteMutation.mutate(deleteTarget.code);
                          }
                        }}
                        disabled={deleting === session.code}
                      >
                        {deleting === session.code ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
