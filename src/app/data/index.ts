import type { Course, Assignment, Announcement, GradeHistoryEntry, Material } from "../types";

// ─── data/index.ts ───

export const COURSES: Course[] = [
  // ─── Existing courses ──────────────────────────────────
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

  // ─── New courses for Dr. Sarah Chen ──────────────────
  {
    id: "cs202", code: "CS202",
    title: "Advanced Data Structures",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 28, progress: 45, grade: "B+", gradeValue: 81,
    color: "#E87A4A", image: "photo-1516259762381-22954d7d3ad2",
    modules: 10, completedModules: 4, nextClass: "Wed 11:00 AM",
    description: "In-depth study of advanced data structures including balanced trees, tries, and graph algorithms. Emphasis on performance and real-world applications.",
  },
  {
    id: "cs203", code: "CS203",
    title: "Algorithm Design & Analysis",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 35, progress: 60, grade: "A−", gradeValue: 86,
    color: "#C87A2A", image: "photo-1509228468518-180dd4864904",
    modules: 13, completedModules: 8, nextClass: "Fri 9:00 AM",
    description: "Techniques for designing efficient algorithms: divide-and-conquer, dynamic programming, greedy algorithms, and NP-completeness. Includes proof of correctness and complexity analysis.",
  },
  {
    id: "cs204", code: "CS204",
    title: "AI & Machine Learning Fundamentals",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 40, progress: 30, grade: "B", gradeValue: 75,
    color: "#5A8A6A", image: "photo-1555949963-ff9fe0c870eb",
    modules: 16, completedModules: 5, nextClass: "Tue 10:00 AM",
    description: "Introduction to artificial intelligence and machine learning: search algorithms, neural networks, decision trees, and reinforcement learning. Hands-on projects using Python and TensorFlow.",
  },
  {
    id: "cs205", code: "CS205",
    title: "Cybersecurity & Network Defense",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 32, progress: 25, grade: "B+", gradeValue: 80,
    color: "#3A6A8A", image: "photo-1558494949-ef010cbdcc31",
    modules: 14, completedModules: 3, nextClass: "Mon 2:00 PM",
    description: "Fundamentals of cybersecurity: cryptography, network security, firewalls, intrusion detection, and ethical hacking. Practical labs with security tools and real-world case studies.",
  },

  // ─── Additional courses for other lecturers ──────────
  {
    id: "cs303", code: "CS303",
    title: "Cloud Computing & DevOps",
    lecturer: "Prof. Mohd Raza bin Ismail",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 30, progress: 50, grade: "A−", gradeValue: 84,
    color: "#D4A230", image: "photo-1544383835-bda2bc66a55d",
    modules: 12, completedModules: 6, nextClass: "Thu 11:00 AM",
    description: "Cloud infrastructure, virtualization, containerization (Docker, Kubernetes), CI/CD pipelines, and DevOps practices. Hands-on with AWS, Azure, or GCP.",
  },
  {
    id: "cs304", code: "CS304",
    title: "Mobile App Development",
    lecturer: "Dr. Priya Narayanan",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 33, progress: 68, grade: "A", gradeValue: 90,
    color: "#4A8A5C", image: "photo-1522071820081-009f0129c71c",
    modules: 15, completedModules: 10, nextClass: "Fri 1:00 PM",
    description: "Development of cross-platform mobile applications using React Native and Flutter. Covers UI/UX design, state management, and native device integration.",
  },
  {
    id: "cs402", code: "CS402",
    title: "Data Science & Big Data Analytics",
    lecturer: "Dr. James Okafor",
    faculty: "Computer Science", semester: "2024/25 Sem 2",
    enrolled: 28, progress: 35, grade: "B+", gradeValue: 79,
    color: "#4470B4", image: "photo-1558494949-ef010cbdcc31",
    modules: 13, completedModules: 4, nextClass: "Tue 3:00 PM",
    description: "Introduction to data science: data wrangling, exploratory analysis, statistical modeling, and big data technologies like Hadoop and Spark. Project-based learning.",
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

// ─── CLASS SCHEDULE (with address) ───────────────────────────────

export interface ClassSchedule {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  room: string;
  location: {
    lat: number;
    lng: number;
    address: string; // ✅ human‑readable address
  };
  type: 'lecture' | 'lab' | 'tutorial';
}

export const CLASS_SCHEDULE: ClassSchedule[] = [
  // ─── Today's test sessions ──────────────────────────────
  {
    id: 'test-today-1',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Today’s Lecture – Testing',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '20:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'test-today-2',
    courseId: 'cs302',
    courseCode: 'CS302',
    title: 'Today’s Lab Session',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },

  // ─── Week 1 ──────────────────────────────────────────────
  {
    id: 'cs201-1',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 1: Introduction',
    date: '2026-07-13',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-2',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 1: Environment Setup',
    date: '2026-07-14',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-3',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 1: Algorithm Analysis',
    date: '2026-07-15',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 2 ──────────────────────────────────────────────
  {
    id: 'cs201-4',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 2: Data Structures',
    date: '2026-07-20',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-5',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 2: Implementation',
    date: '2026-07-21',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-6',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 2: Complexity Analysis',
    date: '2026-07-22',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 3 ──────────────────────────────────────────────
  {
    id: 'cs201-7',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 3: Trees & Recursion',
    date: '2026-07-27',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-8',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 3: Tree Traversal',
    date: '2026-07-28',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-9',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 3: Binary Search Trees',
    date: '2026-07-29',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 4 ──────────────────────────────────────────────
  {
    id: 'cs201-10',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 4: Heaps & Priority Queues',
    date: '2026-08-03',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-11',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 4: Heap Implementation',
    date: '2026-08-04',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-12',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 4: Heap Applications',
    date: '2026-08-05',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 5 ──────────────────────────────────────────────
  {
    id: 'cs201-13',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 5: Graph Algorithms',
    date: '2026-08-10',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-14',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 5: BFS & DFS',
    date: '2026-08-11',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-15',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 5: Shortest Path',
    date: '2026-08-12',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 6 ──────────────────────────────────────────────
  {
    id: 'cs201-16',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 6: Sorting Algorithms',
    date: '2026-08-17',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-17',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 6: Sort Implementation',
    date: '2026-08-18',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-18',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 6: Algorithm Design',
    date: '2026-08-19',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },

  // ─── Week 7 ──────────────────────────────────────────────
  {
    id: 'cs201-19',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lecture 7: Hash Tables',
    date: '2026-08-24',
    startTime: '09:00',
    endTime: '11:00',
    room: 'DK3',
    location: { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science, UTM' },
    type: 'lecture',
  },
  {
    id: 'cs201-20',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Lab 7: Hash Map',
    date: '2026-08-25',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab B',
    location: { lat: 3.139, lng: 101.686, address: 'Lab B, Faculty of Computer Science, UTM' },
    type: 'lab',
  },
  {
    id: 'cs201-21',
    courseId: 'cs201',
    courseCode: 'CS201',
    title: 'Tutorial 7: Hashing Applications',
    date: '2026-08-26',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Room 301',
    location: { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science, UTM' },
    type: 'tutorial',
  },
];

// ─── ATTENDANCE RECORDS (student‑specific) ──────────────────────

export const ATTENDANCE_RECORDS: Record<string, 'present' | 'absent'> = {
  // Mark some classes as present to simulate past attendance
  'cs201-1': 'present',
  'cs201-2': 'present',
  'cs201-3': 'absent',
  'cs201-4': 'present',
  'cs201-5': 'absent',
  'cs201-6': 'present',
  // The rest default to absent (no entry) – but we can add a few more
  'cs201-7': 'absent',
  'cs201-8': 'present',
  // You can add more entries as needed
};

// (Optional) Student list for reference – not used in this component, but kept if needed
export const STUDENT_LIST = [
  { id: 's1', name: 'Ahmad Fariz' },
  { id: 's2', name: 'Nurul Ain Farhana' },
  { id: 's3', name: 'Danial Haziq' },
  { id: 's4', name: 'Farah Syahirah' },
  { id: 's5', name: 'Hazwan Zulkifli' },
  { id: 's6', name: 'Lim Wei Xian' },
  { id: 's7', name: 'Nurul Izzah' },
  { id: 's8', name: 'Muhammad Firdaus' },
];