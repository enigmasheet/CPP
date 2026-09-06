import mongoose, { Schema, type Document } from "mongoose";

export interface IClassDoc extends Document {
  name: string;
  subject: string;
  description?: string;
  semester?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClassDoc>(
  {
    name: { type: String, required: true, maxlength: 100 },
    subject: { type: String, required: true },
    description: { type: String, maxlength: 500 },
    semester: { type: String, maxlength: 50 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClassSchema.index({ subject: 1 });
ClassSchema.index({ isActive: 1 });
ClassSchema.index({ name: 1 });

export default mongoose.models.Class ||
  mongoose.model<IClassDoc>("Class", ClassSchema);
