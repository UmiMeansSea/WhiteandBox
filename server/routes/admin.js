import express from 'express';
import multer from 'multer';
import { 
  uploadCourse, 
  deleteCourse, 
  deleteLecture,
  getStats
} from '../controllers/courseController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Setup Multer with memory storage for Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/test', (req, res) => res.json({ message: 'Admin routes are active' }));

/**
 * @desc    Unified course upload (Thumbnail, Video, PDF)
 * @route   POST /api/admin/upload-course
 */
router.post('/upload-course', requireAdmin, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), uploadCourse);

/**
 * @desc    Get platform stats
 * @route   GET /api/admin/stats
 */
router.get('/stats', requireAdmin, getStats);

/**
 * @desc    Delete course
 * @route   DELETE /api/admin/courses/:id
 */
router.delete('/courses/:id', requireAdmin, deleteCourse);

/**
 * @desc    Delete specific lecture from course
 * @route   DELETE /api/admin/courses/:id/curriculum/:lectureId
 */
router.delete('/courses/:id/curriculum/:lectureId', requireAdmin, deleteLecture);

router.use((req, res) => {
  console.log(`⚠️ Unmatched Admin Route: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Admin route not found: ${req.method} ${req.url}` });
});

export default router;
