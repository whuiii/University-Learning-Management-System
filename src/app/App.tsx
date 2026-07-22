import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/common';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { StudentDashboard, StudentSettings, StudentCalendar, StudentAttendance } from './components/student';
import { LecturerDashboard, LecturerCourses, LecturerCourseDetail, LecturerSettings, LecturerAttendanceSessions, LecturerAttendanceSessionDetail, LecturerAttendanceMatrix, LecturerStudentPerformance, LecturerUploadMaterial } from './components/lecturer';
import { LecturerGrading} from './components/lecturer/LecturerGrading';
import { AdminDashboard } from './components/admin';
import {
  AdminRoles,
  AdminCourses,
  AdminSemesters,
  AdminSISIntegration,
  AdminSecurity,
  AdminAuditLogs,
  AdminReports,
  AdminSystemMonitor,
  AdminSettings,
  AdminProgrammeManagement
} from './components/admin';
import { CoursesView, CourseDetailView } from './components/courses';
import { AssignmentsView, AssignmentDetailView } from './components/assignments';
import { GradesView } from './components/grades';
import { AnnouncementsView } from './components/announcements';
import { Toaster } from 'sonner';
import { PlaceholderPage } from './components/common/PlaceholderPage';

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
          <Route path="/assignments/:assignmentId" element={<AssignmentDetailView />} />
          <Route path="grades" element={<GradesView />} />
          <Route path="announcements" element={<AnnouncementsView />} />

          // New placeholder routes for student
          {/* <Route path="quizzes" element={<PlaceholderPage />} /> */}
          {/* <Route path="discussions" element={<PlaceholderPage />} /> */}
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="settings" element={<StudentSettings />} />

          // Lecturer routes (with /lecturer prefix)
          <Route path="lecturer/courses" element={<LecturerCourses />} />
          <Route path="lecturer/courses/:courseId" element={<LecturerCourseDetail />} />
          <Route path="lecturer/courses/:courseId/materials/upload" element={<LecturerUploadMaterial />} />
          <Route path="lecturer/grading" element={<LecturerGrading />} />
          <Route path="lecturer/performance" element={<LecturerStudentPerformance />} />
          <Route path="lecturer/attendance" element={<LecturerAttendanceSessions />} />
          <Route path="lecturer/attendance/session/:courseId/:type" element={<LecturerAttendanceSessionDetail />} />
          <Route path="lecturer/settings" element={<LecturerSettings />} />

          // Admin routes (with /admin prefix)
        <Route path="admin/roles" element={<AdminRoles />} />
        <Route path="admin/courses" element={<AdminCourses />} />
        <Route path="admin/semesters" element={<AdminSemesters />} />
        <Route path="admin/programmes" element={<AdminProgrammeManagement />} />
        <Route path="admin/sis" element={<AdminSISIntegration />} />
        <Route path="admin/security" element={<AdminSecurity />} />
        <Route path="admin/audit" element={<AdminAuditLogs />} />
        <Route path="admin/reports" element={<AdminReports />} />
        <Route path="admin/system" element={<AdminSystemMonitor />} />
        <Route path="settings" element={<AdminSettings />} /> /
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