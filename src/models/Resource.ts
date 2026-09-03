import mongoose, { Schema, type Document } from "mongoose";

export interface IResourceDoc extends Document {
  subject: mongoose.Types.ObjectId;
  topic: string;
  title: string;
  type: "code" | "diagram" | "document";
  content: string;
  language?: string;
  imageUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
}

const ResourceSchema = new Schema<IResourceDoc>({
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  topic: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["code", "diagram", "document"], required: true },
  content: { type: String, required: true },
  language: { type: String },
  imageUrl: { type: String },
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  createdAt: { type: Date, default: Date.now },
});

ResourceSchema.index({ subject: 1, topic: 1 });
ResourceSchema.index({ type: 1 });

export default mongoose.models.Resource || mongoose.model<IResourceDoc>("Resource", ResourceSchema);
