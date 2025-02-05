import express from 'express';

import protect from '../middlewares/auth-protect';
import { getAssesment, newAssessment } from '../controllers/assesment-controller';

const router = express.Router();

router.post('/', protect, newAssessment);
router.get('/', protect, getAssesment);

export default router;
