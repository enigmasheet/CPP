"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { SUBJECTS } from "@/config/subjects";

interface AuditLogEntry {
  _id: string;
  date: string;
  sessionCode?: string;
  section?: string;
  topicsCovered: string[];
  mcqsUsed: number;
  studentCount: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  duration?: number;
  notes?: string;
  status: "planned" | "completed" | "skipped";
}

const TOPICS = SUBJECTS.cpp?.topics.map((t) => t.slug) || [];

export default function AuditLogTab() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formDate, setFormDate] = useState("");
  const [formSection, setFormSection] = useState("");
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [formMcqs, setFormMcqs] = useState(0);
  const [formStudents, setFormStudents] = useState(0);
  const [formAvg, setFormAvg] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<"planned" | "completed" | "skipped">("completed");

  const fetchLogs = () => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((data) => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchLogs(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormDate("");
    setFormSection("");
    setFormTopics([]);
    setFormMcqs(0);
    setFormStudents(0);
    setFormAvg("");
    setFormDuration("");
    setFormNotes("");
    setFormStatus("completed");
  };

  const openEdit = (log: AuditLogEntry) => {
    setEditingId(log._id);
    setFormDate(log.date.split("T")[0]);
    setFormSection(log.section || "");
    setFormTopics(log.topicsCovered);
    setFormMcqs(log.mcqsUsed);
    setFormStudents(log.studentCount);
    setFormAvg(log.averageScore?.toString() || "");
    setFormDuration(log.duration?.toString() || "");
    setFormNotes(log.notes || "");
    setFormStatus(log.status);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body = {
      date: formDate ? new Date(formDate) : new Date(),
      section: formSection || undefined,
      topicsCovered: formTopics,
      mcqsUsed: formMcqs,
      studentCount: formStudents,
      averageScore: formAvg ? Number(formAvg) : undefined,
      duration: formDuration ? Number(formDuration) : undefined,
      notes: formNotes || undefined,
      status: formStatus,
    };

    const url = editingId ? `/api/audit/${editingId}` : "/api/audit";
    const method = editingId ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setDialogOpen(false);
    resetForm();
    fetchLogs();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/audit/${id}`, { method: "DELETE" });
    fetchLogs();
  };

  const toggleTopic = (slug: string) => {
    setFormTopics((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const totalStudents = logs.reduce((sum, l) => sum + l.studentCount, 0);
  const totalClasses = logs.filter((l) => l.status === "completed").length;
  const avgAll = logs.filter((l) => l.averageScore != null);
  const overallAvg = avgAll.length
    ? Math.round(avgAll.reduce((s, l) => s + (l.averageScore || 0), 0) / avgAll.length)
    : 0;

  if (loading) {
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
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as typeof formStatus)}>
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
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTopic(t)}
                      className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                        formTopics.includes(t)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
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
                  <Input type="number" min={0} value={formDuration} onChange={(e) => setFormDuration(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="What was taught, any observations..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
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

      {logs.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No audit entries yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
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
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{log.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(log)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(log._id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
