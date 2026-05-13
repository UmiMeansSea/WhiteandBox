import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'
import { fetchSavedIds, toggleSavedCourse } from '../lib/learning'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [openSection, setOpenSection] = useState(0)
  const [course, setCourse] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) setLoading(true) })
    ;(async () => {
      try {
        const [courseRes, relatedRes] = await Promise.all([
          api.get(`/api/courses/${id}`),
          api.get('/api/courses', { params: { page: 1, limit: 4 } }),
        ])
        if (cancelled) return
        setCourse(courseRes.data)
        const rel = (relatedRes.data.courses || []).filter((c) => c._id !== id).slice(0, 3)
        setRelated(rel)
      } catch {
        if (cancelled) return
        setCourse(null)
        setRelated([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') return
    let cancelled = false
    ;(async () => {
      const ids = await fetchSavedIds()
      if (!cancelled) setSavedIds(ids)
    })()
    return () => { cancelled = true }
  }, [isAuthenticated, user?.role])

  // Session tracking (cookie-based) — only for authenticated students
  useEffect(() => {
    if (!isAuthenticated) return
    if (user?.role !== 'student') return
    if (!course?._id) return

    let stopped = false
    let last = Date.now()

    const tick = async (action) => {
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
        })
      } catch {
        // ignore
      }
    }

    // first heartbeat shortly after mount
    const startT = setTimeout(() => { tick('heartbeat') }, 2000)
    const interval = setInterval(() => { tick('heartbeat') }, 15000)

    const onVis = () => {
      if (document.visibilityState === 'hidden') tick('heartbeat')
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stopped = true
      clearTimeout(startT)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVis)
      // best-effort end (don't await)
      api.post('/api/sessions/track', {
        courseId: course._id,
        courseTitle: course.title,
        durationMs: Math.max(0, Date.now() - last),
        action: 'end',
      }).catch(() => {})
    }
  }, [course?._id, course?.title, isAuthenticated, user?.role])

  if (loading) return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />
      <div className="pt-[180px] text-center">
        <span className="material-symbols-outlined text-[64px] text-[#cfc4c5]">hourglass_empty</span>
        <h2 className="text-[32px] font-black mt-4">Loading course</h2>
        <p className="text-[14px] text-[#4c4546] mt-2">Fetching the latest curriculum…</p>
      </div>
    </div>
  )

  if (!course) return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />
      <div className="pt-[180px] text-center">
        <h2 className="text-[32px] font-black">Course not found</h2>
        <Link to="/courses" className="mt-4 inline-block underline">Back to Courses</Link>
      </div>
    </div>
  )

  const tabs = ['overview', 'curriculum', 'instructor', 'reviews']

  function openLessonPlayer(sectionIndex = 0, lectureIndex = 0) {
    navigate(`/courses/${id}/learn?section=${sectionIndex}&lecture=${lectureIndex}`)
  }

  function getFirstVideoLocation() {
    const sections = course?.curriculum || []
    if (sections.length === 0) return { si: 0, li: 0 }
    
    for (let si = 0; si < sections.length; si += 1) {
      const lectures = sections[si]?.lectures || []
      if (lectures.length === 0) continue
      for (let li = 0; li < lectures.length; li += 1) {
        if (lectures[li]?.type === 'video') return { si, li }
      }
    }
    return { si: 0, li: 0 }
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO BANNER */}
      <div className="bg-black text-white pt-[100px]">
        <div className="px-6 max-w-[1200px] mx-auto py-16">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white/50 mb-6">
              <Link to="/courses" className="hover:text-[#ceef83] transition-colors">Courses</Link>
              <span>/</span><span>{course.category}</span>
            </nav>
            <div className="flex gap-2 mb-4">
              {course.isBestseller && <span className="px-2 py-0.5 bg-[#ceef83] text-[#151f00] text-[10px] font-bold uppercase">Bestseller</span>}
              <span className="px-2 py-0.5 border border-white/20 text-[10px] font-bold uppercase text-white/70">{course.category}</span>
            </div>
            <h1 className="text-[40px] md:text-[52px] font-black leading-tight tracking-tight mb-4">{course.title}</h1>
            <p className="text-[18px] text-white/70 mb-6 leading-relaxed">{course.subtitle}</p>
            <div className="flex flex-wrap items-center gap-6 text-[14px] mb-8">
              <span className="text-[#ceef83] font-bold text-[16px]">{course.rating?.toFixed(1)}★</span>
              <span className="text-white/50">({course.reviewCount?.toLocaleString()} ratings)</span>
              <span className="text-white/50">•</span>
              <span className="text-white/70">{course.studentCount?.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={course.instructorAvatar} alt={course.instructor} className="w-full h-full object-cover" />
              </div>
              <span className="text-[14px]">By <span className="font-bold text-[#ceef83]">{course.instructor}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="px-6 max-w-[1200px] mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT DETAILS */}
          <div className="flex-1 min-w-0">
            {/* TABS */}
            <div className="border-b border-[#cfc4c5] mb-8">
              <div className="flex gap-8">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab ? 'border-b-2 border-black text-black' : 'text-[#4c4546] hover:text-black'
                    }`}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-[28px] font-black tracking-tight mb-6">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                  {(course.whatYouLearn || []).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#4d6705] text-[20px] mt-0.5">check_circle</span>
                      <span className="text-[15px]">{item}</span>
                    </div>
                  ))}
                </div>
                <h2 className="text-[28px] font-black tracking-tight mb-4">Requirements</h2>
                <ul className="flex flex-col gap-2 mb-10 pl-4">
                  {(course.requirements || []).map((req, i) => (
                    <li key={i} className="text-[15px] flex items-start gap-3"><span className="text-[#4c4546]">—</span>{req}</li>
                  ))}
                </ul>
                <h2 className="text-[28px] font-black tracking-tight mb-4">About This Course</h2>
                <p className="text-[16px] leading-relaxed text-[#4c4546]">{course.description}</p>
              </div>
            )}

            {/* CURRICULUM */}
            {activeTab === 'curriculum' && (
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-[28px] font-black tracking-tight">Course Content</h2>
                    <p className="text-[14px] text-[#4c4546] mt-1">{course.totalLectures} lectures • {course.totalHours}h total</p>
                  </div>
                </div>
                {(course.curriculum || []).map((section, si) => (
                  <div key={si} className="border border-[#cfc4c5] mb-2">
                    <button
                      onClick={() => setOpenSection(openSection === si ? -1 : si)}
                      className="w-full flex justify-between items-center p-4 hover:bg-[#f3f3f4] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] text-[#4c4546]">
                          {openSection === si ? 'expand_less' : 'expand_more'}
                        </span>
                        <span className="text-[15px] font-bold">{section.sectionTitle}</span>
                      </div>
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#4c4546]">
                        {section.lectures?.length} lectures
                      </span>
                    </button>
                    <div className={`accordion-content ${openSection === si ? 'open' : ''}`}>
                      <div className="border-t border-[#cfc4c5]">
                        {(section.lectures || []).map((lec, li) => (
                          <button
                            type="button"
                            key={li}
                            onClick={() => {
                              if (lec.type === 'video') openLessonPlayer(si, li)
                            }}
                            className="w-full text-left flex justify-between items-center px-4 py-3 hover:bg-[#f3f3f4] border-t border-[#cfc4c5] first:border-t-0"
                          >
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-[18px] text-[#4c4546]">
                                {lec.type === 'document' ? 'article' : 'play_circle'}
                              </span>
                              <span className="text-[14px]">{lec.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lec.preview && <span className="text-[11px] px-2 py-0.5 bg-[#ceef83] text-[#151f00] font-bold uppercase">Preview</span>}
                              <span className="text-[12px] text-[#4c4546]">{lec.duration}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INSTRUCTOR */}
            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-[28px] font-black tracking-tight mb-8">Your Instructor</h2>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-[#cfc4c5]">
                    <img src={course.instructorAvatar} alt={course.instructor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-black tracking-tight">{course.instructor}</h3>
                    <div className="flex flex-wrap gap-4 text-[13px] text-[#4c4546] mt-2">
                      <span>⭐ {course.rating?.toFixed(1)} Rating</span>
                      <span>• {course.studentCount?.toLocaleString()} Students</span>
                    </div>
                  </div>
                </div>
                <p className="text-[16px] leading-relaxed text-[#4c4546]">{course.instructorBio}</p>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center gap-8 mb-10">
                  <div className="text-center">
                    <div className="text-[72px] font-black leading-none tracking-tight text-[#4d6705]">{course.rating?.toFixed(1)}</div>
                    <div className="text-[20px] mt-1">{'★'.repeat(Math.round(course.rating || 0))}</div>
                    <div className="text-[13px] text-[#4c4546] mt-1">Course Rating</div>
                  </div>
                  <div className="flex-1">
                    {/* PLACEHOLDER: Star distribution bars — hardcoded percentages */}
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-3 mb-2">
                        <div className="flex-1 bg-[#eeeeee] h-2">
                          <div className="bg-[#4d6705] h-full" style={{ width: star === 5 ? '78%' : star === 4 ? '16%' : star === 3 ? '4%' : '2%' }}></div>
                        </div>
                        <span className="text-[12px] font-bold w-4">{star}★</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {(course.reviews || []).map((rev, i) => (
                    <div key={i} className="border-b border-[#cfc4c5] pb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#e8e8e8]">
                          {rev.avatar && <img src={rev.avatar} alt={rev.user} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold">{rev.user}</div>
                          <div className="text-[12px] text-[#4c4546]">{'★'.repeat(rev.rating)}</div>
                        </div>
                      </div>
                      <p className="text-[15px] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: STICKY PURCHASE */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="lg:sticky lg:top-[100px] border border-black overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={typeof course.thumbnail === 'object' ? course.thumbnail?.secure_url : course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <p className="text-[13px] text-[#4c4546]">Rating {course.rating?.toFixed(1)} ({course.reviewCount?.toLocaleString()} reviews)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const first = getFirstVideoLocation()
                    openLessonPlayer(first.si, first.li)
                  }}
                  className="w-full py-4 bg-[#ceef83] text-[#151f00] text-[14px] font-black uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all mb-3"
                >
                  Start Learning
                </button>
                {isAuthenticated && user?.role === 'student' && (
                  <button
                    onClick={async () => {
                      const cId = String(course._id)
                      const isSaved = savedIds.includes(cId)
                      const ids = await toggleSavedCourse(cId, isSaved)
                      setSavedIds(ids)
                    }}
                    className="w-full py-4 border border-black text-[14px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all mb-6"
                  >
                    {savedIds.includes(String(course._id)) ? 'Saved' : 'Save Course'}
                  </button>
                )}
                <div className="border-t border-[#cfc4c5] pt-6">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest mb-4">This Course Includes:</h4>
                  <ul className="flex flex-col gap-3">
                    {[
                      ['play_circle', `${course.totalHours}h on-demand video`],
                      ['article', course.pdf?.secure_url ? '1 downloadable resource' : 'Course materials'],
                      ['all_inclusive', 'Full lifetime access'],
                      ['workspace_premium', 'Certificate of completion'],
                    ].map(([icon, text]) => (
                      <li key={text} className="flex items-center gap-3 text-[14px]">
                        <span className="material-symbols-outlined text-[18px] text-[#4c4546]">{icon}</span>{text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-[#cfc4c5] py-16 px-6 max-w-[1200px] mx-auto">
          <h2 className="text-[32px] font-black tracking-tight mb-8">Related Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
