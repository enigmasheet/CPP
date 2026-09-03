import mongoose, { Schema, Document } from "mongoose";

export interface ISessionItem {
  contentType: "mcq" | "game";
  contentId: mongoose.Types.ObjectId | string;
  gameType?: string;
}

export interface ISessionDoc extends Document {
  code: string;
  title: string;
  type: "quiz" | "game" | "mixed";
  items: ISessionItem[];
  isActive: boolean;
  createdBy: string;
  section?: string;
  maxAttempts?: number;
  timeLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SessionItemSchema = new Schema<ISessionItem>(
  {
    contentType: { type: String, enum: ["mcq", "game"], required: true },
    contentId: { type: Schema.Types.Mixed, required: true },
    gameType: { type: String },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISessionDoc>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 6,
      maxlength: 6,
    },
    title: { type: String, required: true },
    type: { type: String, enum: ["quiz", "game", "mixed"], required: true },
    items: { type: [SessionItemSchema], required: true, min: 1 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, default: "teacher" },
    section: { type: String },
    maxAttempts: { type: Number },
    timeLimit: { type: Number },
  },
  { timestamps: true }
);

SessionSchema.index({ isActive: 1 });
SessionSchema.index({ createdAt: -1 });

export default mongoose.models.Session ||
  mongoose.model<ISessionDoc>("Session", SessionSchema);
