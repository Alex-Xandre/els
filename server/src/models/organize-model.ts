import mongoose, { model, Schema } from 'mongoose';

// Assessment schema
const organizeSchema = new Schema(
  {
    moduleId: { type: String, required: true },
    contentId: [String],
  },
  { timestamps: true }
);

// Models
export const Organize = model('Organize', organizeSchema);
