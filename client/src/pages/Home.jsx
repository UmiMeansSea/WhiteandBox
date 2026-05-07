import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'
import { fetchSavedIds, toggleSavedCourse } from '../lib/learning'

const CATEGORIES = ['Data Science', 'Design', 'Marketing', 'Development', 'Business', 'Personal Development']

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const isStudent = isAuthenticated && user?.role === 'student'
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState([])
  const [dashboard, setDashboard] = useState({ continueRows: [], suggestions: [] })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/api/courses', { params: { page: 1, limit: 12 } })
        if (!cancelled) setCourses(res.data.courses || [])
      } catch {
        if (!cancelled) setCourses([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isStudent) return
    let cancelled = false
    ;(async () => {
      try {
        const [savedRes, dashRes] = await Promise.all([
          fetchSavedIds(),
          api.get('/api/learning/dashboard'),
        ])
        if (cancelled) return
        setSavedIds(savedRes || [])
        setDashboard({
          continueRows: dashRes.data.continueRows || [],
          suggestions: dashRes.data.suggestions || [],
        })
      } catch {
        if (!cancelled) {
          setSavedIds([])
          setDashboard({ continueRows: [], suggestions: [] })
        }
      }
    })()
    return () => { cancelled = true }
  }, [isStudent])

  async function toggleSave(course) {
    if (!isStudent) return
    const id = String(course._id)
    const currentlySaved = savedIds.includes(id)
    const ids = await toggleSavedCourse(id, currentlySaved)
    setSavedIds(ids)
  }

  const continueCards = useMemo(() => dashboard.continueRows.slice(0, 2), [dashboard.continueRows])
  const gridCourses = useMemo(() => courses.slice(0, 8), [courses])
  const fallbackSuggestions = useMemo(() => dashboard.suggestions.slice(0, 2), [dashboard.suggestions])

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="bg-[#f9f9f9]">
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      <main className="mt-[80px] max-w-[1440px] mx-auto px-6 pb-20">
        <section className="py-16 border-b border-[#cfc4c5] mb-8">
          <h1 className="text-[48px] font-black tracking-tight uppercase mb-3">What will you learn today?</h1>
          <p className="text-[18px] text-[#4c4546] max-w-3xl">Browse our professional course catalog and keep building your skills.</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat} to={`/courses?category=${encodeURIComponent(cat)}`} className="px-3 py-2 border border-[#7e7576] text-[12px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all">
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {isStudent && (
          <section className="py-12 border-b border-[#cfc4c5] mb-8">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-[32px] font-black tracking-tight uppercase">Welcome back! Continue where you left off</h2>
              <Link to="/my-learning" className="text-[12px] font-bold uppercase tracking-widest border-b border-black">View all my courses</Link>
            </div>
            {continueCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {continueCards.map((row) => (
                  <Link key={row.courseId} to={`/courses/${row.courseId}`} className="bg-[#f3f3f4] border border-[#cfc4c5] p-6 hover:bg-[#e8e8e8] transition-all">
                    <h3 className="text-[20px] font-bold mb-1">{row.course?.title || row.courseTitle}</h3>
                    <p className="text-[13px] text-[#4c4546] mb-4">Resume your latest lesson.</p>
                    <div className="w-full bg-[#e2e2e2] h-1 mb-2"><div className="bg-[#4d6705] h-1" style={{ width: `${Math.max(0, Math.min(100, Number(row.progressPercent || 0)))}%` }} /></div>
                    <p className="text-[12px] uppercase tracking-widest font-bold">{row.progressPercent}% complete</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fallbackSuggestions.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    showSave
                    isSaved={savedIds.includes(String(course._id))}
                    onToggleSave={toggleSave}
                    ctaLabel="Start Course"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-[14px] text-[#4c4546]">Loading courses…</div>
          ) : (
            gridCourses.map((course, i) => (
              <div key={course._id} className={i === 0 || i === 5 ? 'lg:col-span-2' : ''}>
                <CourseCard
                  course={course}
                  showSave={isStudent}
                  isSaved={savedIds.includes(String(course._id))}
                  onToggleSave={toggleSave}
                />
              </div>
            ))
          )}
        </section>

        <div className="mt-16 flex justify-center">
          <Link to="/courses" className="px-8 py-3 border border-black text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
            Explore More Courses
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
