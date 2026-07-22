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

// src/types/index.ts – in the Assignment interface

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  weight: number;
  type: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  // ─── new fields ───
  instructions?: string;
  attachments?: { name: string; url: string }[];
  submissionType?: 'file' | 'text' | 'both';
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

// ─── Types ────────────────────────────────────────────────────
export interface StudentPerformance {
  studentId: string;
  name: string;
  email: string;
  assignmentScores: Record<string, number>; // assignmentId -> score
  assignmentAverage: number;
  quizScores: Record<string, number>; // quizId -> score
  quizAverage: number;
  attendance: number; // percentage
  overallGrade: number;
  gradeLetter: string;
}

// ─────────────────────────────────────────────────────────────
//  CLASS SCHEDULE & ATTENDANCE (for StudentAttendance)
// ─────────────────────────────────────────────────────────────

export interface ClassSchedule {
  id: string;
  courseCode: string;
  title: string;
  date: string;          // YYYY-MM-DD
  startTime: string;     // HH:mm
  endTime: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

// ─── Programme Management ──────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain';
}

// Renamed to avoid conflict with existing Course
export interface ProgrammeCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  year: number;
  skills: string[]; // skill ids
}

export interface Programme {
  id: string;
  name: string;
  faculty: string;
  duration: string;
  activeStudents: number;
  status: 'Active' | 'Inactive' | 'Draft';
  courses: ProgrammeCourse[];
}