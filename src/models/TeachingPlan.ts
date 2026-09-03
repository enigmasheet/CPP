import mongoose, { Schema, type Document } from "mongoose";

export interface ITeachingPlanDoc extends Document {
  title: string;
  description?: string;
  targetDate?: Date;
  topics: string[];
  status: "todo" | "in_progress" | "done" | "skipped";
  priority: "low" | "medium" | "high";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeachingPlanSchema = new Schema<ITeachingPlanDoc>(
  {
    title: { type: String, required: true },
    description: { type: String },
    targetDate: { type: Date },
    topics: { type: [String], default: [] },
    status: { type: String, enum: ["todo", "in_progress", "done", "skipped"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    notes: { type: String },
  },
  { timestamps: true }
);

TeachingPlanSchema.index({ status: 1 });
TeachingPlanSchema.index({ targetDate: 1 });
TeachingPlanSchema.index({ priority: 1 });

export default mongoose.models.TeachingPlan ||
  mongoose.model<ITeachingPlanDoc>("TeachingPlan", TeachingPlanSchema);
