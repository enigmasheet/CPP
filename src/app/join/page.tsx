"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogIn, Loader2 } from "lucide-react";
import { SESSION_CODE_LENGTH } from "@/lib/constants";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== SESSION_CODE_LENGTH) {
      setError("Code must be 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/sessions/${trimmed}`);
      if (res.ok) {
        router.push(`/s/${trimmed}`);
      } else {
        setError("Session not found or inactive");
      }
    } catch {
      setError("Failed to connect");
    }
    setLoading(false);
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
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().slice(0, SESSION_CODE_LENGTH));
                  setError("");
                }}
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
