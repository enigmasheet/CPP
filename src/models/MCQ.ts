import mongoose, { Schema, Document } from "mongoose";
import { DIFFICULTY_LEVELS, DEFAULT_MCQ_DIFFICULTY } from "@/lib/constants";

export interface IMCQDoc extends Document {
  subject: mongoose.Types.ObjectId;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt: Date;
}

const MCQSchema = new Schema<IMCQDoc>({
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  codeSnippet: { type: String },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  }],
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: DIFFICULTY_LEVELS, default: DEFAULT_MCQ_DIFFICULTY },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

MCQSchema.index({ subject: 1, topic: 1 });
MCQSchema.index({ difficulty: 1 });

export default mongoose.models.MCQ || mongoose.model<IMCQDoc>("MCQ", MCQSchema);
