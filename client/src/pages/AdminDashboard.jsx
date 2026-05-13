import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AdminShell from '../components/AdminShell'
import api from '../lib/api'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('day')
  const [myCourses, setMyCourses] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    moderationQueue: 0
  })
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  async function handleLogout() {
    await logout()
    navigate('/signin')
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [coursesRes, statsRes, sessionsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/admin/stats').catch(() => ({ data: { stats: { totalUsers: 0, totalCourses: 0, moderationQueue: 0 } } })),
          api.get('/api/sessions/admin/recent', { params: { limit: 10 } }).catch(() => ({ data: { sessions: [] } }))
        ])
        
        if (cancelled) return

        const allCourses = coursesRes.data.courses || []
        setMyCourses(allCourses.slice(0, 5)) 
        setStats(statsRes.data.stats || {
          totalUsers: 0,
          totalCourses: allCourses.length,
          moderationQueue: 0
        })
        setSessions(sessionsRes.data.sessions || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        if (!cancelled) setLoading(false)
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

  const BAR_HEIGHTS = [40,55,45,70,90,60,50,65,75,80,45,60,85,70,55,95,65,40,60,100,80,70,50,60,75,85,40,55,65,75]

  return (
    <AdminShell>
      <div id="overview">
        <header className="mb-16 pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[48px] md:text-[64px] font-black tracking-[-0.04em] leading-tight text-black mb-2">
                Admin Dashboard
              </h2>
              <p className="text-[18px] text-[#4c4546] max-w-2xl leading-relaxed">
                Platform Performance & Engagement. Monitor real-time growth metrics and learner interactions.
              </p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Total Students Enrolled</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">{stats.totalUsers.toLocaleString()}</span>
          </div>
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Total Courses Published</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">{stats.totalCourses.toLocaleString()}</span>
          </div>
          <div className="border border-black p-6 flex flex-col justify-between">
            <span className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mb-4">Moderation Queue</span>
            <span className="text-[72px] font-black leading-none tracking-[-0.04em]">{stats.moderationQueue}</span>
          </div>
        </section>

        <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 border border-black p-6">
            <div className="flex justify-between items-end mb-10">
              <h3 className="text-[32px] font-black tracking-tight mb-1">Time Spent on Website</h3>
              <div className="flex gap-4">
                {['Day','Week','Month'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
                    className={`text-[12px] font-bold uppercase transition-all ${activeTab === t.toLowerCase() ? 'border-b-2 border-black' : 'text-[#4c4546] hover:text-black'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-64 w-full flex items-end gap-[3px]">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full">
                  <div className={`w-full transition-all duration-500 ${h >= 90 ? 'bg-[#ceef83]' : 'bg-black'}`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-grow border border-black p-6 bg-black text-white">
              <h4 className="text-[28px] font-black tracking-tight mb-2">Live Status</h4>
              <div className="flex items-center gap-4 border-t border-white/20 pt-4">
                <span className="text-[12px] font-bold uppercase tracking-widest text-white/60">Live Users</span>
                <span className="text-[#ceef83] text-[32px] font-black">124</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-[32px] font-black tracking-tight mb-8">Active Learning Sessions</h3>
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
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-[14px]">No active sessions found.</td></tr>
                ) : (
                  sessions.map((s, i) => (
                    <tr key={i} className="border-b border-[#cfc4c5] hover:bg-[#f3f3f4]">
                      <td className="px-6 py-4 font-bold text-[14px]">{s.studentName || 'Student'}</td>
                      <td className="px-6 py-4 text-[14px]">{s.courseTitle}</td>
                      <td className="px-6 py-4 text-right font-bold">{fmtMs(s.timeSpentMs)}</td>
                      <td className="px-6 py-4 text-right text-[12px] uppercase">{s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleTimeString() : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[32px] font-black tracking-tight">Recent Courses</h3>
            <Link to="/publish" className="px-6 py-3 bg-[#ceef83] text-[#151f00] text-[13px] font-black uppercase tracking-widest border border-black hover:bg-[#b2d26a]">
              New Course
            </Link>
          </div>
          <div className="border border-black overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black bg-black text-white">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Course</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Category</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {myCourses.map((c) => (
                  <tr key={c._id} className="border-b border-[#cfc4c5] hover:bg-[#f3f3f4]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 bg-[#e8e8e8] border border-[#cfc4c5] overflow-hidden flex-shrink-0">
                          {c.thumbnail && <img src={typeof c.thumbnail === 'object' ? c.thumbnail.secure_url : c.thumbnail} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-[14px] font-bold">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#4c4546]">{c.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase ${c.status === 'published' ? 'bg-[#ceef83]' : 'border border-[#cfc4c5]'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/courses/${c._id}`} className="text-[12px] font-bold border-b border-black">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
