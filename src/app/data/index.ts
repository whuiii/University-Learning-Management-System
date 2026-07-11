import type { Course, Assignment, Announcement, GradeHistoryEntry, Material } from "../types";

export const COURSES: Course[] = [
  {
    id: "cs201", code: "CS201",
    title: "Data Structures & Algorithms",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 42, progress: 68, grade: "A−", gradeValue: 87,
    color: "#C4582A", image: "photo-1509228468518-180dd4864904",
    modules: 12, completedModules: 8, nextClass: "Mon 10:00 AM",
    description: "Core algorithms and data structure implementations with complexity analysis. Students implement trees, graphs, and sorting algorithms from scratch.",
  },
  {
    id: "cs301", code: "CS301",
    title: "Database Systems",
    lecturer: "Prof. Mohd Raza bin Ismail",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 38, progress: 55, grade: "B+", gradeValue: 82,
    color: "#D4A230", image: "photo-1544383835-bda2bc66a55d",
    modules: 10, completedModules: 5, nextClass: "Tue 2:00 PM",
    description: "Relational database design, SQL, transactions, indexing, and an introduction to NoSQL with MongoDB.",
  },
  {
    id: "cs302", code: "CS302",
    title: "Software Engineering",
    lecturer: "Dr. Priya Narayanan",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 35, progress: 72, grade: "A", gradeValue: 92,
    color: "#4A8A5C", image: "photo-1522071820081-009f0129c71c",
    modules: 14, completedModules: 10, nextClass: "Wed 9:00 AM",
    description: "SDLC methodologies, Agile and Scrum, UML modeling, requirements engineering, and software project management.",
  },
  {
    id: "cs401", code: "CS401",
    title: "Computer Networks",
    lecturer: "Dr. James Okafor",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 30, progress: 40, grade: "B", gradeValue: 78,
    color: "#4470B4", image: "photo-1558494949-ef010cbdcc31",
    modules: 11, completedModules: 4, nextClass: "Thu 3:00 PM",
    description: "Network architectures, OSI and TCP/IP models, routing protocols, security fundamentals, and Cisco Packet Tracer labs.",
  },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: "a1", courseId: "cs201", courseCode: "CS201", title: "Binary Tree Traversal Implementation", dueDate: "2025-02-14", status: "pending", weight: 15, type: "Programming" },
  { id: "a2", courseId: "cs301", courseCode: "CS301", title: "ER Diagram for University Library System", dueDate: "2025-02-10", status: "submitted", weight: 10, type: "Design" },
  { id: "a3", courseId: "cs302", courseCode: "CS302", title: "Sprint Planning & Backlog Report", dueDate: "2025-02-17", status: "pending", weight: 20, type: "Report" },
  { id: "a4", courseId: "cs401", courseCode: "CS401", title: "Network Topology Analysis", dueDate: "2025-02-08", status: "graded", score: 84, weight: 12, type: "Analysis" },
  { id: "a5", courseId: "cs201", courseCode: "CS201", title: "Graph Algorithms Quiz", dueDate: "2025-02-05", status: "graded", score: 91, weight: 8, type: "Quiz" },
  { id: "a6", courseId: "cs302", courseCode: "CS302", title: "UML Class Diagram — E-commerce System", dueDate: "2025-01-28", status: "graded", score: 88, weight: 10, type: "Design" },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "ann1", courseId: "cs201", courseCode: "CS201", title: "Lab Session Rescheduled — Week 7", body: "Due to the public holiday, the Week 7 lab has moved to Thursday 10 AM in Lab B. Please inform your group members.", author: "Dr. Sarah Chen", date: "2025-02-06", pinned: true },
  { id: "ann2", courseId: "cs302", courseCode: "CS302", title: "Guest Lecture: Agile at Scale — Petronas Digital", body: "A senior engineer from Petronas Digital will share real-world Agile experience on Feb 12, 2 PM in DK3. Attendance is compulsory.", author: "Dr. Priya Narayanan", date: "2025-02-05", pinned: true },
  { id: "ann3", courseId: "cs301", courseCode: "CS301", title: "Assignment 2 Submission Portal Now Open", body: "The portal for Assignment 2 (ER Diagram) is live. Submit as a single PDF before 11:59 PM on Feb 10. Late work incurs −10%/day.", author: "Prof. Mohd Raza bin Ismail", date: "2025-02-04", pinned: false },
  { id: "ann4", courseId: "cs401", courseCode: "CS401", title: "Mid-Semester Exam — Room Allocation Published", body: "Room allocations are published. A–M: Dewan A, N–Z: Dewan B. Bring your student ID card. No electronic devices permitted.", author: "Dr. James Okafor", date: "2025-02-03", pinned: false },
];

export const GRADE_HISTORY: GradeHistoryEntry[] = [
  { week: "W1", cs201: 80, cs301: 74, cs302: 88, cs401: 70 },
  { week: "W2", cs201: 84, cs301: 78, cs302: 89, cs401: 72 },
  { week: "W3", cs201: 83, cs301: 80, cs302: 91, cs401: 73 },
  { week: "W4", cs201: 86, cs301: 80, cs302: 91, cs401: 77 },
  { week: "W5", cs201: 87, cs301: 82, cs302: 92, cs401: 78 },
];

export const MATERIALS: Material[] = [
  { id: "m1", type: "pdf", title: "Lecture 8: Binary Trees & BST", size: "2.4 MB", date: "Feb 3" },
  { id: "m2", type: "video", title: "Tree Traversal — Live Walkthrough", duration: "22 min", date: "Feb 3" },
  { id: "m3", type: "pdf", title: "Lab 7 Worksheet", size: "0.8 MB", date: "Jan 30" },
  { id: "m4", type: "pdf", title: "Lecture 7: Heaps & Priority Queues", size: "3.1 MB", date: "Jan 27" },
  { id: "m5", type: "video", title: "Heap Sort Demo & Analysis", duration: "18 min", date: "Jan 27" },
];

export const QUIZZES = [
  // CS201
  {
    id: 'q1',
    courseId: 'cs201',
    title: 'Quiz 1: Big-O & Arrays',
    dueDate: '2025-02-20',
    duration: 30, // minutes
    totalQuestions: 10,
    status: 'available', // 'upcoming' | 'available' | 'completed' | 'graded'
    score: null, // or number if graded
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 'q2',
    courseId: 'cs201',
    title: 'Quiz 2: Trees & Recursion',
    dueDate: '2025-03-05',
    duration: 45,
    totalQuestions: 12,
    status: 'upcoming',
    score: null,
    attempts: 0,
    maxAttempts: 1,
  },
  // CS302
  {
    id: 'q3',
    courseId: 'cs302',
    title: 'Agile & Scrum Fundamentals',
    dueDate: '2025-02-15',
    duration: 20,
    totalQuestions: 8,
    status: 'graded',
    score: 88,
    attempts: 1,
    maxAttempts: 1,
  },
  {
    id: 'q4',
    courseId: 'cs302',
    title: 'UML & Requirements Engineering',
    dueDate: '2025-03-01',
    duration: 30,
    totalQuestions: 10,
    status: 'available',
    score: null,
    attempts: 0,
    maxAttempts: 2,
  },
  // CS301
  {
    id: 'q5',
    courseId: 'cs301',
    title: 'SQL Joins & Subqueries',
    dueDate: '2025-02-12',
    duration: 25,
    totalQuestions: 10,
    status: 'completed',
    score: null, // not graded yet
    attempts: 1,
    maxAttempts: 1,
  },
  // CS401
  {
    id: 'q6',
    courseId: 'cs401',
    title: 'Network Models & OSI',
    dueDate: '2025-02-18',
    duration: 30,
    totalQuestions: 15,
    status: 'upcoming',
    score: null,
    attempts: 0,
    maxAttempts: 1,
  },
];


// Add these after existing exports

export interface ClassSchedule {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  room: string;
  location: { lat: number; lng: number };
}

export const CLASS_SCHEDULE: ClassSchedule[] = [
  {
    id: 'cs201-1',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Data Structures Lab',
    date: '2026-07-15',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686 },
  },
  {
    id: 'cs201-2',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Data Structures Lecture',
    date: '2026-07-17',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687 },
  },
  {
    id: 'cs302-1',
    courseId: 'cs302',
    courseCode: 'CS302',
    title: 'Software Engineering Tutorial',
    date: '2026-07-16',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685 },
  },
  {
    id: 'cs301-1',
    courseId: 'cs301',
    courseCode: 'CS301',
    title: 'Database Systems Lecture',
    date: '2026-07-14',
    startTime: '08:00',
    endTime: '10:00',
    room: 'DK2',
    location: { lat: 3.139, lng: 101.686 },
  },
  {
    id: 'cs401-1',
    courseId: 'cs401',
    courseCode: 'CS401',
    title: 'Computer Networks Lab',
    date: '2026-07-13',
    startTime: '13:00',
    endTime: '15:00',
    room: 'Lab C',
    location: { lat: 3.141, lng: 101.688 },
  },
];

// Mock attendance records (student-specific)
export const ATTENDANCE_RECORDS: Record<string, 'present' | 'absent'> = {
  'cs201-1': 'present',
  'cs301-1': 'absent',
  'cs401-1': 'present',
};