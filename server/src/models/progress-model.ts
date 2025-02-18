import { model } from 'mongoose';

const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedLessons: [{ type: String }],
  },
  { timestamps: true }
);
export const Progress = model('Progress', ProgressSchema);
