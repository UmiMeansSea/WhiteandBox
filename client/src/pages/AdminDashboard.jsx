// =============================================================================
// Admin Dashboard — converted from provided HTML to React
// PLACEHOLDER data is imported from data/placeholder.js
// Sidebar has: Dashboard (active) + Upload New Course (links to /publish)
// Main content: Platform stats, engagement chart, My Courses table, Recent Enrollments
// =============================================================================
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PLACEHOLDER_MY_COURSES, PLACEHOLDER_ADMIN_STATS } from '../data/placeholder'
import AdminShell from '../components/AdminShell'
import api from '../lib/api'

// PLACEHOLDER: Recent enrollments data — replace with: GET /api/admin/enrollments/recent
const RECENT_ENROLLMENTS = [
  { initials: 'EM', name: 'Elena Martinez', time: '2h ago', course: 'Mastering Minimalist Spatial Design', status: 'Verified' },
  { initials: 'JK', name: 'Julian Kang', time: '5h ago', course: 'Editorial Photography for Architects', status: 'Verified' },
  { initials: 'ST', name: 'Sarah Thompson', time: '12h ago', course: 'Brand Identity Design', status: 'Verified' },
  { initials: 'LH', name: 'Liam Hughes', time: '1d ago', course: 'Full-Stack Web Development Bootcamp', status: 'Verified' },
  { initials: 'AP', name: 'Amara Patel', time: '1d ago', course: 'Startup Business Strategy', status: 'Pending' },
]

// PLACEHOLDER: Top performing courses — replace with: GET /api/admin/courses/top
const TOP_COURSES = [
  { title: 'Full-Stack Web Development Bootcamp', students: 38900, pct: 95 },
  { title: 'Mastering Minimalist Spatial Design', students: 12840, pct: 78 },
  { title: 'Brand Identity Design: From Strategy to System', students: 22400, pct: 65 },
  { title: 'Startup Business Strategy', students: 6700, pct: 50 },
]

// PLACEHOLDER: Engagement bar chart heights — replace with: GET /api/admin/analytics/daily
const BAR_HEIGHTS = [40,55,45,70,90,60,50,65,75,80,45,60,85,70,55,95,65,40,60,100,80,70,50,60,75,85,40,55,65,75]

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('day') // PLACEHOLDER: chart tab
  // PLACEHOLDER: My Courses — replace with: api.get('/api/users/me/courses')
  const [myCourses] = useState(PLACEHOLDER_MY_COURSES)
  // PLACEHOLDER: stats — replace with: api.get('/api/admin/stats')
  const stats = PLACEHOLDER_ADMIN_STATS
  const [sessions, setSessions] = useState([])

  async function handleLogout() {
    await logout()
    navigate('/signin')
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/api/sessions/admin/recent', { params: { limit: 10 } })
        if (!cancelled) setSessions(res.data.sessions || [])
      } catch {
        if (!cancelled) setSessions([])
      }
    })()
    return () => { cancelled = true }
  }, [])

  function fmtMs(ms) {
    const s = Math.max(0, Math.floor((Number(ms) || 0) / 1000))
    const m = Math.floor(s / 60)
    const r = s % 60
    if (m <= 0) return `${r}s`
    return `${m}m ${r.toString().padStart(2, '0')}s`
  }

  return (
    <AdminShell>
      <div id="overview">

        {/* Header */}
        <header className="mb-16 pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[48px] md:text-[64px] font-black tracking-[-0.04em] leading-tight text-black mb-2">
                Admin Dashboard
              </h2>
              <p className="text-[18px] text-[#4c4546] max-w-2xl leading-relaxed">
                Platform Performance &amp; Engagement. Monitor real-time growth metrics and learner interactions across the global marketplace.
              </p>
            </div>
            {/* Mobile logout */}
            <div className="flex items-center gap-3 md:hidden">
              <button onClick={handleLogout} className="px-4 py-2 border border-black text-[12px] font-bold uppercase">Log Out</button>
            </div>
          </div>
        </header>

        {/* ── METRICS — no revenue/earnings ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* PLACEHOLDER: metric values */}
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Total Students Enrolled</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">{stats.totalUsers.toLocaleString()}</span>
            <div className="mt-4 flex items-center text-[#4d6705] text-[13px] font-bold">
              <span className="material-symbols-outlined text-[16px] mr-1">arrow_upward</span>
              12% Increase
            </div>
          </div>
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Total Courses Published</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">{stats.totalCourses.toLocaleString()}</span>
            <div className="mt-4 flex items-center text-[#4d6705] text-[13px] font-bold">
              <span className="material-symbols-outlined text-[16px] mr-1">arrow_upward</span>
              8.4% Increase
            </div>
          </div>
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Avg. Time Spent on Site</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">42<span className="text-[40px]">m</span></span>
            <div className="mt-4 flex items-center text-[#ba1a1a] text-[13px] font-bold">
              <span className="material-symbols-outlined text-[16px] mr-1">arrow_downward</span>
              2.1% Decrease
            </div>
          </div>
        </section>

        {/* ── ENGAGEMENT CHART + PULSE ── */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Chart */}
          <div className="md:col-span-8 border border-black p-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-[32px] font-black tracking-tight mb-1">Time Spent on Website</h3>
                <p className="text-[14px] text-[#4c4546]">Active user engagement trends (Last 30 Days)</p>
              </div>
              <div className="flex gap-4">
                {['Day','Week','Month'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                    className={`text-[12px] font-bold uppercase transition-all ${activeTab === t.toLowerCase() ? 'border-b-2 border-black' : 'text-[#4c4546] hover:text-black'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {/* PLACEHOLDER: chart bars — replace with real chart library (Recharts/Chart.js) */}
            <div className="relative h-64 w-full flex items-end gap-[3px]">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full">
                  <div
                    className={`w-full transition-all duration-500 ${h === 100 || h === 90 ? 'bg-[#ceef83]' : 'bg-black'}`}
                    style={{ height: `${h}%` }}
                    title={`Day ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#4c4546] mt-2 font-bold uppercase tracking-wider">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
            </div>
          </div>

          {/* Pulse cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-grow border border-black p-6 bg-black text-white">
              <h4 className="text-[28px] font-black tracking-tight mb-2">Platform Pulse</h4>
              <p className="text-[14px] text-white/70 mb-8 leading-relaxed">Users are most active during early evening EST hours.</p>
              {/* PLACEHOLDER: live user count */}
              <div className="flex items-center gap-4 border-t border-white/20 pt-4">
                <span className="text-[12px] font-bold uppercase tracking-widest text-white/60">Live Users</span>
                <span className="text-[#ceef83] text-[32px] font-black">1,240</span>
              </div>
            </div>
            <div className="flex-grow border border-black p-6">
              <div className="text-[12px] font-bold uppercase tracking-widest mb-1">Moderation Queue</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[48px] font-black leading-none">{stats.moderationQueue}</span>
                <span className="text-[13px] text-[#4c4546]">pending reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STUDENT SESSIONS ── */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-[32px] font-black tracking-tight">Student Sessions</h3>
              <p className="text-[14px] text-[#4c4546] mt-1">Tracked via cookie-based sessions (time spent per course).</p>
            </div>
          </div>

          <div className="border border-black overflow-x-auto bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black bg-black text-white">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Student</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Course</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Time Spent</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[14px] text-[#4c4546]">
                      No tracked sessions yet. Student time will appear after they open a course and stay for a few seconds.
                    </td>
                  </tr>
                ) : (
                  sessions.map((s, i) => (
                    <tr key={`${s.sessionId}-${i}`} className="border-b border-[#cfc4c5] last:border-b-0 hover:bg-[#f3f3f4] transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#e8e8e8] flex items-center justify-center font-black text-[13px] border border-[#cfc4c5]">
                            {(s.studentName || 'S').slice(0, 1).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] font-bold truncate">{s.studentName || 'Student'}</div>
                            <div className="text-[11px] text-[#4c4546] truncate">{s.studentEmail || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#4c4546]">{s.courseTitle || s.courseId}</td>
                      <td className="px-6 py-4 text-right text-[14px] font-bold">{fmtMs(s.timeSpentMs)}</td>
                      <td className="px-6 py-4 text-right text-[12px] text-[#4c4546] font-bold uppercase">
                        {s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── MY COURSES ── */}
        <section className="mb-16" id="my-courses">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[32px] font-black tracking-tight">My Courses</h3>
            <Link to="/admin/courses?tab=create"
              className="flex items-center gap-2 px-6 py-3 bg-[#ceef83] text-[#151f00] text-[13px] font-black uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all">
              <span className="material-symbols-outlined text-[16px]">add</span> Upload New
            </Link>
          </div>
          {/* PLACEHOLDER: courses table — replace with api.get('/api/users/me/courses') */}
          <div className="border border-black overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black bg-black text-white">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Course</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Category</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Students</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Rating</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {myCourses.map((c, i) => (
                  <tr key={c._id} className={`border-b border-[#cfc4c5] hover:bg-[#f3f3f4] transition-all ${i === myCourses.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-[#e8e8e8] overflow-hidden flex-shrink-0 border border-[#cfc4c5]">
                          <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[14px] font-bold line-clamp-2 max-w-[220px]">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#4c4546]">{c.category}</td>
                    <td className="px-6 py-4 text-[14px] font-bold">{c.studentCount ? c.studentCount.toLocaleString() : '—'}</td>
                    {/* Revenue column removed */}
                    <td className="px-6 py-4 text-[14px] font-bold text-[#4d6705]">{c.rating ? `${c.rating} ★` : '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'published' ? 'bg-[#ceef83] text-[#151f00]' : 'border border-[#cfc4c5] text-[#4c4546]'
                      }`}>
                        {c.status === 'review' ? 'In Review' : 'Published'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <Link to={`/courses/${c._id}`}
                          className="text-[12px] font-bold border-b border-[#cfc4c5] hover:border-black transition-colors">
                          View
                        </Link>
                        <span className="text-[#cfc4c5]">|</span>
                        {/* PLACEHOLDER: Edit links to /publish — wire to /publish/:id when backend ready */}
                        <Link to="/publish"
                          className="text-[12px] font-bold border-b border-[#cfc4c5] hover:border-black transition-colors">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── RECENT ENROLLMENTS + TOP PERFORMANCE ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start mb-16">
          {/* Recent Enrollments */}
          <div className="md:col-span-7">
            <h3 className="text-[32px] font-black tracking-tight mb-8">Recent Enrollments</h3>
            <div className="w-full">
              <div className="grid grid-cols-12 border-b border-black pb-4">
                <div className="col-span-5 text-[11px] font-bold uppercase tracking-widest">Student</div>
                <div className="col-span-5 text-[11px] font-bold uppercase tracking-widest">Course</div>
                <div className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-right">Status</div>
              </div>
              {/* PLACEHOLDER: enrollment rows */}
              {RECENT_ENROLLMENTS.map((e, i) => (
                <div key={i} className="grid grid-cols-12 py-5 border-b border-[#cfc4c5] items-center">
                  <div className="col-span-5 flex items-center">
                    <div className="w-10 h-10 bg-[#e8e8e8] flex items-center justify-center font-black text-[13px] mr-4 flex-shrink-0 border border-[#cfc4c5]">
                      {e.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold">{e.name}</p>
                      <p className="text-[11px] text-[#4c4546]">Joined {e.time}</p>
                    </div>
                  </div>
                  <div className="col-span-5 text-[14px] text-[#4c4546] pr-4 line-clamp-2">{e.course}</div>
                  <div className="col-span-2 text-right">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold ${
                      e.status === 'Verified' ? 'border border-black' : 'border border-[#cfc4c5] text-[#4c4546]'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performance */}
          <div className="md:col-span-5">
            <h3 className="text-[32px] font-black tracking-tight mb-8">Top Performance</h3>
            <div className="flex flex-col gap-8">
              {/* PLACEHOLDER: top course bars */}
              {TOP_COURSES.map((c, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[12px] font-bold uppercase tracking-wider max-w-[200px] leading-tight">{c.title}</span>
                    <span className="text-[14px] text-[#4c4546] flex-shrink-0 ml-2">{c.students.toLocaleString()} students</span>
                  </div>
                  <div className="w-full h-2 bg-[#e8e8e8]">
                    <div className="bg-black h-full transition-all duration-700" style={{ width: `${c.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optimization tip */}
            <div className="mt-10 border border-black p-6">
              <h5 className="text-[12px] font-bold uppercase tracking-widest mb-3">Optimization Tip</h5>
              <p className="text-[14px] text-[#4c4546] leading-relaxed">
                Course completion rates are highest for modules under 15 minutes. Consider suggesting content fragmentation to instructors.
              </p>
              <a href="#" className="mt-5 inline-block text-[12px] font-bold uppercase tracking-widest border-b-2 border-black">
                View Full Report
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 border-t border-[#cfc4c5] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[28px] font-black text-black">EduPro</span>
          <div className="flex flex-wrap justify-center gap-6">
            {['Terms of Use','Privacy Policy','Cookie Settings','Sitemap','Help Center'].map(l => (
              <a key={l} href="#" className="text-[12px] text-[#4c4546] hover:text-black font-bold uppercase tracking-widest transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-[12px] text-[#4c4546] font-bold">© 2024 EduPro Global. All rights reserved.</div>
        </footer>
      </div>
    </AdminShell>
  )
}
