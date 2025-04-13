import mongoose, { Schema, model } from "mongoose";
import { AssesmentType } from "../types";

// Question schema
const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      required: true,
      enum: ["multiple-choice", "enumeration", "identification", "essay"],
    },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    explanation: { type: String },
    questionPoints: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      default: "easy",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Assessment schema
const assesmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    assesmentDueDate: { type: Date, required: true },
    timeLimit: { type: Number, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    category: { type: String, default: "quiz" },
    attempts: Number,
    isLate: { type: Boolean, default: false },
    startDate: Date,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const submissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  activityId: { type: Schema.Types.ObjectId, ref: "Assesment", required: true },
  answers: {
    type: Map,
    of: String,
    required: true,
  },
  scores: {
    type: Map,
    of: String,
    required: true,
  },
  submissionDate: Date,
  checked: { type: Date, default: Date.now() },
  attempts: Number,
  score: { type: Number, default: 0 },
  isGraded: { type: Boolean, default: false },
});
// Models
export const Assesment = model("Assesment", assesmentSchema);
export const Question = model("Question", questionSchema);
export const Submissions = model("Submissions", submissionSchema);
