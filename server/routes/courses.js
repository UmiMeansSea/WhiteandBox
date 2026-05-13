import express from 'express';
import multer from 'multer';
import { 
  getCourses, 
  getCourseById,
  createCourse, 
  updateCourse, 
  uploadAssets, 
  addLecture 
} from '../controllers/courseController.js';
import { requireAdmin } from '../middleware/auth.js';
import Course from '../models/Course.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use((req, res, next) => {
  console.log(`🛣️ Course Router: ${req.method} ${req.url}`);
  next();
});

/**
 * @desc    Upload course assets individually (Admin)
 * @route   POST /api/courses/:id/assets
 */
router.post('/:id/assets', requireAdmin, upload.array('files', 10), uploadAssets);

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 */
router.get('/', getCourses);

/**
 * @desc    GET single course by ID
 * @route   GET /api/courses/:id
 */
router.get('/:id', getCourseById);

/**
 * @desc    Create course (Admin)
 * @route   POST /api/courses
 */
router.post('/', requireAdmin, createCourse);

/**
 * @desc    Update course (Admin)
 * @route   PUT /api/courses/:id
 */
router.put('/:id', requireAdmin, updateCourse);

/**
 * @desc    Add lecture via URL (Admin)
 * @route   POST /api/courses/:id/curriculum/lecture
 */
router.post('/:id/curriculum/lecture', requireAdmin, addLecture);

// Router 404
router.use((req, res) => {
  console.log(`❌ Course Router 404: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Course route ${req.method} ${req.url} not found` });
});

export default router;
