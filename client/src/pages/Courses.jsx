import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import api from '../lib/api'
import { useAuth } from '../context/useAuth'
import { fetchSavedIds, toggleSavedCourse } from '../lib/learning'

const CATEGORIES = ['All Topics', 'Architecture', 'Branding', 'UX Design', 'Development', 'Photography', 'Graphic Design', 'Business', 'Music', '3D Design', 'UX Research']
const PAGE_SIZE = 9

export default function Courses() {
  const { isAuthenticated, user } = useAuth()
  const isStudent = isAuthenticated && user?.role === 'student'
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  // initialise search from ?q= param (set by Navbar search)
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [courses, setCourses] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState([])

  const activeCategory = searchParams.get('category') || 'All Topics'

  // Sync search input when URL ?q= changes (e.g. navigating from Navbar)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearch(q)
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) setLoading(true) })
    ;(async () => {
      try {
        const res = await api.get('/api/courses', {
          params: { category: activeCategory, q: search, page, limit: PAGE_SIZE },
        })
        if (cancelled) return
        setCourses(res.data.courses || [])
        setTotal(res.data.total ?? 0)
      } catch {
        if (cancelled) return
        setCourses([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [activeCategory, search, page])

  useEffect(() => {
    if (!isStudent) return
    let cancelled = false
    ;(async () => {
      const ids = await fetchSavedIds()
      if (!cancelled) setSavedIds(ids)
    })()
    return () => { cancelled = true }
  }, [isStudent])

  async function toggleSave(course) {
    if (!isStudent) return
    const id = String(course._id)
    const isSaved = savedIds.includes(id)
    const ids = await toggleSavedCourse(id, isSaved)
    setSavedIds(ids)
  }

  const pages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])

  function setCategory(cat) {
    if (cat === 'All Topics') setSearchParams({})
    else setSearchParams({ category: cat })
    setPage(1)
  }

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <Navbar />

      {/* PAGE HEADER */}
      <section className="pt-[120px] pb-12 px-6 max-w-[1200px] mx-auto border-b border-[#cfc4c5]">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546]">{total} Courses Available</span>
            <h1 className="text-[48px] md:text-[64px] font-black tracking-tight leading-none mt-1">Browse All Courses</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c4546] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="pl-10 pr-4 py-2 border border-[#cfc4c5] bg-[#f3f3f4] text-[14px] focus:outline-none focus:border-black w-[240px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 max-w-[1200px] mx-auto py-8 flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[240px] flex-shrink-0">
          <div className="lg:sticky lg:top-[100px]">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Filter By Category</h3>
            <div className="flex flex-col gap-1.5 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left px-4 py-2.5 border text-[14px] font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-black text-white border-black'
                      : 'border-[#cfc4c5] hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Rating</h3>
            <div className="flex flex-col gap-2">
              {['All Ratings', '4.5★ & Above', '4.0★ & Above'].map((r, i) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="rating" defaultChecked={i === 0} className="w-4 h-4 accent-black" />
                  <span className="text-[14px]">{r}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* COURSE GRID */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-[64px] text-[#cfc4c5]">hourglass_empty</span>
              <p className="text-[18px] font-bold mt-4">Loading courses</p>
              <p className="text-[14px] text-[#4c4546] mt-2">Fetching the latest curriculum…</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-[64px] text-[#cfc4c5]">search_off</span>
              <p className="text-[18px] font-bold mt-4">No courses found</p>
              <p className="text-[14px] text-[#4c4546] mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard
                  key={course._id}
                  course={course}
                  showSave={isStudent}
                  isSaved={savedIds.includes(String(course._id))}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {total > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-10 h-10 border border-[#cfc4c5] flex items-center justify-center hover:bg-[#e8e8e8] transition-all text-[13px] font-bold disabled:opacity-40">←</button>
              {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center text-[13px] font-bold transition-all ${
                    page === p ? 'bg-black text-white' : 'border border-[#cfc4c5] hover:bg-[#e8e8e8]'
                  }`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total}
                className="w-10 h-10 border border-[#cfc4c5] flex items-center justify-center hover:bg-[#e8e8e8] transition-all text-[13px] font-bold disabled:opacity-40">→</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
