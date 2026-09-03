"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SessionData {
  code: string;
  title: string;
  section?: string;
  timeLimit?: number;
  isActive: boolean;
}

export default function EditSessionDialog({
  session,
  open,
  onOpenChange,
  onUpdated,
}: {
  session: SessionData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}) {
  const [title, setTitle] = useState(session.title);
  const [section, setSection] = useState(session.section || "");
  const [timeLimit, setTimeLimit] = useState(session.timeLimit?.toString() || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/sessions/${session.code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || undefined,
        section: section.trim() || undefined,
        timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      onOpenChange(false);
      onUpdated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Title</label>
            <Input
              placeholder="Session title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Class Section</label>
            <Input
              placeholder="e.g. CS101 - Section A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Limit (minutes)</label>
            <Input
              type="number"
              placeholder="No time limit"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
