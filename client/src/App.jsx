import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import CoursePlayer from './pages/CoursePlayer'
import Dashboard from './pages/Dashboard'
import Publish from './pages/Publish'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import CourseManagement from './pages/CourseManagement'
import MyLearning from './pages/MyLearning'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/learn" element={<CoursePlayer />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />

        {/* Admin-only routes — students blocked */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/publish" element={<AdminRoute><Publish /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/courses" element={<AdminRoute><CourseManagement /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
