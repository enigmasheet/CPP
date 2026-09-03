"use client";

import { useState, lazy, Suspense } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, BookOpen, FlaskConical, Lock, ClipboardList, CalendarCheck, LogOut, HelpCircle } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import CreateSessionDialog from "@/components/admin/CreateSessionDialog";
import SessionsList from "@/components/admin/SessionsList";

const TeacherNotes = lazy(() => import("@/components/admin/TeacherNotes"));
const CppKnowledge = lazy(() => import("@/components/admin/CppKnowledge"));
const AuditLogTab = lazy(() => import("@/components/admin/AuditLog"));
const TeachingPlanTab = lazy(() => import("@/components/admin/TeachingPlan"));
const MCQManagementTab = lazy(() => import("@/components/admin/MCQManagement"));

const TABS = [
  { id: "sessions", label: "Sessions", icon: FlaskConical },
  { id: "mcqs", label: "MCQs", icon: HelpCircle },
  { id: "audit", label: "Audit Log", icon: ClipboardList },
  { id: "plans", label: "Teaching Plan", icon: CalendarCheck },
  { id: "notes", label: "Teacher Notes", icon: BookOpen },
  { id: "knowledge", label: "Hidden Knowledge", icon: Lock },
] as const;

export default function AdminPage() {
  const { data: authData, isLoading: authLoading } = useAdminAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  const authed = authData?.authenticated ?? isAuthenticated;

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

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPassword("");
  };

  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!authed) {
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
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
        {activeTab === "mcqs" && (
          <Suspense fallback={<LoadingSpinner />}>
            <MCQManagementTab />
          </Suspense>
        )}
        {activeTab === "audit" && (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditLogTab />
          </Suspense>
        )}
        {activeTab === "plans" && (
          <Suspense fallback={<LoadingSpinner />}>
            <TeachingPlanTab />
          </Suspense>
        )}
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
