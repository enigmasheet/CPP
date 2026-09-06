"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { SUBJECTS, getAllSubjectSlugs, getTopics } from "@/config/subjects";
import { useAuditLogs, useCreateAuditLog, useUpdateAuditLog, useDeleteAuditLog } from "@/hooks/queries";
import { AUDIT_STATUSES, AUDIT_PAGE_SIZE, MAX_AUDIT_NOTES_LENGTH } from "@/lib/constants";
import type { AuditLogData } from "@/lib/types";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const ALL_TOPICS = getAllSubjectSlugs().flatMap((slug) =>
  getTopics(slug).map((t) => ({ slug: t.slug, name: t.name, subject: SUBJECTS[slug]?.name ?? slug }))
);

export default function AuditLogTab() {
  const { data: logs = [], isLoading } = useAuditLogs();
  const createLog = useCreateAuditLog();
  const updateLog = useUpdateAuditLog();
  const deleteLog = useDeleteAuditLog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AuditLogData | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [formDate, setFormDate] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [formMcqs, setFormMcqs] = useState(0);
  const [formStudents, setFormStudents] = useState(0);
  const [formAvg, setFormAvg] = useState("");
  const [formHigh, setFormHigh] = useState("");
  const [formLow, setFormLow] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<AuditLogData["status"]>("completed");

  const resetForm = () => {
    setEditingId(null);
    setFormDate("");
    setFormSection("");
    setFormTopics([]);
    setFormMcqs(0);
    setFormStudents(0);
    setFormAvg("");
    setFormHigh("");
    setFormLow("");
    setFormDuration("");
    setFormNotes("");
    setFormStatus("completed");
  };

  const openEdit = (log: AuditLogData) => {
    setEditingId(log._id);
    setFormDate(log.date.split("T")[0]);
    setFormSection(log.section || "");
    setFormTopics(log.topicsCovered);
    setFormMcqs(log.mcqsUsed);
    setFormStudents(log.studentCount);
    setFormAvg(log.averageScore?.toString() || "");
    setFormHigh(log.highestScore?.toString() || "");
    setFormLow(log.lowestScore?.toString() || "");
    setFormDuration(log.duration?.toString() || "");
    setFormNotes(log.notes || "");
    setFormStatus(log.status);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body = {
      date: formDate ? new Date(formDate).toISOString() : new Date().toISOString(),
      section: formSection || undefined,
      topicsCovered: formTopics,
      mcqsUsed: formMcqs,
      studentCount: formStudents,
      averageScore: formAvg ? Number(formAvg) : undefined,
      highestScore: formHigh ? Number(formHigh) : undefined,
      lowestScore: formLow ? Number(formLow) : undefined,
      duration: formDuration ? Number(formDuration) : undefined,
      notes: formNotes || undefined,
      status: formStatus,
    };

    try {
      if (editingId) {
        await updateLog.mutateAsync({ id: editingId, ...body });
        toast.success("Entry updated");
      } else {
        await createLog.mutateAsync(body);
        toast.success("Entry created");
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save entry");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLog.mutateAsync(deleteTarget._id);
      toast.success("Entry deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  const toggleTopic = (slug: string) => {
    setFormTopics((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const filtered = useMemo(() => {
    if (statusFilter === "all") return logs;
    return logs.filter((l) => l.status === statusFilter);
  }, [logs, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / AUDIT_PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * AUDIT_PAGE_SIZE, currentPage * AUDIT_PAGE_SIZE);

  const totalStudents = logs.reduce((sum, l) => sum + l.studentCount, 0);
  const totalClasses = logs.filter((l) => l.status === "completed").length;
  const avgAll = logs.filter((l) => l.averageScore != null);
  const overallAvg = avgAll.length
    ? Math.round(avgAll.reduce((s, l) => s + (l.averageScore || 0), 0) / avgAll.length)
    : 0;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Teaching Audit Log</h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Entry" : "Add Audit Entry"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Class Section</label>
                <Input placeholder="e.g. CS101 - Section A" value={formSection} onChange={(e) => setFormSection(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as AuditLogData["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Topics Covered</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ALL_TOPICS.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => toggleTopic(t.slug)}
                      className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                        formTopics.includes(t.slug)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">MCQs Used</label>
                  <Input type="number" min={0} value={formMcqs} onChange={(e) => setFormMcqs(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Students</label>
                  <Input type="number" min={0} value={formStudents} onChange={(e) => setFormStudents(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Avg Score %</label>
                  <Input type="number" min={0} max={100} value={formAvg} onChange={(e) => setFormAvg(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (min)</label>
                  <Input type="number" min={0} max={480} value={formDuration} onChange={(e) => setFormDuration(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Highest Score %</label>
                  <Input type="number" min={0} max={100} value={formHigh} onChange={(e) => setFormHigh(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Lowest Score %</label>
                  <Input type="number" min={0} max={100} value={formLow} onChange={(e) => setFormLow(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="What was taught, any observations..."
                  maxLength={MAX_AUDIT_NOTES_LENGTH}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">{formNotes.length}/{MAX_AUDIT_NOTES_LENGTH}</p>
              </div>
              <Button onClick={handleSave} disabled={createLog.isPending || updateLog.isPending} className="w-full">
                {(createLog.isPending || updateLog.isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingId ? "Update" : "Save Entry"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Classes Taught</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Students Reached</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{overallAvg}%</div>
            <p className="text-xs text-muted-foreground">Overall Average</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setCurrentPage(1); } }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {AUDIT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          {logs.length === 0 ? "No audit entries yet." : "No entries match this filter."}
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((log) => (
              <Card key={log._id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {new Date(log.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        {log.section && <Badge variant="outline">{log.section}</Badge>}
                        <Badge variant={log.status === "completed" ? "default" : log.status === "planned" ? "secondary" : "destructive"}>
                          {log.status}
                        </Badge>
                        {log.sessionCode && (
                          <Link
                            href={`/admin/sessions/${log.sessionCode}`}
                            className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Badge variant="outline" className="font-mono text-[10px]">{log.sessionCode}</Badge>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        {log.duration && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {log.duration}m
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {log.topicsCovered.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{log.studentCount} students</span>
                        <span>{log.mcqsUsed} MCQs</span>
                        {log.averageScore != null && <span>Avg: {log.averageScore}%</span>}
                        {log.highestScore != null && <span>High: {log.highestScore}%</span>}
                        {log.lowestScore != null && <span>Low: {log.lowestScore}%</span>}
                      </div>
                      {log.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(log)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(log)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        title="Delete Audit Entry"
        description={`Are you sure you want to delete the entry from ${deleteTarget ? new Date(deleteTarget.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLog.isPending}
      />
    </div>
  );
}
