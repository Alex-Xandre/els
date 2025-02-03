import mongoose, { Schema, model } from 'mongoose';

// Question schema
const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    questionType: { type: String, required: true, enum: ['multiple-choice', 'enumeration', 'identification', 'essay'] },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String },
    questionPoints: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  },
  { timestamps: true }
);

// Assessment schema
const assesmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    assesmentDueDate: { type: Date, required: true },
    timeLimit: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

// Models
export const Assesment = model('Assesment', assesmentSchema);
export const Question = model('Question', questionSchema);
