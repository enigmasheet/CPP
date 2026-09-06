"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2, Clock, X } from "lucide-react";
import { SESSION_CODE_LENGTH, JOIN_RECENT_SESSIONS_KEY, MAX_RECENT_SESSIONS } from "@/lib/constants";

interface RecentSession {
  code: string;
  joinedAt: number;
}

function getRecentSessions(): RecentSession[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(JOIN_RECENT_SESSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSession(code: string) {
  const recent = getRecentSessions().filter((r) => r.code !== code);
  recent.unshift({ code, joinedAt: Date.now() });
  localStorage.setItem(
    JOIN_RECENT_SESSIONS_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT_SESSIONS))
  );
}

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  useEffect(() => {
    setRecentSessions(getRecentSessions());
  }, []);

  const handleJoin = async (sessionCode: string) => {
    const trimmed = sessionCode.trim().toUpperCase();
    if (trimmed.length !== SESSION_CODE_LENGTH) {
      setError("Code must be 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/sessions/${trimmed}`);
      if (res.ok) {
        saveRecentSession(trimmed);
        router.push(`/s/${trimmed}`);
      } else {
        setError("Session not found or inactive");
      }
    } catch {
      setError("Failed to connect");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin(code);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, SESSION_CODE_LENGTH);
    if (pasted.length === SESSION_CODE_LENGTH) {
      e.preventDefault();
      setCode(pasted);
      handleJoin(pasted);
    }
  };

  const removeRecent = (removeCode: string) => {
    const updated = getRecentSessions().filter((r) => r.code !== removeCode);
    localStorage.setItem(JOIN_RECENT_SESSIONS_KEY, JSON.stringify(updated));
    setRecentSessions(updated);
  };

  return (
    <AppShell>
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <Card className="max-w-sm w-full">
          <CardHeader className="text-center">
            <LogIn className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle>Join Session</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the 6-character code from your teacher
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().slice(0, SESSION_CODE_LENGTH));
                  setError("");
                }}
                onPaste={handlePaste}
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={SESSION_CODE_LENGTH}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={code.length !== SESSION_CODE_LENGTH || loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Join"
                )}
              </Button>
            </form>

            {recentSessions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent Sessions
                </p>
                <div className="space-y-1.5">
                  {recentSessions.map((r) => (
                    <div key={r.code} className="flex items-center gap-2">
                      <button
                        onClick={() => handleJoin(r.code)}
                        className="flex-1 text-left px-3 py-1.5 rounded-md text-sm font-mono hover:bg-muted transition-colors"
                        disabled={loading}
                      >
                        {r.code}
                      </button>
                      <button
                        onClick={() => removeRecent(r.code)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Remove ${r.code} from recents`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
