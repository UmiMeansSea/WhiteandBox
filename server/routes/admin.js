import express from 'express';
import multer from 'multer';
import { uploadCourse } from '../controllers/courseController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Setup Multer with memory storage for Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-course', requireAdmin, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), uploadCourse);

export default router;
