"use client";

import { useState } from "react";
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
  CheckCircle,
  Clock,
  Circle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { SUBJECTS } from "@/config/subjects";
import { PLAN_STATUS_TRANSITIONS } from "@/lib/constants";
import { useTeachingPlans, useCreatePlan, useUpdatePlan, useDeletePlan } from "@/hooks/queries";
import type { TeachingPlanData } from "@/lib/types";

const TOPICS = SUBJECTS.cpp?.topics.map((t) => ({ slug: t.slug, name: t.name })) || [];

const STATUS_CONFIG = {
  todo: { label: "To Do", icon: Circle, color: "text-muted-foreground" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-blue-500" },
  done: { label: "Done", icon: CheckCircle, color: "text-green-500" },
  skipped: { label: "Skipped", icon: Circle, color: "text-destructive" },
} as const;

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

export default function TeachingPlanTab() {
  const { data: plans = [], isLoading } = useTeachingPlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [formPriority, setFormPriority] = useState<TeachingPlanData["priority"]>("medium");
  const [formStatus, setFormStatus] = useState<TeachingPlanData["status"]>("todo");
  const [formNotes, setFormNotes] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormDate("");
    setFormTopics([]);
    setFormPriority("medium");
    setFormStatus("todo");
    setFormNotes("");
  };

  const openEdit = (plan: TeachingPlanData) => {
    setEditingId(plan._id);
    setFormTitle(plan.title);
    setFormDesc(plan.description || "");
    setFormDate(plan.targetDate ? plan.targetDate.split("T")[0] : "");
    setFormTopics(plan.topics);
    setFormPriority(plan.priority);
    setFormStatus(plan.status);
    setFormNotes(plan.notes || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const body = {
      title: formTitle,
      description: formDesc || undefined,
      targetDate: formDate ? new Date(formDate) : undefined,
      topics: formTopics,
      priority: formPriority,
      status: formStatus,
      notes: formNotes || undefined,
    };

    try {
      if (editingId) {
        await updatePlan.mutateAsync({ id: editingId, ...body });
        toast.success("Plan updated");
      } else {
        await createPlan.mutateAsync(body);
        toast.success("Plan created");
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save plan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlan.mutateAsync(id);
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  const advanceStatus = async (plan: TeachingPlanData) => {
    const next = PLAN_STATUS_TRANSITIONS[plan.status];
    if (!next) return;
    try {
      await updatePlan.mutateAsync({ id: plan._id, status: next });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleTopic = (slug: string) => {
    setFormTopics((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  };

  const grouped = {
    todo: plans.filter((p) => p.status === "todo"),
    in_progress: plans.filter((p) => p.status === "in_progress"),
    done: plans.filter((p) => p.status === "done"),
    skipped: plans.filter((p) => p.status === "skipped"),
  };

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
        <h2 className="text-xl font-bold">Teaching Plan</h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Plan" : "New Teaching Plan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="e.g. Week 4 - OOP Concepts" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Optional description" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Target Date</label>
                  <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={formPriority} onValueChange={(v) => setFormPriority(v as TeachingPlanData["priority"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as TeachingPlanData["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Topics</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {TOPICS.map((t) => (
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
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-20"
                  placeholder="Additional notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} disabled={!formTitle || createPlan.isPending || updatePlan.isPending} className="w-full">
                {(createPlan.isPending || updatePlan.isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingId ? "Update" : "Create Plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No plans yet. Create one to start planning.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {(["todo", "in_progress", "done"] as const).map((status) => {
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                  <h3 className="font-medium text-sm">{cfg.label}</h3>
                  <Badge variant="secondary" className="text-xs">{grouped[status].length}</Badge>
                </div>
                {grouped[status].length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No items</p>
                ) : (
                  grouped[status].map((plan) => (
                    <Card key={plan._id} className="cursor-pointer hover:border-primary/50 transition-colors">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{plan.title}</p>
                            {plan.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{plan.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLORS[plan.priority]}`}>
                                {plan.priority}
                              </span>
                              {plan.targetDate && (
                                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(plan.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              )}
                            </div>
                            {plan.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {plan.topics.map((t) => (
                                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            {PLAN_STATUS_TRANSITIONS[plan.status] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5"
                                onClick={() => advanceStatus(plan)}
                                disabled={updatePlan.isPending}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={() => openEdit(plan)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-1.5" onClick={() => handleDelete(plan._id)}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
