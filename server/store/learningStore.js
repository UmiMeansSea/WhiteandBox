const userLearning = new Map();

function ensureUser(userId) {
  const key = String(userId);
  if (!userLearning.has(key)) {
    userLearning.set(key, {
      saved: new Set(),
      progressByCourse: {},
      updatedAt: Date.now(),
    });
  }
  return userLearning.get(key);
}

export function saveCourse(userId, courseId) {
  const entry = ensureUser(userId);
  entry.saved.add(String(courseId));
  entry.updatedAt = Date.now();
  return entry;
}

export function unsaveCourse(userId, courseId) {
  const entry = ensureUser(userId);
  entry.saved.delete(String(courseId));
  entry.updatedAt = Date.now();
  return entry;
}

export function getSavedIds(userId) {
  const entry = ensureUser(userId);
  return Array.from(entry.saved);
}

export function addProgress(userId, { courseId, courseTitle, durationMs }) {
  const entry = ensureUser(userId);
  const cId = String(courseId || '');
  if (!cId) return entry;
  const cur = entry.progressByCourse[cId] || {
    courseId: cId,
    courseTitle: String(courseTitle || ''),
    timeSpentMs: 0,
    updatedAt: Date.now(),
  };
  cur.courseTitle = String(courseTitle || cur.courseTitle || '');
  cur.timeSpentMs += Math.max(0, Number(durationMs) || 0);
  cur.updatedAt = Date.now();
  entry.progressByCourse[cId] = cur;
  entry.updatedAt = Date.now();
  return entry;
}

export function getProgressMap(userId) {
  const entry = ensureUser(userId);
  return entry.progressByCourse;
}

export function getContinueRows(userId) {
  const entry = ensureUser(userId);
  const rows = Object.values(entry.progressByCourse || {});
  rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return rows;
}

