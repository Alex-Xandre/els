import express from 'express';
import {
  newCourse,
  getCourse,
  getCourseWithModulesAndSections,
  newModule,
  getModule,
  getModuleWithSections,
  newSection,
  getSection,
  getSectionWithModule,
} from '../controllers/course-controller';
import protect from '../middlewares/auth-protect';

const router = express.Router();

router.post('/courses', protect, newCourse);
router.get('/courses', protect, getCourse);
router.get('/courses/:id', protect, getCourseWithModulesAndSections);

router.post('/modules', protect, newModule);
router.get('/modules', protect, getModule);
router.get('/modules/:id', protect, getModuleWithSections);

router.post('/sections', protect, newSection);
router.get('/sections', protect, getSection);
router.get('/sections/:id', protect, getSectionWithModule);

export default router;
