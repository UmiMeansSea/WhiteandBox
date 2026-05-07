import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Course from '../models/Course.js';
import { addProgress, getContinueRows, getProgressMap, getSavedIds, saveCourse, unsaveCourse } from '../store/learningStore.js';

const router = express.Router();

function studentOnly(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'student') return res.status(403).json({ message: 'Students only' });
    return next();
  });
}

async function getAllPublishedCourses() {
  try {
    return await Course.find({ status: 'published' }).limit(200);
  } catch {
    return [];
  }
}

router.get('/saved', studentOnly, async (req, res) => {
  const ids = getSavedIds(req.user.id);
  const all = await getAllPublishedCourses();
  const map = new Map(all.map((c) => [String(c._id), c]));
  const courses = ids.map((id) => map.get(String(id))).filter(Boolean);
  return res.json({ savedIds: ids, courses });
});

router.post('/saved', studentOnly, (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId) return res.status(400).json({ message: 'courseId is required' });
  saveCourse(req.user.id, courseId);
  return res.json({ savedIds: getSavedIds(req.user.id) });
});

router.delete('/saved/:courseId', studentOnly, (req, res) => {
  unsaveCourse(req.user.id, req.params.courseId);
  return res.json({ savedIds: getSavedIds(req.user.id) });
});

router.post('/progress', studentOnly, (req, res) => {
  const { courseId, courseTitle, durationMs } = req.body || {};
  if (!courseId) return res.status(400).json({ message: 'courseId is required' });
  addProgress(req.user.id, { courseId, courseTitle, durationMs });
  return res.json({ ok: true });
});

router.get('/dashboard', studentOnly, async (req, res) => {
  const all = await getAllPublishedCourses();
  const byId = new Map(all.map((c) => [String(c._id), c]));
  const progressMap = getProgressMap(req.user.id);
  const savedIds = getSavedIds(req.user.id);

  const continueRows = getContinueRows(req.user.id).map((p) => {
    const course = byId.get(String(p.courseId));
    const totalMs = Number(course?.totalHours || 0) * 60 * 60 * 1000;
    const progressPercent = totalMs > 0 ? Math.min(100, Math.round((p.timeSpentMs / totalMs) * 100)) : 0;
    return {
      ...p,
      progressPercent,
      course: course || null,
    };
  });

  const startedIds = new Set(Object.keys(progressMap || {}));
  const suggestions = all
    .filter((c) => !startedIds.has(String(c._id)))
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 8);

  const savedCourses = savedIds.map((id) => byId.get(String(id))).filter(Boolean);
  return res.json({
    continueRows,
    suggestions,
    savedIds,
    savedCourses,
  });
});

export default router;

