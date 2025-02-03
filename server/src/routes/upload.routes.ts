import express from 'express';
import protect from '../middlewares/auth-protect';
const upload = require('../middlewares/upload');
const uploadImage = require('../middlewares/upload-image');
const uploadController = require('../controllers/upload.controller.js');

const router = express.Router();

router.post('', protect, uploadImage, upload, uploadController.uploadAvatar);

export default router;
