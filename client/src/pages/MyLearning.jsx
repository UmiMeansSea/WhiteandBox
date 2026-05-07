import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'
import { fetchSavedIds, getLocalSavedIds } from '../lib/learning'

export default function MyLearning() {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState({ continueRows: [], suggestions: [], savedIds: [], savedCourses: [] })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [dashboardRes, savedIdsRes, coursesRes] = await Promise.all([
          api.get('/api/learning/dashboard').catch(() => ({ data: null })),
          fetchSavedIds(),
          api.get('/api/courses', { params: { page: 1, limit: 200 } }).catch(() => ({ data: { courses: [] } })),
        ])
        if (cancelled) return

        const allCourses = coursesRes.data?.courses || []
        const byId = new Map(allCourses.map((c) => [String(c._id), c]))

        const serverDash = dashboardRes.data || { continueRows: [], suggestions: [], savedIds: [], savedCourses: [] }
        const mergedSavedIds = Array.from(new Set([...(serverDash.savedIds || []), ...(savedIdsRes || getLocalSavedIds())].map(String)))
        const mergedSavedCourses = (serverDash.savedCourses?.length ? serverDash.savedCourses : mergedSavedIds.map((id) => byId.get(id)).filter(Boolean))

        setDashboard({
          continueRows: serverDash.continueRows || [],
          suggestions: (serverDash.suggestions?.length ? serverDash.suggestions : allCourses.slice(0, 8)),
          savedIds: mergedSavedIds,
          savedCourses: mergedSavedCourses,
        })
      } catch {
        if (!cancelled) {
          const localIds = getLocalSavedIds()
          setDashboard({ continueRows: [], suggestions: [], savedIds: localIds, savedCourses: [] })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const continueCards = useMemo(() => dashboard.continueRows || [], [dashboard.continueRows])
  const savedCourses = useMemo(() => dashboard.savedCourses || [], [dashboard.savedCourses])
  const suggestions = useMemo(() => dashboard.suggestions || [], [dashboard.suggestions])

  const avgProgress = useMemo(() => {
    if (!continueCards.length) return 0
    return Math.round(continueCards.reduce((acc, c) => acc + Number(c.progressPercent || 0), 0) / continueCards.length)
  }, [continueCards])

  if (!isAuthenticated) return <Navigate to="/signin" replace />
  if (user?.role !== 'student') return <Navigate to="/" replace />

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      <main className="mt-[80px] max-w-[1440px] mx-auto px-6 pb-24">
        <section className="py-16 border-b border-[#cfc4c5] mb-8">
          <h1 className="text-[48px] font-black tracking-tight mb-2">My Learning</h1>
          <p className="text-[18px] text-[#4c4546] max-w-2xl">Track your progress, resume lessons, and manage saved courses.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-black bg-[#ceef83]">
            <div className="text-[12px] font-bold uppercase tracking-widest text-[#151f00]/70 mb-2">In Progress</div>
            <div className="text-[40px] font-black">{continueCards.length}</div>
          </div>
          <div className="p-6 border border-[#cfc4c5] bg-white">
            <div className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Saved Courses</div>
            <div className="text-[40px] font-black">{savedCourses.length}</div>
          </div>
          <div className="p-6 border border-[#cfc4c5] bg-white">
            <div className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-2">Avg Progress</div>
            <div className="text-[40px] font-black">{avgProgress}%</div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-[32px] font-black tracking-tight">Continue where you left off</h2>
            <Link to="/courses" className="text-[12px] font-bold uppercase tracking-widest border-b border-black">Browse</Link>
          </div>
          {loading ? (
            <div className="text-[14px] text-[#4c4546]">Loading…</div>
          ) : continueCards.length === 0 ? (
            <div className="border border-[#cfc4c5] bg-white p-8">
              <p className="text-[16px] text-[#4c4546] mb-4">No lessons started yet. Here are recommended courses to begin:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestions.slice(0, 3).map((c) => <CourseCard key={c._id} course={c} />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {continueCards.map((row) => (
                <Link key={row.courseId} to={`/courses/${row.courseId}`} className="border border-[#cfc4c5] bg-white p-6 hover:bg-[#f3f3f4] transition-all">
                  <h3 className="text-[20px] font-bold mb-1">{row.course?.title || row.courseTitle}</h3>
                  <p className="text-[13px] text-[#4c4546] mb-4">Keep learning from your latest session.</p>
                  <div className="w-full bg-[#eeeeee] h-1 mb-2">
                    <div className="bg-[#4d6705] h-1" style={{ width: `${Math.max(0, Math.min(100, Number(row.progressPercent || 0)))}%` }} />
                  </div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546]">{row.progressPercent}% complete</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-[32px] font-black tracking-tight mb-6">Saved Courses</h2>
          {savedCourses.length === 0 ? (
            <div className="border border-[#cfc4c5] p-8 bg-white">
              <p className="text-[16px] text-[#4c4546]">No saved courses yet. Save courses from the homepage or browse page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedCourses.map((course) => <CourseCard key={course._id} course={course} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

