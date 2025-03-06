import express from 'express';
import {
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  registerUserByAdmin,
  validateSession,
} from '../controllers/user-controller';
import protect from '../middlewares/auth-protect';
import { getTimeLine, newTimeLine } from '../controllers/timeline-controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', logoutUser);
router.get('/user', protect, getUser);
router.get('/all-user', protect, getAllUsers);
router.post('/add-user', protect, registerUser);

router.get('/validate-session', validateSession);
router.post('/add-user', protect, registerUserByAdmin);

router.post('/new-timeline', protect, newTimeLine);
router.get('/get-timeline', protect, getTimeLine);

export default router;
