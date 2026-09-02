"use client";

import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Link2, Loader2 } from "lucide-react";
import Link from "next/link";

interface Session {
  _id: string;
  code: string;
  title: string;
  type: string;
  isActive: boolean;
  items: { contentType: string; contentId: string; gameType?: string }[];
  createdAt: string;
}

export default function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const toggleActive = async (code: string, isActive: boolean) => {
    await fetch(`/api/sessions/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setSessions((prev) =>
      prev.map((s) => (s.code === code ? { ...s, isActive: !isActive } : s))
    );
  };

  if (loading) {
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
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session._id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="font-mono text-lg font-bold tracking-wider">
                  {session.code}
                </div>
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.items.length} items
                    <span className="mx-2">-</span>
                    {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={session.isActive ? "default" : "secondary"}>
                  {session.isActive ? "Active" : "Closed"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(session.code, session.isActive)}
                >
                  {session.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Link
                  href={`/admin/sessions/${session.code}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <Link2 className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
