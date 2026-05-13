import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'

function toInt(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback
}

export default function CoursePlayer() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)

  const activeSection = toInt(searchParams.get('section'), 0)
  const activeLecture = toInt(searchParams.get('lecture'), 0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get(`/api/courses/${id}`)
        if (!cancelled) setCourse(res.data || null)
      } catch {
        if (!cancelled) setCourse(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  // Session & Progress tracking — Bypass for Admins
  useEffect(() => {
    if (!isAuthenticated) return
    if (!course?._id) return
    if (user?.role === 'admin') return // BYPASS TRACKING FOR ADMINS

    let stopped = false
    let last = Date.now()

    const tick = async (action = 'heartbeat') => {
      if (stopped) return
      const now = Date.now()
      const durationMs = Math.max(0, now - last)
      last = now
      try {
        await api.post('/api/sessions/track', {
          courseId: course._id,
          courseTitle: course.title,
          durationMs,
          action,
        })
        await api.post('/api/learning/progress', {
          courseId: course._id,
          courseTitle: course.title,
          durationMs,
          lectureId: activeRow?.lecture?._id,
          lectureTitle: activeRow?.lecture?.title
        })
      } catch (err) {
        // ignore tracking errors
      }
    }

    const interval = setInterval(() => tick(), 15000)
    return () => {
      stopped = true
      clearInterval(interval)
      tick('end').catch(() => {})
    }
  }, [course?._id, course?.title, isAuthenticated, user?.role, activeSection, activeLecture])

  const curriculumRows = []
  ;(course?.curriculum || []).forEach((section, si) => {
    ;(section.lectures || []).forEach((lecture, li) => {
      curriculumRows.push({
        sectionTitle: section.sectionTitle || `Section ${si + 1}`,
        sectionIndex: si,
        lectureIndex: li,
        lecture,
        isActive: si === activeSection && li === activeLecture,
      })
    })
  })

  const activeRow = curriculumRows.find((row) => row.isActive) || curriculumRows.find((row) => row.lecture.type === 'video') || curriculumRows[0]

  if (loading) {
    return (
      <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <Navbar />
        <main className="mt-[80px] px-6 py-20 text-center">Loading lesson...</main>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <Navbar />
        <main className="mt-[80px] px-6 py-20 text-center">
          <p className="text-[28px] font-black mb-4">Course not found</p>
          <Link to="/courses" className="underline">Back to courses</Link>
        </main>
      </div>
    )
  }

  const currentVideoUrl = activeRow?.lecture?.url || ''

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="bg-[#f9f9f9] text-[#1a1c1c]">
      <Navbar />
      <main className="mt-[80px] max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          <section className="w-full lg:w-3/4 bg-black relative">
            <div className="relative aspect-video overflow-hidden border-b border-[#cfc4c5]">
              {activeRow?.lecture?.type === 'video' ? (
                currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be') ? (
                  <iframe
                    title="Course lesson player"
                    src={currentVideoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={currentVideoUrl} 
                    controls 
                    className="w-full h-full"
                    poster={typeof course.thumbnail === 'object' ? course.thumbnail.secure_url : course.thumbnail}
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1c1c] text-white p-12 text-center">
                  <span className="material-symbols-outlined text-[64px] mb-4 text-[#ceef83]">description</span>
                  <h2 className="text-[24px] font-bold mb-2">Reading Material</h2>
                  <p className="text-white/60 mb-8">This lecture contains documents or assignments.</p>
                  <a href={activeRow?.lecture?.url} target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#ceef83] text-black font-bold uppercase text-[12px] tracking-widest">
                    View Document
                  </a>
                </div>
              )}
            </div>

            <div className="bg-[#f9f9f9] p-8 md:p-16">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[14px] font-bold uppercase tracking-widest text-[#4d6705]">Current Lesson</span>
                   {user?.role === 'admin' && (
                     <span className="px-3 py-1 bg-black text-[#ceef83] text-[10px] font-bold uppercase tracking-widest">Admin Preview (Tracking Disabled)</span>
                   )}
                </div>
                <h1 className="text-[40px] font-semibold tracking-tight text-black mb-6">
                  {activeRow?.lecture?.title || course.title}
                </h1>
                <p className="text-[18px] text-[#4c4546] mb-12 leading-relaxed">
                  {course.description || 'Lesson details will appear here as curriculum is updated.'}
                </p>

                <div className="border-t border-black pt-10">
                  <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6">Course Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.pdf?.secure_url ? (
                      <a href={course.pdf.secure_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-5 border border-[#cfc4c5] bg-white hover:border-black transition-all">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined">description</span>
                          <div>
                            <p className="font-bold text-[14px]">Course Guide.pdf</p>
                            <p className="text-[12px] text-[#4c4546]">Primary materials</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#4c4546]">download</span>
                      </a>
                    ) : (
                      <p className="text-[14px] text-[#4c4546]">No additional materials provided.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="w-full lg:w-1/4 bg-[#f3f3f4] border-l border-[#cfc4c5] flex flex-col lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px]">
            <div className="p-8 border-b border-[#cfc4c5]">
              <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Curriculum</h2>
              <p className="text-[24px] font-semibold leading-tight text-black">{course.title}</p>
            </div>

            <div className="flex-grow overflow-y-auto">
              {curriculumRows.map((row, idx) => (
                <button
                  type="button"
                  key={`${row.sectionIndex}-${row.lectureIndex}-${idx}`}
                  onClick={() => navigate(`/courses/${id}/learn?section=${row.sectionIndex}&lecture=${row.lectureIndex}`)}
                  className={`w-full text-left p-6 border-b border-[#cfc4c5] flex gap-4 hover:bg-white transition-colors ${row.isActive ? 'bg-white border-l-4 border-l-black' : ''}`}
                >
                  <div className="w-24 h-16 bg-[#e2e2e2] flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#4c4546]">
                      {row.lecture.type === 'video' ? (row.isActive ? 'play_circle' : 'play_arrow') : 'article'}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${row.isActive ? 'text-[#4d6705]' : 'text-[#4c4546]'}`}>
                      {row.sectionTitle}
                    </span>
                    <span className="text-[12px] font-bold text-black leading-tight">{row.lecture.title}</span>
                    <span className="text-[10px] text-[#4c4546]">{row.lecture.duration || '—'}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-8 bg-black text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[12px] font-bold uppercase tracking-widest">Course Progress</span>
                <span className="text-[12px] font-bold">65%</span>
              </div>
              <div className="w-full h-1 bg-white/20">
                <div className="h-full bg-[#ceef83] w-[65%]" />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
