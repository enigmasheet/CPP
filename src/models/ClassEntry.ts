import mongoose, { Schema, type Document } from "mongoose";

export interface IClassEntryDoc extends Document {
  classId: mongoose.Types.ObjectId;
  date: Date;
  topics: string[];
  sessionCode?: string;
  duration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassEntrySchema = new Schema<IClassEntryDoc>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    topics: { type: [String], required: true, default: [] },
    sessionCode: { type: String },
    duration: { type: Number },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

ClassEntrySchema.index({ classId: 1 });
ClassEntrySchema.index({ classId: 1, date: -1 });
ClassEntrySchema.index({ sessionCode: 1 });

export default mongoose.models.ClassEntry ||
  mongoose.model<IClassEntryDoc>("ClassEntry", ClassEntrySchema);
