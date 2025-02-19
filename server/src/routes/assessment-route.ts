import express from 'express';

import protect from '../middlewares/auth-protect';
import { getAssesment, getSubmissions, newAssessment, newSubmission } from '../controllers/assesment-controller';

const router = express.Router();

router.post('/', protect, newAssessment);
router.get('/', protect, getAssesment);
router.post('/new-submission', protect, newSubmission);
router.get('/get-submission/:id', protect, getSubmissions);
export default router;
