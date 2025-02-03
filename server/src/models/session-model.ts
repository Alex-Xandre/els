import mongoose, { Schema, model } from 'mongoose';

const applicantSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model('Session', applicantSchema);
