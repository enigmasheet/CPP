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
  Plus,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Loader2,
  ArrowLeft,
  BookOpen,
  School,
} from "lucide-react";
import { toast } from "sonner";

interface ClassData {
  _id: string;
  name: string;
  subject: string;
  description?: string;
  semester?: string;
  isActive: boolean;
  createdAt: string;
}

interface ClassEntryData {
  _id: string;
  classId: string;
  date: string;
  topics: string[];
  sessionCode?: string;
  duration?: number;
  notes?: string;
  createdAt: string;
}

const TOPICS = [
  { slug: "basics", name: "Basics" },
  { slug: "control-flow", name: "Control Flow" },
  { slug: "functions", name: "Functions" },
  { slug: "arrays-strings", name: "Arrays & Strings" },
  { slug: "pointers-references", name: "Pointers & References" },
  { slug: "structures", name: "Structures" },
  { slug: "oop", name: "OOP" },
  { slug: "file-handling", name: "File Handling" },
  { slug: "stl", name: "STL" },
  { slug: "memory-management", name: "Memory Management" },
  { slug: "templates", name: "Templates" },
  { slug: "modern-cpp", name: "Modern C++" },
  { slug: "best-practices", name: "Best Practices" },
  { slug: "practice", name: "Practice & Projects" },
];

export default function ClassesManager() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [entries, setEntries] = useState<ClassEntryData[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [saving, setSaving] = useState(false);

  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ClassEntryData | null>(null);
  const [entryDate, setEntryDate] = useState("");
  const [entryTopics, setEntryTopics] = useState<string[]>([]);
  const [entrySession, setEntrySession] = useState("");
  const [entryDuration, setEntryDuration] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [savingEntry, setSavingEntry] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setClasses(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load classes");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    let cancelled = false;
    setEntriesLoading(true);
    fetch(`/api/classes/${selectedClassId}/entries`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setEntries(Array.isArray(data) ? data : []);
          setEntriesLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load entries");
          setEntriesLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [selectedClassId]);

  const selectedClass = classes.find((c) => c._id === selectedClassId);

  const resetForm = () => {
    setEditingClass(null);
    setFormName("");
    setFormDesc("");
    setFormSemester("");
  };

  const resetEntryForm = () => {
    setEditingEntry(null);
    setEntryDate("");
    setEntryTopics([]);
    setEntrySession("");
    setEntryDuration("");
    setEntryNotes("");
  };

  const handleSaveClass = async () => {
    setSaving(true);
    const body = {
      name: formName,
      subject: "cpp",
      description: formDesc || undefined,
      semester: formSemester || undefined,
    };

    try {
      const url = editingClass ? `/api/classes/${editingClass._id}` : "/api/classes";
      const method = editingClass ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save class");
        setSaving(false);
        return;
      }
      toast.success(editingClass ? "Class updated" : "Class created");
      setDialogOpen(false);
      resetForm();
      fetchClasses();
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  };

  const handleDeleteClass = async (id: string) => {
    const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Class deleted");
      if (selectedClassId === id) {
        setSelectedClassId(null);
        setEntries([]);
      }
      fetchClasses();
    }
  };

  const handleSaveEntry = async () => {
    if (!selectedClassId) return;
    setSavingEntry(true);
    const body = {
      date: entryDate,
      topics: entryTopics,
      sessionCode: entrySession || undefined,
      duration: entryDuration ? Number(entryDuration) : undefined,
      notes: entryNotes || undefined,
    };

    try {
      const url = editingEntry
        ? `/api/classes/${selectedClassId}/entries/${editingEntry._id}`
        : `/api/classes/${selectedClassId}/entries`;
      const method = editingEntry ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save entry");
        setSavingEntry(false);
        return;
      }
      toast.success(editingEntry ? "Entry updated" : "Entry added");
      setEntryDialogOpen(false);
      resetEntryForm();
      fetchEntries(selectedClassId);
    } catch {
      toast.error("Network error");
    }
    setSavingEntry(false);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!selectedClassId) return;
    const res = await fetch(`/api/classes/${selectedClassId}/entries/${entryId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Entry deleted");
      fetchEntries(selectedClassId);
    }
  };

  const openEditClass = (cls: ClassData) => {
    setEditingClass(cls);
    setFormName(cls.name);
    setFormDesc(cls.description || "");
    setFormSemester(cls.semester || "");
    setDialogOpen(true);
  };

  const openEditEntry = (entry: ClassEntryData) => {
    setEditingEntry(entry);
    setEntryDate(entry.date ? new Date(entry.date).toISOString().split("T")[0] : "");
    setEntryTopics(entry.topics);
    setEntrySession(entry.sessionCode || "");
    setEntryDuration(entry.duration?.toString() || "");
    setEntryNotes(entry.notes || "");
    setEntryDialogOpen(true);
  };

  const toggleTopic = (slug: string) => {
    setEntryTopics((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }

  if (selectedClass && selectedClassId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedClassId(null); setEntries([]); }}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-xl font-bold">{selectedClass.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {selectedClass.semester && <Badge variant="secondary">{selectedClass.semester}</Badge>}
                {selectedClass.description && <span className="text-sm text-muted-foreground">{selectedClass.description}</span>}
              </div>
            </div>
          </div>
          <Dialog open={entryDialogOpen} onOpenChange={(o) => { setEntryDialogOpen(o); if (!o) resetEntryForm(); }}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Log Teaching
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEntry ? "Edit Entry" : "Log Teaching Session"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Topics Covered</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {TOPICS.map((t) => (
                      <button
                        key={t.slug}
                        onClick={() => toggleTopic(t.slug)}
                        className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                          entryTopics.includes(t.slug)
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
                    <label className="text-sm font-medium">Session Code (optional)</label>
                    <Input placeholder="ABC123" value={entrySession} onChange={(e) => setEntrySession(e.target.value.toUpperCase())} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (min)</label>
                    <Input type="number" placeholder="60" value={entryDuration} onChange={(e) => setEntryDuration(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[60px]"
                    placeholder="What was covered, homework assigned..."
                    value={entryNotes}
                    onChange={(e) => setEntryNotes(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveEntry} disabled={!entryDate || entryTopics.length === 0 || savingEntry} className="w-full">
                  {savingEntry ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingEntry ? "Update" : "Add Entry"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {entriesLoading ? (
          <div className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No teaching entries yet. Log your first session!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry._id}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {entry.duration && (
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {entry.duration}m
                          </span>
                        )}
                        {entry.sessionCode && (
                          <Badge variant="secondary" className="text-[10px] font-mono">{entry.sessionCode}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.topics.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                      {entry.notes && <p className="text-xs text-muted-foreground mt-1.5">{entry.notes}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 px-1.5" onClick={() => openEditEntry(entry)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-1.5" onClick={() => handleDeleteEntry(entry._id)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Classes</h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Class
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingClass ? "Edit Class" : "New Class"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Class Name</label>
                <Input placeholder="e.g. CS101 - Section A" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Optional description" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Semester</label>
                <Input placeholder="e.g. Fall 2026" value={formSemester} onChange={(e) => setFormSemester(e.target.value)} />
              </div>
              <Button onClick={handleSaveClass} disabled={!formName || saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingClass ? "Update" : "Create Class"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <School className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No classes yet. Create one to start tracking!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Card key={cls._id} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => setSelectedClassId(cls._id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <School className="w-4 h-4 text-muted-foreground shrink-0" />
                      <p className="font-medium text-sm truncate">{cls.name}</p>
                    </div>
                    {cls.description && (
                      <p className="text-xs text-muted-foreground truncate ml-6">{cls.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      {cls.semester && <Badge variant="secondary" className="text-[10px]">{cls.semester}</Badge>}
                      <span className="text-[10px] text-muted-foreground">
                        Created {new Date(cls.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={() => openEditClass(cls)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={() => handleDeleteClass(cls._id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
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
