import mongoose, { Schema, type Document } from "mongoose";

export interface IQuizAttemptDoc extends Document {
  sessionId: string;
  subject: string;
  topic: string;
  questions: {
    questionId: mongoose.Types.ObjectId;
    selected: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttemptDoc>({
  sessionId: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [{
    questionId: { type: Schema.Types.ObjectId, ref: "MCQ" },
    selected: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

QuizAttemptSchema.index({ sessionId: 1 });
QuizAttemptSchema.index({ score: -1 });

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttemptDoc>("QuizAttempt", QuizAttemptSchema);
