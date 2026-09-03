import mongoose, { Schema, type Document } from "mongoose";

export interface ISessionResultItem {
  contentId: string;
  contentType: "mcq" | "game";
  selected?: number;
  isCorrect?: boolean;
  score?: number;
}

export interface ISessionResultDoc extends Document {
  sessionId: mongoose.Types.ObjectId;
  studentCode: string;
  name?: string;
  answers: ISessionResultItem[];
  totalScore: number;
  totalPossible: number;
  percentage: number;
  timeTaken?: number;
  completedAt: Date;
}

const SessionResultItemSchema = new Schema<ISessionResultItem>(
  {
    contentId: { type: String, required: true },
    contentType: { type: String, enum: ["mcq", "game"], required: true },
    selected: { type: Number },
    isCorrect: { type: Boolean },
    score: { type: Number },
  },
  { _id: false }
);

const SessionResultSchema = new Schema<ISessionResultDoc>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  studentCode: { type: String, required: true },
  name: { type: String },
  answers: { type: [SessionResultItemSchema], required: true },
  totalScore: { type: Number, required: true },
  totalPossible: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number },
  completedAt: { type: Date, default: Date.now },
});

SessionResultSchema.index({ sessionId: 1 });
SessionResultSchema.index({ studentCode: 1 });
SessionResultSchema.index({ sessionId: 1, studentCode: 1 });

export default mongoose.models.SessionResult ||
  mongoose.model<ISessionResultDoc>("SessionResult", SessionResultSchema);
