"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, BookOpen, FlaskConical, Lock } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import CreateSessionDialog from "@/components/admin/CreateSessionDialog";
import SessionsList from "@/components/admin/SessionsList";

const TeacherNotes = lazy(() => import("@/components/admin/TeacherNotes"));
const CppKnowledge = lazy(() => import("@/components/admin/CppKnowledge"));

const TABS = [
  { id: "sessions", label: "Sessions", icon: FlaskConical },
  { id: "notes", label: "Teacher Notes", icon: BookOpen },
  { id: "knowledge", label: "Hidden Knowledge", icon: Lock },
] as const;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setIsAuthenticated(true);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid password");
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
              <Shield className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <CardTitle>Teacher Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {authError && (
                  <p className="text-sm text-destructive">{authError}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Teacher Dashboard" description="Manage sessions, notes, and teaching resources">
        <CreateSessionDialog />
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 border-b border-border mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === "sessions" && <SessionsList />}
        {activeTab === "notes" && (
          <Suspense fallback={<LoadingSpinner />}>
            <TeacherNotes />
          </Suspense>
        )}
        {activeTab === "knowledge" && (
          <Suspense fallback={<LoadingSpinner />}>
            <CppKnowledge />
          </Suspense>
        )}
      </div>
    </AppShell>
  );
}
