import mongoose, { Schema, Document } from "mongoose";

export interface ISubjectDoc extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  topics: { name: string; slug: string }[];
  createdAt: Date;
}

const SubjectSchema = new Schema<ISubjectDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: "BookOpen" },
  topics: [{
    name: { type: String, required: true },
    slug: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Subject || mongoose.model<ISubjectDoc>("Subject", SubjectSchema);
