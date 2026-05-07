// Simple in-memory session tracking store (demo mode friendly).
// If you connect MongoDB later, this can be replaced with a model.

const sessionsById = new Map();

function nowMs() {
  return Date.now();
}

export function upsertCourseSession({ sessionId, user, course }) {
  const key = String(sessionId);
  const existing = sessionsById.get(key) || {
    sessionId: key,
    user: user || null,
    totalsByCourseId: {},
    active: null,
    lastSeenAt: nowMs(),
    createdAt: nowMs(),
  };

  existing.user = user || existing.user;
  existing.lastSeenAt = nowMs();

  if (course) {
    existing.active = {
      courseId: String(course.courseId || ''),
      courseTitle: String(course.courseTitle || ''),
      startedAt: nowMs(),
    };
  }

  sessionsById.set(key, existing);
  return existing;
}

export function addDuration({ sessionId, courseId, courseTitle, durationMs }) {
  const key = String(sessionId);
  const existing = sessionsById.get(key) || upsertCourseSession({ sessionId: key });

  const cId = String(courseId || '');
  if (!cId) return existing;
  const safeMs = Math.max(0, Number(durationMs) || 0);

  const cur = existing.totalsByCourseId[cId] || { courseId: cId, courseTitle: String(courseTitle || ''), totalMs: 0 };
  cur.courseTitle = String(courseTitle || cur.courseTitle || '');
  cur.totalMs += safeMs;
  existing.totalsByCourseId[cId] = cur;

  existing.lastSeenAt = nowMs();
  sessionsById.set(key, existing);
  return existing;
}

export function endActive({ sessionId, courseId }) {
  const key = String(sessionId);
  const existing = sessionsById.get(key);
  if (!existing) return null;
  if (existing.active?.courseId && String(existing.active.courseId) === String(courseId || '')) {
    existing.active = null;
  }
  existing.lastSeenAt = nowMs();
  sessionsById.set(key, existing);
  return existing;
}

export function listRecentCourseSessions({ limit = 25 } = {}) {
  const all = Array.from(sessionsById.values());
  all.sort((a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0));

  const rows = [];
  for (const s of all) {
    // Pick the most recently touched course total (or the active one)
    const totals = Object.values(s.totalsByCourseId || {});
    totals.sort((a, b) => (b.totalMs || 0) - (a.totalMs || 0));
    const top = totals[0] || null;

    const courseId = s.active?.courseId || top?.courseId || '';
    const courseTitle = s.active?.courseTitle || top?.courseTitle || '';
    const totalMs = top?.totalMs || 0;

    if (!courseId && !courseTitle) continue;
    rows.push({
      sessionId: s.sessionId,
      studentName: s.user?.name || 'Student',
      studentEmail: s.user?.email || '',
      courseId,
      courseTitle,
      timeSpentMs: totalMs,
      lastSeenAt: s.lastSeenAt,
    });
    if (rows.length >= limit) break;
  }

  return rows;
}

