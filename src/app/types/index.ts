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
  credits?: number;
  learningOutcomes?: string[]; // added for lecturer editing
}

export interface Material {
  id: string;
  type: 'pdf' | 'video' | 'link';
  title: string;
  date: string;
  size?: string;
  duration?: string;
  url?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  weight: number;
  type: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  duration: number;
  totalQuestions: number;
  status: 'upcoming' | 'available' | 'completed' | 'graded';
  score: number | null;
  attempts: number;
  maxAttempts: number;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  body: string;
  author: string;
  date: string;
  pinned: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface FullCourse extends Course {
  materials: Material[];
  assignments: Assignment[];
  quizzes: Quiz[];
  announcements: Announcement[];
  students: Student[];
  grades: Record<string, Record<string, number>>; // studentId -> assignmentId -> score
}

// ─── Grading ──────────────────────────────────────────────────

export interface Assessment {
  id: string;
  type: string;          // e.g., "Quiz 1", "Test 2"
  maxScore: number;
}

export interface GradingData {
  assessments: Assessment[];
  scores: Record<string, Record<string, number | null>>; // studentId -> assessmentId -> score (null = not started)
}