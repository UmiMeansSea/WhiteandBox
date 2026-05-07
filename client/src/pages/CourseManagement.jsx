import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'
import AdminShell from '../components/AdminShell'

function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

function normalizeCourse(c) {
  return {
    ...c,
    curriculum: Array.isArray(c?.curriculum) ? c.curriculum : [],
    updatedAt: c?.updatedAt ? new Date(c.updatedAt) : null,
  }
}

export default function CourseManagement() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const initialTab = params.get('tab') === 'active' ? 'active' : 'create'

  const [tab, setTab] = useState(initialTab)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [q, setQ] = useState('')

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'Design & Arts',
  })
  const [createFiles, setCreateFiles] = useState({
    thumbnail: null,
    video: null,
    material: null,
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [editing, setEditing] = useState(null) // course object
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [newLecture, setNewLecture] = useState({
    sectionTitle: 'Course Content',
    title: '',
    duration: '',
    type: 'video',
    url: '',
    file: null,
  })

  async function fetchCourses() {
    setLoading(true)
    try {
      const res = await api.get('/api/courses', { params: { admin: true, page: 1, limit: 100 } })
      setCourses((res.data.courses || []).map(normalizeCourse))
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) fetchCourses() })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    setParams({ tab }, { replace: true })
  }, [tab, setParams])

  const filteredCourses = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return courses
    return courses.filter((c) =>
      String(c.title || '').toLowerCase().includes(s) ||
      String(c.category || '').toLowerCase().includes(s)
    )
  }, [courses, q])

  async function publishNewCourse() {
    setCreateError('')
    if (!createForm.title.trim()) {
      setCreateError('Course title is required.')
      return
    }
    if (!createForm.category.trim()) {
      setCreateError('Category is required.')
      return
    }

    setCreating(true)
    try {
      const body = {
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        category: createForm.category.trim(),
        instructor: user?.name || 'Admin',
        instructorAvatar: user?.avatar || null,
        price: 0,
        status: 'published',
        curriculum: [],
      }
      const res = await api.post('/api/courses', body)
      const created = normalizeCourse(res.data)

      // thumbnail
      if (createFiles.thumbnail) {
        const fd = new FormData()
        fd.append('kind', 'thumbnail')
        fd.append('files', createFiles.thumbnail)
        const up = await api.post(`/api/courses/${created._id}/assets`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        created.thumbnail = up.data?.course?.thumbnail || created.thumbnail
      }

      // initial video
      if (createFiles.video) {
        const fd = new FormData()
        fd.append('kind', 'video')
        fd.append('sectionTitle', 'Course Content')
        fd.append('lectureTitle', `${created.title} — Intro`)
        fd.append('lectureType', 'video')
        fd.append('files', createFiles.video)
        await api.post(`/api/courses/${created._id}/assets`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      // initial material (pdf/zip)
      if (createFiles.material) {
        const fd = new FormData()
        fd.append('kind', 'material')
        fd.append('sectionTitle', 'Course Content')
        fd.append('lectureTitle', 'Course Materials')
        fd.append('lectureType', 'document')
        fd.append('files', createFiles.material)
        await api.post(`/api/courses/${created._id}/assets`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }

      await fetchCourses()
      setCreateForm({ title: '', description: '', category: 'Design & Arts' })
      setCreateFiles({ thumbnail: null, video: null, material: null })
      setTab('active')
    } catch (e) {
      setCreateError(e?.response?.data?.message || 'Failed to publish course.')
    } finally {
      setCreating(false)
    }
  }

  function openEdit(course) {
    setEditError('')
    setEditing(JSON.parse(JSON.stringify(course)))
    setNewLecture({
      sectionTitle: course?.curriculum?.[0]?.sectionTitle || 'Course Content',
      title: '',
      duration: '',
      type: 'video',
      url: '',
      file: null,
    })
  }

  async function saveCourseEdits() {
    setEditError('')
    if (!editing?.title?.trim()) {
      setEditError('Course title is required.')
      return
    }
    setEditSaving(true)
    try {
      const res = await api.put(`/api/courses/${editing._id}`, {
        title: editing.title,
        description: editing.description || '',
        category: editing.category || '',
        thumbnail: editing.thumbnail || '',
        curriculum: editing.curriculum || [],
        status: editing.status || 'published',
      })
      setEditing(normalizeCourse(res.data))
      await fetchCourses()
    } catch (e) {
      setEditError(e?.response?.data?.message || 'Failed to save changes.')
    } finally {
      setEditSaving(false)
    }
  }

  async function addLectureToCourse() {
    setEditError('')
    if (!editing?._id) return
    if (!newLecture.title.trim() && !newLecture.file && !newLecture.url.trim()) {
      setEditError('Provide a lecture title and either a URL or an upload.')
      return
    }
    if (!newLecture.sectionTitle.trim()) {
      setEditError('Section title is required.')
      return
    }

    setEditSaving(true)
    try {
      if (newLecture.file) {
        const fd = new FormData()
        fd.append('kind', newLecture.type === 'document' ? 'material' : 'video')
        fd.append('sectionTitle', newLecture.sectionTitle)
        fd.append('lectureTitle', newLecture.title || newLecture.file.name)
        fd.append('lectureType', newLecture.type)
        fd.append('lectureDuration', newLecture.duration || '')
        fd.append('files', newLecture.file)
        const res = await api.post(`/api/courses/${editing._id}/assets`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setEditing(normalizeCourse(res.data.course))
      } else {
        const res = await api.post(`/api/courses/${editing._id}/curriculum/lecture`, {
          sectionTitle: newLecture.sectionTitle,
          lecture: {
            title: newLecture.title || newLecture.url,
            duration: newLecture.duration || '',
            type: newLecture.type,
            url: newLecture.url || '',
            preview: false,
          },
        })
        setEditing(normalizeCourse(res.data))
      }

      await fetchCourses()
      setNewLecture((l) => ({ ...l, title: '', duration: '', url: '', file: null }))
    } catch (e) {
      setEditError(e?.response?.data?.message || 'Failed to add lecture/material.')
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <AdminShell>
      <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-[48px] font-semibold tracking-tight leading-none mb-4">Course Management</h2>
              <p className="text-[18px] text-[#4c4546] max-w-2xl leading-relaxed">
                Add new content to the curriculum or refine existing modules. Updates publish instantly to the student catalog.
              </p>
            </div>

            <div className="flex bg-[#eeeeee] p-1 border border-black w-full md:w-auto">
              <button
                onClick={() => setTab('create')}
                className={`px-8 py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                  tab === 'create' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-[#e2e2e2]'
                }`}
              >
                Create New
              </button>
              <button
                onClick={() => setTab('active')}
                className={`px-8 py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                  tab === 'active' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-[#e2e2e2]'
                }`}
              >
                Active Courses
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Create */}
            {tab === 'create' && (
              <section className="lg:col-span-5 space-y-8">
                <div className="border-b border-black pb-4">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.2em]">Quick Entry Flow</h3>
                </div>

                {createError && (
                  <div className="border border-[#ba1a1a] bg-[#ffdad6] text-[#93000a] p-4 text-[14px] font-semibold">
                    {createError}
                  </div>
                )}

                <div className="space-y-8">
                  <div>
                    <label className="block text-[14px] font-bold uppercase tracking-wider mb-2">Course Title</label>
                    <input
                      value={createForm.title}
                      onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full border-0 border-b border-black bg-transparent py-4 px-0 focus:ring-0 focus:border-[#b2d26a] text-[24px] font-semibold placeholder:text-[#e2e2e2]"
                      placeholder="e.g. Advanced Minimalism in Architecture"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full border border-black bg-transparent p-4 focus:ring-0 focus:border-[#b2d26a] text-[16px] placeholder:text-[#e2e2e2]"
                      placeholder="Define the learning objectives..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full border-0 border-b border-black bg-transparent py-4 px-0 focus:ring-0 focus:border-[#b2d26a] text-[16px]"
                    >
                      {['Design & Arts', 'Technology', 'Business Strategy', 'Humanities', 'Architecture', 'Development', 'Photography', 'UX Design', 'Branding', 'Music', '3D Design', 'Graphic Design'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[14px] font-bold uppercase tracking-wider">Course Assets</label>

                    <div className="grid grid-cols-1 gap-4">
                      <label className="border-2 border-dashed border-[#cfc4c5] p-6 bg-white hover:border-black transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <Icon name="image" className="text-[28px] text-[#7e7576]" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold">Thumbnail (optional)</p>
                            <p className="text-[12px] text-[#4c4546] truncate">{createFiles.thumbnail?.name || 'PNG/JPG'}</p>
                          </div>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setCreateFiles((f) => ({ ...f, thumbnail: e.target.files?.[0] || null }))} />
                      </label>

                      <label className="border-2 border-dashed border-[#cfc4c5] p-6 bg-white hover:border-black transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <Icon name="movie" className="text-[28px] text-[#7e7576]" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold">Intro Video (optional)</p>
                            <p className="text-[12px] text-[#4c4546] truncate">{createFiles.video?.name || 'MP4'}</p>
                          </div>
                        </div>
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => setCreateFiles((f) => ({ ...f, video: e.target.files?.[0] || null }))} />
                      </label>

                      <label className="border-2 border-dashed border-[#cfc4c5] p-6 bg-white hover:border-black transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <Icon name="article" className="text-[28px] text-[#7e7576]" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold">Materials (optional)</p>
                            <p className="text-[12px] text-[#4c4546] truncate">{createFiles.material?.name || 'PDF/ZIP'}</p>
                          </div>
                        </div>
                        <input type="file" accept=".pdf,.zip,.rar,application/pdf,application/zip" className="hidden" onChange={(e) => setCreateFiles((f) => ({ ...f, material: e.target.files?.[0] || null }))} />
                      </label>
                    </div>
                  </div>

                  <button
                    disabled={creating}
                    onClick={publishNewCourse}
                    className="w-full py-5 bg-black text-white text-[14px] font-bold uppercase tracking-[0.2em] hover:border-b-4 hover:border-[#ceef83] transition-all disabled:opacity-60"
                    type="button"
                  >
                    {creating ? 'Publishing…' : 'Publish Course'}
                  </button>
                </div>
              </section>
            )}

            {/* Active */}
            <section className={`${tab === 'create' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
              <div className="flex items-center justify-between border-b border-black pb-4">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em]">Active Curriculum</h3>
                <div className="relative flex items-center">
                  <Icon name="search" className="absolute left-0 text-[#7e7576]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="border-0 border-b border-[#cfc4c5] bg-transparent pl-8 pr-2 py-1 focus:ring-0 focus:border-black text-[12px] font-bold uppercase tracking-wider"
                    placeholder="SEARCH COURSES..."
                    type="text"
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-16 text-center">
                  <Icon name="hourglass_empty" className="text-[48px] text-[#cfc4c5]" />
                  <div className="text-[14px] text-[#4c4546] font-bold uppercase tracking-widest mt-4">Loading curriculum…</div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="py-16 text-center">
                  <Icon name="search_off" className="text-[48px] text-[#cfc4c5]" />
                  <div className="text-[14px] text-[#4c4546] font-bold uppercase tracking-widest mt-4">No courses found</div>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredCourses.map((c) => (
                    <div key={c._id} className="group flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-[#cfc4c5] hover:bg-white transition-colors px-4 -mx-4">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-24 h-16 bg-[#eeeeee] border border-[#cfc4c5] overflow-hidden">
                          {c.thumbnail ? (
                            <img alt={c.title} className="w-full h-full object-cover grayscale" src={c.thumbnail} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#4c4546] uppercase tracking-widest">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-[18px] font-bold text-black group-hover:underline underline-offset-8 decoration-[#ceef83]">
                            {c.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[12px] text-[#4c4546] uppercase tracking-tight">
                              Updated {c.updatedAt ? c.updatedAt.toLocaleDateString() : '—'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#cfc4c5]"></span>
                            <span className="text-[12px] text-[#4c4546] uppercase tracking-tight">{c.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-black">{(c.studentCount || 0).toLocaleString()}</p>
                          <p className="text-[12px] text-[#7e7576] uppercase font-bold tracking-wider">Students</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => openEdit(c)} className="p-2 border border-black hover:bg-[#ceef83] transition-colors" title="Edit course">
                            <Icon name="edit" className="text-[18px]" />
                          </button>
                          <button onClick={() => { setTab('active'); openEdit(c); }} className="p-2 border border-black hover:bg-[#ceef83] transition-colors" title="Add content">
                            <Icon name="add_circle" className="text-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination placeholder (UI only, list is capped at 100 for admin) */}
              {!loading && filteredCourses.length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[12px] text-[#7e7576] uppercase tracking-widest font-bold">Showing {filteredCourses.length} courses</span>
                  <button
                    onClick={fetchCourses}
                    className="px-6 py-2 border border-black text-[12px] font-bold uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black flex items-center justify-between">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546]">Edit Course</div>
                <div className="text-[24px] font-black">{editing.title}</div>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 border border-black hover:bg-[#eeeeee]">
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                {editError && (
                  <div className="border border-[#ba1a1a] bg-[#ffdad6] text-[#93000a] p-4 text-[14px] font-semibold">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Title</label>
                  <input
                    value={editing.title || ''}
                    onChange={(e) => setEditing((c) => ({ ...c, title: e.target.value }))}
                    className="w-full border-0 border-b border-black bg-transparent py-3 px-0 text-[18px] font-semibold focus:ring-0 focus:border-[#b2d26a]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Description</label>
                  <textarea
                    value={editing.description || ''}
                    onChange={(e) => setEditing((c) => ({ ...c, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-black bg-transparent p-4 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Category</label>
                    <input
                      value={editing.category || ''}
                      onChange={(e) => setEditing((c) => ({ ...c, category: e.target.value }))}
                      className="w-full border-0 border-b border-black bg-transparent py-3 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Thumbnail URL</label>
                    <input
                      value={editing.thumbnail || ''}
                      onChange={(e) => setEditing((c) => ({ ...c, thumbnail: e.target.value }))}
                      className="w-full border-0 border-b border-black bg-transparent py-3 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                      placeholder="/uploads/..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveCourseEdits}
                    disabled={editSaving}
                    className="px-8 py-3 bg-black text-white text-[12px] font-bold uppercase tracking-widest border border-black hover:border-b-4 hover:border-[#ceef83] transition-all disabled:opacity-60"
                  >
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-8 py-3 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#eeeeee] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center justify-between border-b border-black pb-3">
                  <h4 className="text-[12px] font-bold uppercase tracking-[0.2em]">Curriculum</h4>
                  <span className="text-[12px] text-[#4c4546] font-bold uppercase tracking-widest">
                    {(editing.totalLectures || 0)} lectures
                  </span>
                </div>

                <div className="space-y-2">
                  {(editing.curriculum || []).length === 0 && (
                    <div className="text-[14px] text-[#4c4546]">No curriculum yet. Add your first lecture below.</div>
                  )}
                  {(editing.curriculum || []).map((s, si) => (
                    <div key={`${s.sectionTitle}-${si}`} className="border border-[#cfc4c5]">
                      <div className="px-4 py-3 bg-[#f3f3f4] border-b border-[#cfc4c5] flex justify-between items-center">
                        <div className="text-[13px] font-bold">{s.sectionTitle}</div>
                        <div className="text-[11px] text-[#4c4546] font-bold uppercase tracking-wider">{(s.lectures || []).length} items</div>
                      </div>
                      <div className="divide-y divide-[#cfc4c5]">
                        {(s.lectures || []).map((l, li) => (
                          <div key={`${li}-${l.title}`} className="px-4 py-3 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <Icon name={l.type === 'document' ? 'article' : 'play_circle'} className="text-[18px] text-[#4c4546]" />
                                <div className="text-[14px] font-semibold truncate">{l.title}</div>
                              </div>
                              {(l.url || (l.materials?.[0]?.url)) && (
                                <a
                                  href={l.url || l.materials?.[0]?.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[12px] text-[#4c4546] underline truncate block pl-6"
                                >
                                  {l.url || l.materials?.[0]?.url}
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-[12px] text-[#4c4546] font-bold uppercase">{l.duration || '—'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black pt-6">
                  <div className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4">Add Video / Material</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Section</label>
                      <input
                        value={newLecture.sectionTitle}
                        onChange={(e) => setNewLecture((l) => ({ ...l, sectionTitle: e.target.value }))}
                        className="w-full border-0 border-b border-black bg-transparent py-2 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Type</label>
                      <select
                        value={newLecture.type}
                        onChange={(e) => setNewLecture((l) => ({ ...l, type: e.target.value }))}
                        className="w-full border-0 border-b border-black bg-transparent py-2 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                      >
                        <option value="video">Video</option>
                        <option value="document">Material (PDF)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Title</label>
                      <input
                        value={newLecture.title}
                        onChange={(e) => setNewLecture((l) => ({ ...l, title: e.target.value }))}
                        className="w-full border-0 border-b border-black bg-transparent py-2 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                        placeholder="e.g. Lesson 01 — Introduction"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Duration (optional)</label>
                      <input
                        value={newLecture.duration}
                        onChange={(e) => setNewLecture((l) => ({ ...l, duration: e.target.value }))}
                        className="w-full border-0 border-b border-black bg-transparent py-2 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                        placeholder="e.g. 12:40"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">URL (optional)</label>
                      <input
                        value={newLecture.url}
                        onChange={(e) => setNewLecture((l) => ({ ...l, url: e.target.value }))}
                        className="w-full border-0 border-b border-black bg-transparent py-2 px-0 text-[14px] focus:ring-0 focus:border-[#b2d26a]"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Upload (optional)</label>
                      <input
                        type="file"
                        accept={newLecture.type === 'document' ? '.pdf,.zip,.rar,application/pdf,application/zip' : 'video/*'}
                        onChange={(e) => setNewLecture((l) => ({ ...l, file: e.target.files?.[0] || null }))}
                        className="w-full border border-black p-3 text-[13px]"
                      />
                      {newLecture.file && (
                        <div className="text-[12px] text-[#4c4546] mt-2">
                          Selected: <span className="font-bold">{newLecture.file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={addLectureToCourse}
                      disabled={editSaving}
                      className="px-8 py-3 bg-[#ceef83] text-black text-[12px] font-bold uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-colors disabled:opacity-60"
                    >
                      {editSaving ? 'Adding…' : 'Add to Course'}
                    </button>
                    <button
                      onClick={saveCourseEdits}
                      disabled={editSaving}
                      className="px-8 py-3 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#eeeeee] transition-colors disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-[12px] text-[#4c4546] mt-3">
                    Tip: for large videos, upload here to store a file under <span className="font-bold">/uploads</span>, or paste a hosted URL to stream from a CDN.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

