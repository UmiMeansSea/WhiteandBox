import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')

  async function handleLogout() {
    try { await logout() } catch { /* ignore */ }
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = searchQuery.trim()
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses')
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <header style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="bg-white border-b border-[#cfc4c5] fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-center w-full px-6 max-w-[1200px] mx-auto h-[70px] gap-6">

          {/* Logo */}
          <Link to="/" className="text-[26px] font-black text-black tracking-tight flex-shrink-0">EduPro</Link>

          {/* Centre search bar — always visible */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 flex items-center border border-[#d1d1d1] bg-white hover:border-[#999] focus-within:border-black transition-colors"
          >
            <button
              type="submit"
              aria-label="Search"
              className="pl-3 pr-2 flex items-center text-[#888] hover:text-black transition-colors flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input
              type="text"
              placeholder="Search for courses, skills, or mentors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 py-2.5 pr-3 text-[13px] outline-none bg-transparent text-black placeholder-[#aaa]"
            />
          </form>

          {/* Right CTA area */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Admin centre links */}
            {isAdmin && (
              <>
                <NavLink to="/admin/courses" className={({ isActive }) =>
                  `text-[13px] font-semibold transition-colors hover:text-black ${isActive ? 'text-black border-b-2 border-black pb-0.5' : 'text-[#4c4546]'}`
                }>Teach</NavLink>
                <NavLink to="/admin" className={({ isActive }) =>
                  `text-[13px] font-semibold transition-colors hover:text-black ${isActive ? 'text-black border-b-2 border-black pb-0.5' : 'text-[#4c4546]'}`
                }>Dashboard</NavLink>
              </>
            )}

            {!isStudent && (
              <Link to="/courses" className="hidden md:inline-flex px-5 py-2 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all">
                Browse
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link to="/signin" className="px-5 py-2 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2 bg-[#ceef83] text-[#151f00] text-[12px] font-bold uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link to="/admin" className="px-5 py-2 bg-[#ceef83] text-[#151f00] text-[12px] font-bold uppercase tracking-widest border border-black hover:bg-[#b2d26a] transition-all">
                    Dashboard
                  </Link>
                )}
                {isStudent && (
                  <Link to="/my-learning" className="px-5 py-2 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all">
                    My Learning
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 border border-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#e8e8e8] transition-all"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-full bg-[#e8e8e8] border border-[#cfc4c5] overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-[#4c4546]">
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
