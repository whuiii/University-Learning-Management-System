import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/common';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { StudentDashboard, StudentSettings, StudentCalendar } from './components/student';
import { LecturerDashboard } from './components/lecturer';
import { AdminDashboard } from './components/admin';
import { CoursesView, CourseDetailView } from './components/courses';
import { AssignmentsView } from './components/assignments';
import { GradesView } from './components/grades';
import { AnnouncementsView } from './components/announcements';
import { Toaster } from 'sonner';
import { PlaceholderPage } from './components/common/PlaceholderPage';
import { StudentAttendance } from './components/student/StudentAttendance';

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

          // New placeholder routes for student
          {/* <Route path="quizzes" element={<PlaceholderPage />} /> */}
          {/* <Route path="discussions" element={<PlaceholderPage />} /> */}
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="settings" element={<StudentSettings />} />

          // Lecturer routes (with /lecturer prefix)
          <Route path="lecturer/courses" element={<PlaceholderPage />} />
          <Route path="lecturer/materials" element={<PlaceholderPage />} />
          <Route path="lecturer/assignments" element={<PlaceholderPage />} />
          <Route path="lecturer/quizzes" element={<PlaceholderPage />} />
          <Route path="lecturer/grading" element={<PlaceholderPage />} />
          <Route path="lecturer/questions" element={<PlaceholderPage />} />
          <Route path="lecturer/performance" element={<PlaceholderPage />} />
          <Route path="lecturer/attendance" element={<PlaceholderPage />} />

          // Admin routes (with /admin prefix)
          <Route path="admin/users" element={<PlaceholderPage />} />
          <Route path="admin/roles" element={<PlaceholderPage />} />
          <Route path="admin/courses" element={<PlaceholderPage />} />
          <Route path="admin/semesters" element={<PlaceholderPage />} />
          <Route path="admin/sis" element={<PlaceholderPage />} />
          <Route path="admin/security" element={<PlaceholderPage />} />
          <Route path="admin/audit" element={<PlaceholderPage />} />
          <Route path="admin/reports" element={<PlaceholderPage />} />
          <Route path="admin/system" element={<PlaceholderPage />} />
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
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}