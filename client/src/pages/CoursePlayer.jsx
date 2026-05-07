import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../lib/api'

const EMBED_PLACEHOLDER_URL = 'https://www.youtube.com/embed/q86g1aop6a8?autoplay=1'

function toInt(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback
}

export default function CoursePlayer() {
  const { id } = useParams()
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

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="bg-[#f9f9f9] text-[#1a1c1c]">
      <Navbar />
      <main className="mt-[80px] max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          <section className="w-full lg:w-3/4 bg-black relative">
            <div className="relative aspect-video overflow-hidden border-b border-[#cfc4c5]">
              <iframe
                title="Course lesson player"
                src={EMBED_PLACEHOLDER_URL}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="bg-[#f9f9f9] p-8 md:p-16">
              <div className="max-w-4xl">
                <span className="text-[14px] font-bold uppercase tracking-widest text-[#4d6705] mb-4 block">Current Lesson</span>
                <h1 className="text-[40px] font-semibold tracking-tight text-black mb-6">
                  {activeRow?.lecture?.title || course.title}
                </h1>
                <p className="text-[18px] text-[#4c4546] mb-12 leading-relaxed">
                  {course.description || 'Lesson details will appear here as curriculum is updated.'}
                </p>

                <div className="border-t border-black pt-10">
                  <h3 className="text-[14px] font-bold uppercase tracking-widest mb-6">Course Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-5 border border-[#cfc4c5] bg-white">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">description</span>
                        <div>
                          <p className="font-bold text-[14px]">Lecture Notes.pdf</p>
                          <p className="text-[12px] text-[#4c4546]">Placeholder material</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#4c4546]">download</span>
                    </div>
                    <div className="flex items-center justify-between p-5 border border-[#cfc4c5] bg-white">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">folder_zip</span>
                        <div>
                          <p className="font-bold text-[14px]">Project Files.zip</p>
                          <p className="text-[12px] text-[#4c4546]">Placeholder material</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#4c4546]">download</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="w-full lg:w-1/4 bg-[#f3f3f4] border-l border-[#cfc4c5] flex flex-col lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px]">
            <div className="p-8 border-b border-[#cfc4c5]">
              <h2 className="text-[14px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Up Next</h2>
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

