import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export default function AdminShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await logout()
    navigate('/signin')
  }

  const isAdminHome = location.pathname === '/admin'
  const myCoursesTo = isAdminHome ? '/admin#my-courses' : '/admin#my-courses'

  const navLinkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-none text-[14px] transition-all',
      isActive ? 'bg-black text-white font-bold' : 'text-[#4c4546] hover:bg-[#e8e8e8] font-semibold'
    )

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* ── SIDEBAR (consistent across admin pages) ── */}
      <aside className="hidden md:flex flex-col h-full py-6 fixed left-0 top-0 bottom-0 w-64 bg-[#f3f3f4] border-r border-[#cfc4c5] z-50">
        {/* Logo + User */}
        <div className="px-6 mb-2">
          <Link to="/" className="text-[28px] font-black tracking-tight text-black">EduPro</Link>
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#4c4546] mt-1">Admin Panel</p>
        </div>

        {/* Profile chip */}
        <div className="mx-4 mb-6 p-3 border border-[#cfc4c5] bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#e8e8e8] flex-shrink-0 border border-[#cfc4c5]">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name || 'Admin'} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-[12px] font-black text-[#4c4546]">{(user?.name || 'A').slice(0, 1)}</div>
            }
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold truncate">{user?.name || 'Admin'}</div>
            <div className="text-[11px] text-[#4c4546] truncate">{user?.email}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-grow px-2">
          <NavLink to="/admin" className={navLinkClass} end>
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </NavLink>

          <NavLink to="/admin/courses" className={navLinkClass}>
            <span className="material-symbols-outlined text-[20px]">upload</span>
            Upload / Teach
          </NavLink>

          <a
            href={myCoursesTo}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-[14px] rounded-none transition-all',
              isAdminHome ? 'text-[#4c4546] hover:bg-[#e8e8e8] font-semibold' : 'text-[#4c4546] hover:bg-[#e8e8e8] font-semibold'
            )}
          >
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            My Courses
          </a>
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 mt-auto">
          <Link
            to="/admin/courses?tab=create"
            className="w-full mb-3 flex items-center justify-center gap-2 py-3 bg-[#ceef83] text-[#151f00] text-[13px] font-black uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> New Course
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-3 border border-black text-[13px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow md:ml-64 bg-[#f9f9f9] px-6 md:px-16 py-6 max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  )
}

