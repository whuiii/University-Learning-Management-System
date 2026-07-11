import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart3, Bell, 
  Users, Database, Cpu, GraduationCap, FileText, Video, 
  Calendar, MessageCircle, Settings, Shield, Award, Target,
  UserCheck, FileCheck, BookMarked, Activity, Inbox, Plus,
  TrendingUp, HelpCircle, CheckCircle2, Clock, AlertCircle,
  User, Book, Layers, ListChecks, PieChart, Mail, 
  UserPlus, School, Server, FileBarChart, Bug, Cloud,
  Smartphone, Trophy, Star, Fingerprint, QrCode,
} from 'lucide-react';
import type { Role } from '../types';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  section?: string; // optional grouping
}

export const roleNavConfig: Record<Role, NavItem[]> = {
  student: [
    // Dashboard
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', section: 'Overview' },
    // Courses
    { id: 'courses', label: 'My Courses', icon: BookOpen, path: '/courses', section: 'Learning' },
    // Assignments & Quizzes
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, path: '/assignments', section: 'Assessments' },
    // Grades & Progress
    { id: 'grades', label: 'Grades & Progress', icon: BarChart3, path: '/grades', section: 'Academic' },
    // Communication
    { id: 'announcements', label: 'Announcements', icon: Bell, path: '/announcements', section: 'Communication' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar', section: 'Tools' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'Tools' },

    { id: 'attendance', label: 'Attendance', icon: Clock, path: '/attendance', section: 'Academic' },
  ],
  lecturer: [
    // Dashboard
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', section: 'Overview' },
    // Course Management
    { id: 'my-courses', label: 'My Courses', icon: BookOpen, path: '/lecturer/courses', section: 'Course Management' },
    { id: 'manage-materials', label: 'Course Materials', icon: FileText, path: '/lecturer/materials', section: 'Course Management' },
    // Assessment
    { id: 'manage-assignments', label: 'Assignments', icon: ClipboardList, path: '/lecturer/assignments', section: 'Assessment' },
    { id: 'quiz-bank', label: 'Quiz Bank', icon: ListChecks, path: '/lecturer/quizzes', section: 'Assessment' },
    { id: 'grade-submissions', label: 'Grade Submissions', icon: FileCheck, path: '/lecturer/grading', section: 'Assessment' },
    // Communication
    { id: 'announcements', label: 'Announcements', icon: Bell, path: '/announcements', section: 'Communication' },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle, path: '/discussions', section: 'Communication' },
    { id: 'student-questions', label: 'Student Questions', icon: HelpCircle, path: '/lecturer/questions', section: 'Communication' },
    // Analytics
    { id: 'performance', label: 'Student Performance', icon: TrendingUp, path: '/lecturer/performance', section: 'Analytics' },
    { id: 'attendance-reports', label: 'Attendance Reports', icon: Clock, path: '/lecturer/attendance', section: 'Analytics' },
    // Settings
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'Tools' },
  ],
  admin: [
    // Dashboard
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', section: 'Overview' },
    // User Management
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users', section: 'User Management' },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield, path: '/admin/roles', section: 'User Management' },
    // Course Administration
    { id: 'courses-admin', label: 'Course Management', icon: BookOpen, path: '/admin/courses', section: 'Course Administration' },
    { id: 'semesters', label: 'Semesters', icon: Calendar, path: '/admin/semesters', section: 'Course Administration' },
    // Integration & SIS
    { id: 'sis-integration', label: 'SIS Integration', icon: Database, path: '/admin/sis', section: 'System' },
    { id: 'security', label: 'Security & Access', icon: Shield, path: '/admin/security', section: 'System' },
    { id: 'audit-logs', label: 'Audit Logs', icon: Activity, path: '/admin/audit', section: 'System' },
    // Reporting
    { id: 'reports', label: 'Reports & Analytics', icon: PieChart, path: '/admin/reports', section: 'Reporting' },
    { id: 'system-monitor', label: 'System Monitor', icon: Server, path: '/admin/system', section: 'System' },
    // Settings
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'Tools' },
  ],
};