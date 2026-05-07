// Dashboard.jsx — Admin-only view (redirects non-admins to home)
// All teacher/instructor/revenue/earnings content removed.
// PLACEHOLDER data imported from data/placeholder.js
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  // Only admin can access this route
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />
  // Keep a single admin dashboard entry point for a consistent left panel
  return <Navigate to="/admin" replace />
}
