"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Users, ClipboardList, TrendingUp } from "lucide-react";
import { useSessions } from "@/hooks/queries/useSessions";
import { useAuditLogs } from "@/hooks/queries/useAuditLogs";
import { useClasses } from "@/hooks/queries/useClasses";
import { OVERVIEW_RECENT_SESSIONS_LIMIT, MAX_SCORE_PERCENTAGE, OVERVIEW_STATS_SKELETON_COUNT, PASS_THRESHOLD_RATIO, OVERVIEW_WEEK_MS } from "@/lib/constants";

export default function DashboardOverview() {
  const { data: sessions = [], isLoading: sessionsLoading } = useSessions();
  const { data: auditLogs = [] } = useAuditLogs();
  const { data: classes = [] } = useClasses();

  const stats = useMemo(() => {
    const activeSessions = sessions.filter((s) => s.isActive);
    const totalSubmissions = sessions.reduce((sum, s) => sum + s.submissions, 0);
    const sessionsWithScores = sessions.filter((s) => s.avgScore !== null);
    const avgScore =
      sessionsWithScores.length > 0
        ? Math.round(
            sessionsWithScores.reduce((sum, s) => sum + (s.avgScore ?? 0), 0) /
              sessionsWithScores.length
          )
        : 0;
    const recentSessions = sessions.slice(0, OVERVIEW_RECENT_SESSIONS_LIMIT);

    return { activeSessions, totalSubmissions, avgScore, recentSessions };
  }, [sessions]);

  if (sessionsLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(OVERVIEW_STATS_SKELETON_COUNT)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-4 text-center">
              <div className="h-6 w-6 mx-auto bg-muted rounded animate-pulse mb-1" />
              <div className="h-8 w-16 mx-auto bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <FlaskConical className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{stats.activeSessions.length}</p>
            <p className="text-xs text-muted-foreground">Active Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <ClipboardList className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
            <p className="text-xs text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold">{stats.avgScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Session Score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No sessions yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-2 rounded-lg border border-border"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={session.isActive ? "default" : "secondary"} className="text-[10px]">
                          {session.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {session.submissions} submissions
                        </span>
                      </div>
                    </div>
                    {session.avgScore !== null && (
                      <Badge
                        variant="outline"
                        className={
                          session.avgScore >= MAX_SCORE_PERCENTAGE * PASS_THRESHOLD_RATIO
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {session.avgScore}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Classes</span>
              <span className="text-sm font-medium">{classes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Audit Log Entries</span>
              <span className="text-sm font-medium">{auditLogs.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sessions This Week</span>
              <span className="text-sm font-medium">
                {sessions.filter((s) => {
                  const created = new Date(s.createdAt);
                  const now = new Date();
                  const weekAgo = new Date(now.getTime() - OVERVIEW_WEEK_MS);
                  return created >= weekAgo;
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Session Items</span>
              <span className="text-sm font-medium">
                {sessions.reduce((sum, s) => sum + s.items.length, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
