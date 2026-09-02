import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLogDoc extends Document {
  date: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDoc>(
  {
    date: { type: Date, required: true },
    sessionCode: { type: String },
    section: { type: String },
    topicsCovered: { type: [String], default: [] },
    mcqsUsed: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    averageScore: { type: Number },
    highestScore: { type: Number },
    lowestScore: { type: Number },
    duration: { type: Number },
    notes: { type: String },
    status: { type: String, enum: ["planned", "completed", "skipped"], default: "completed" },
  },
  { timestamps: true }
);

AuditLogSchema.index({ date: -1 });
AuditLogSchema.index({ section: 1 });
AuditLogSchema.index({ status: 1 });

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLogDoc>("AuditLog", AuditLogSchema);
