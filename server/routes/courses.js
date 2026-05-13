import express from 'express';
import Course from '../models/Course.js';
import { getCourses } from '../controllers/courseController.js';

const router = express.Router();

/**
 * @desc    Get all courses (supports Redis caching in controller)
 * @route   GET /api/courses
 */
router.get('/', getCourses);

/**
 * @desc    GET single course by ID
 * @route   GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
