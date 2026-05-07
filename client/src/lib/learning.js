import api from './api'

const SAVED_KEY = 'edupro_saved_courses'

function readLocalSaved() {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function getLocalSavedIds() {
  return readLocalSaved()
}

function writeLocalSaved(ids) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids.map(String)))
  } catch {
    // ignore storage errors
  }
}

export async function fetchSavedIds() {
  try {
    const res = await api.get('/api/learning/saved')
    const ids = (res.data?.savedIds || []).map(String)
    writeLocalSaved(ids)
    return ids
  } catch {
    return readLocalSaved()
  }
}

export async function toggleSavedCourse(courseId, currentlySaved) {
  const id = String(courseId)
  const local = new Set(readLocalSaved())
  if (currentlySaved) local.delete(id)
  else local.add(id)
  writeLocalSaved(Array.from(local))

  try {
    if (currentlySaved) await api.delete(`/api/learning/saved/${id}`)
    else await api.post('/api/learning/saved', { courseId: id })
    const res = await api.get('/api/learning/saved')
    const ids = (res.data?.savedIds || []).map(String)
    writeLocalSaved(ids)
    return ids
  } catch {
    return Array.from(local)
  }
}

