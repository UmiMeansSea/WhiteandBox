import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function AdminRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#4c4546]">Loading...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

