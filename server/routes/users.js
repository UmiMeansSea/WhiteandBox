import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const seedInstructor = {
  _id: 'alexei',
  name: 'Alexei Volkov',
  email: 'alexei@volkovstudio.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80',
  role: 'instructor',
  bio: 'Award-winning architect based in Berlin. Principal of Volkov Studio Berlin. Featured in Dezeen, Wallpaper*, and Architectural Digest.',
  totalRevenue: 12480,
  totalStudents: 12840,
  stats: {
    totalRevenue: 12480,
    totalStudents: 12840,
    avgRating: 4.9,
    totalReviews: 2341,
    activeCourses: 3,
    monthlyData: [
      { month: 'Jan', revenue: 800 },
      { month: 'Feb', revenue: 1100 },
      { month: 'Mar', revenue: 950 },
      { month: 'Apr', revenue: 1400 },
      { month: 'May', revenue: 1700 },
      { month: 'Jun', revenue: 1250 },
      { month: 'Jul', revenue: 700 },
      { month: 'Aug', revenue: 580 },
    ]
  }
};

// GET instructor dashboard data
router.get('/instructor/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch {
    res.json(seedInstructor);
  }
});

// GET dashboard stats (seed fallback)
router.get('/dashboard/stats', requireAuth, async (req, res) => {
  try {
    res.json(seedInstructor.stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
