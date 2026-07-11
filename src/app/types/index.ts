export type Role = "student" | "lecturer" | "admin";
export type ActiveView = "dashboard" | "courses" | "assignments" | "grades" | "announcements";
export type Theme = "dark" | "light" | "eye";

export interface Course {
  id: string;
  code: string;
  title: string;
  lecturer: string;
  faculty: string;
  semester: string;
  enrolled: number;
  progress: number;
  grade: string;
  gradeValue: number;
  color: string;
  image: string;
  modules: number;
  completedModules: number;
  nextClass: string;
  description: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  weight: number;
  type: string;
  score?: number;
}

export interface Announcement {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned: boolean;
}

export interface GradeHistoryEntry {
  week: string;
  cs201: number;
  cs301: number;
  cs302: number;
  cs401: number;
}

export interface Material {
  id: string;
  type: "pdf" | "video";
  title: string;
  date: string;
  size?: string;
  duration?: string;
}