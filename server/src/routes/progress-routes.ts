import express from 'express';
import { updateProgress, getStudentProgress, checkLessonUnlock } from '../controllers/progress-controller';
import protect from '../middlewares/auth-protect';
const router = express.Router();

router.post('/update', protect, updateProgress);
router.get('/:studentId', protect, getStudentProgress);
router.post('/check-unlock', protect, checkLessonUnlock);

export default router;
