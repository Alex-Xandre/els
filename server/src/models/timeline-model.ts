import mongoose, { Schema, model } from 'mongoose';

const timelineActivitySchema = new Schema(
  {
    user: String,
    course: String,
    module: String,
    section: String,
    activity: String,
    activityType: {
      type: String,
      enum: ['viewed', 'started', 'completed', 'submitted'],
      required: true,
    },
    text: String,
  },
  {
    timestamps: true,
  }
);

export default model('TimelineActivity', timelineActivitySchema);
