import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Progress } from '../models/progress-model';

// Add or Update Progress
export const updateProgress = expressAsyncHandler(async (req: any, res: any) => {
  const { studentId, lessonId } = req.body;

  try {
    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ msg: 'Invalid student ID' });
    }

    const progress = await Progress.findOne({ studentId });

    if (!progress) {
      const newProgress = await Progress.create({
        studentId,
        completedLessons: [lessonId],
      });
      req.io.emit('update-progress', newProgress);
      return res.status(200).json(newProgress);
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      await progress.save();
      req.io.emit('update-progress', progress);
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get Student Progress
export const getStudentProgress = expressAsyncHandler(async (req: any, res: any) => {
  const isAdmin = req.user.role === 'admin';
  const query = isAdmin ? {} : { studentId: req.params.studentId };

  try {
    const progress = await Progress.find(query);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


// Check if Lesson is Unlocked
export const checkLessonUnlock = expressAsyncHandler(async (req: any, res: any) => {
  const { studentId, previousLessonId } = req.body;

  try {
    const progress = await Progress.findOne({ studentId });

    if (!progress) {
      return res.status(200).json({ isUnlock: false });
    }

    const isUnlocked = !previousLessonId || progress.completedLessons.includes(previousLessonId);

    res.status(200).json({ isUnlock: isUnlocked });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
