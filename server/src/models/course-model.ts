import { Schema, model } from 'mongoose';

// Define the cover image links
const coverImages = [
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover1_h28tl3.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover2_tqh446.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover3_soq0xt.webp',
  'https://res.cloudinary.com/dgb3br9x6/image/upload/v1737850853/cover4_d5j1re.webp',
];

// Utility function to get a random cover image
const getRandomCover = (): string => {
  const randomIndex = Math.floor(Math.random() * coverImages.length);
  return coverImages[randomIndex];
};

// Section Schema
const sectionSchema = new Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String },
    resource: { type: String },
    description: String,
    isUnlock: { type: Boolean, default: false },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    sectionType: String,
    cover: { type: String, default: getRandomCover() },
  },
  { timestamps: true }
);

// Module Schema
const moduleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    cover: { type: String, default: getRandomCover() },
  },
  { timestamps: true }
);

// Course Schema
const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: String },
    category: { type: String },
    cover: { type: String, default: getRandomCover() },
  },
  { timestamps: true }
);

// Export the models
export const Section = model('Section', sectionSchema);
export const Module = model('Module', moduleSchema);
export const Course = model('Course', courseSchema);
