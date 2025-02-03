import express from 'express';
import {
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  validateSession,
} from '../controllers/user-controller';
import protect from '../middlewares/auth-protect';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', logoutUser);
router.get('/user', protect, getUser);
router.get('/all-user', protect, getAllUsers);
router.post('/add-user', protect, registerUser);

router.get('/validate-session', validateSession);

export default router;