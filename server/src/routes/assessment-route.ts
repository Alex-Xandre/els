import express from 'express';

import protect from '../middlewares/auth-protect';
import { getAssesment, newAssessment, newSubmission } from '../controllers/assesment-controller';

const router = express.Router();

router.post('/', protect, newAssessment);
router.get('/', protect, getAssesment);
router.post('/new-submission', protect, newSubmission);
router.get('/get-submission/:id', protect, newSubmission);
export default router;
