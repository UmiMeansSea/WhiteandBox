import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ensureSessionCookie } from '../middleware/session.js';
import { addDuration, endActive, listRecentCourseSessions, upsertCourseSession } from '../store/sessionStore.js';

const router = express.Router();

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return next();
  });
}

function normalizeUser(req) {
  if (!req.user) return null;
  return {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
}

// Student tracking endpoint (cookie-based session id)
// Body: { courseId, courseTitle, durationMs, action?: 'heartbeat'|'end' }
router.post('/track', ensureSessionCookie, requireAuth, (req, res) => {
  const { courseId, courseTitle, durationMs, action } = req.body || {};
  const sessionId = req.sessionId;

  const user = normalizeUser(req);
  upsertCourseSession({ sessionId, user, course: { courseId, courseTitle } });

  if (durationMs) {
    addDuration({ sessionId, courseId, courseTitle, durationMs });
  }
  if (action === 'end') {
    endActive({ sessionId, courseId });
  }

  return res.json({ ok: true });
});

// Admin view: recent sessions
router.get('/admin/recent', requireAdmin, (req, res) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
  const sessions = listRecentCourseSessions({ limit });
  return res.json({ sessions });
});

export default router;

