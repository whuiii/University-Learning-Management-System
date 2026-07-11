import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/common';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { StudentDashboard } from './components/student';
import { LecturerDashboard } from './components/lecturer';
import { AdminDashboard } from './components/admin';
import { CoursesView, CourseDetailView } from './components/courses';
import { AssignmentsView } from './components/assignments';
import { GradesView } from './components/grades';
import { AnnouncementsView } from './components/announcements';

function AppRoutes() {
  const { role } = useAuth();
  // Role-based dashboard
  let DashboardComponent = StudentDashboard;
  if (role === 'lecturer') DashboardComponent = LecturerDashboard;
  else if (role === 'admin') DashboardComponent = AdminDashboard;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<DashboardComponent />} />
        <Route path="courses" element={<CoursesView />} />
        <Route path="courses/:courseId" element={<CourseDetailView />} />
        <Route path="assignments" element={<AssignmentsView />} />
        <Route path="grades" element={<GradesView />} />
        <Route path="announcements" element={<AnnouncementsView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}