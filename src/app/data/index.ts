// src/data/index.ts

import { Course, GradingData } from '../types';

// ─────────────────────────────────────────────────────────────
//  COURSES (12 courses)
// ─────────────────────────────────────────────────────────────

export const COURSES: Course[] = [
  {
    id: "cs201",
    code: "CS201",
    title: "Data Structures & Algorithms",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 42,
    progress: 68,
    grade: "A−",
    gradeValue: 87,
    color: "#C4582A",
    image: "photo-1509228468518-180dd4864904",
    modules: 12,
    completedModules: 8,
    nextClass: "Mon 10:00 AM",
    description:
      "Core algorithms and data structure implementations with complexity analysis. Students implement trees, graphs, and sorting algorithms from scratch.",
  },
  {
    id: "cs301",
    code: "CS301",
    title: "Database Systems",
    lecturer: "Prof. Mohd Raza bin Ismail",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 38,
    progress: 55,
    grade: "B+",
    gradeValue: 82,
    color: "#D4A230",
    image: "photo-1544383835-bda2bc66a55d",
    modules: 10,
    completedModules: 5,
    nextClass: "Tue 2:00 PM",
    description:
      "Relational database design, SQL, transactions, indexing, and an introduction to NoSQL with MongoDB.",
  },
  {
    id: "cs302",
    code: "CS302",
    title: "Software Engineering",
    lecturer: "Dr. Priya Narayanan",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 35,
    progress: 72,
    grade: "A",
    gradeValue: 92,
    color: "#4A8A5C",
    image: "photo-1522071820081-009f0129c71c",
    modules: 14,
    completedModules: 10,
    nextClass: "Wed 9:00 AM",
    description:
      "SDLC methodologies, Agile and Scrum, UML modeling, requirements engineering, and software project management.",
  },
  {
    id: "cs401",
    code: "CS401",
    title: "Computer Networks",
    lecturer: "Dr. James Okafor",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 30,
    progress: 40,
    grade: "B",
    gradeValue: 78,
    color: "#4470B4",
    image: "photo-1558494949-ef010cbdcc31",
    modules: 11,
    completedModules: 4,
    nextClass: "Thu 3:00 PM",
    description:
      "Network architectures, OSI and TCP/IP models, routing protocols, security fundamentals, and Cisco Packet Tracer labs.",
  },
  {
    id: "cs202",
    code: "CS202",
    title: "Advanced Data Structures",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 28,
    progress: 45,
    grade: "B+",
    gradeValue: 81,
    color: "#E87A4A",
    image: "photo-1516259762381-22954d7d3ad2",
    modules: 10,
    completedModules: 4,
    nextClass: "Wed 11:00 AM",
    description:
      "In-depth study of advanced data structures including balanced trees, tries, and graph algorithms. Emphasis on performance and real-world applications.",
  },
  {
    id: "cs203",
    code: "CS203",
    title: "Algorithm Design & Analysis",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 35,
    progress: 60,
    grade: "A−",
    gradeValue: 86,
    color: "#C87A2A",
    image: "photo-1509228468518-180dd4864904",
    modules: 13,
    completedModules: 8,
    nextClass: "Fri 9:00 AM",
    description:
      "Techniques for designing efficient algorithms: divide-and-conquer, dynamic programming, greedy algorithms, and NP-completeness. Includes proof of correctness and complexity analysis.",
  },
  {
    id: "cs204",
    code: "CS204",
    title: "AI & Machine Learning Fundamentals",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 40,
    progress: 30,
    grade: "B",
    gradeValue: 75,
    color: "#5A8A6A",
    image: "photo-1555949963-ff9fe0c870eb",
    modules: 16,
    completedModules: 5,
    nextClass: "Tue 10:00 AM",
    description:
      "Introduction to artificial intelligence and machine learning: search algorithms, neural networks, decision trees, and reinforcement learning. Hands-on projects using Python and TensorFlow.",
  },
  {
    id: "cs205",
    code: "CS205",
    title: "Cybersecurity & Network Defense",
    lecturer: "Dr. Sarah Chen",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 32,
    progress: 25,
    grade: "B+",
    gradeValue: 80,
    color: "#3A6A8A",
    image: "photo-1558494949-ef010cbdcc31",
    modules: 14,
    completedModules: 3,
    nextClass: "Mon 2:00 PM",
    description:
      "Fundamentals of cybersecurity: cryptography, network security, firewalls, intrusion detection, and ethical hacking. Practical labs with security tools and real-world case studies.",
  },
  {
    id: "cs303",
    code: "CS303",
    title: "Cloud Computing & DevOps",
    lecturer: "Prof. Mohd Raza bin Ismail",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 30,
    progress: 50,
    grade: "A−",
    gradeValue: 84,
    color: "#D4A230",
    image: "photo-1544383835-bda2bc66a55d",
    modules: 12,
    completedModules: 6,
    nextClass: "Thu 11:00 AM",
    description:
      "Cloud infrastructure, virtualization, containerization (Docker, Kubernetes), CI/CD pipelines, and DevOps practices. Hands-on with AWS, Azure, or GCP.",
  },
  {
    id: "cs304",
    code: "CS304",
    title: "Mobile App Development",
    lecturer: "Dr. Priya Narayanan",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 33,
    progress: 68,
    grade: "A",
    gradeValue: 90,
    color: "#4A8A5C",
    image: "photo-1522071820081-009f0129c71c",
    modules: 15,
    completedModules: 10,
    nextClass: "Fri 1:00 PM",
    description:
      "Development of cross-platform mobile applications using React Native and Flutter. Covers UI/UX design, state management, and native device integration.",
  },
  {
    id: "cs402",
    code: "CS402",
    title: "Data Science & Big Data Analytics",
    lecturer: "Dr. James Okafor",
    faculty: "Computer Science",
    semester: "2024/25 Sem 2",
    enrolled: 28,
    progress: 35,
    grade: "B+",
    gradeValue: 79,
    color: "#4470B4",
    image: "photo-1558494949-ef010cbdcc31",
    modules: 13,
    completedModules: 4,
    nextClass: "Tue 3:00 PM",
    description:
      "Introduction to data science: data wrangling, exploratory analysis, statistical modeling, and big data technologies like Hadoop and Spark. Project-based learning.",
  },
];

// ─────────────────────────────────────────────────────────────
//  ASSIGNMENTS
// ─────────────────────────────────────────────────────────────

export const ASSIGNMENTS = [
  {
    id: "a1",
    courseId: "cs201",
    title: "Binary Search Tree Implementation",
    dueDate: "2025-02-10",
    status: "pending",
    weight: 15,
    type: "Programming",
    score: undefined,
  },
  {
    id: "a2",
    courseId: "cs201",
    title: "Graph Traversal Algorithms",
    dueDate: "2025-02-25",
    status: "pending",
    weight: 20,
    type: "Programming",
    score: undefined,
  },
  {
    id: "a3",
    courseId: "cs301",
    title: "SQL Query Optimization",
    dueDate: "2025-02-18",
    status: "pending",
    weight: 10,
    type: "Assignment",
    score: undefined,
  },
  {
    id: "a4",
    courseId: "cs302",
    title: "Agile Sprint Planning",
    dueDate: "2025-02-05",
    status: "graded",
    weight: 10,
    type: "Project",
    score: 85,
  },
  {
    id: "a5",
    courseId: "cs302",
    title: "UML Use Case Diagram",
    dueDate: "2025-02-22",
    status: "pending",
    weight: 15,
    type: "Design",
    score: undefined,
  },
  {
    id: "a6",
    courseId: "cs401",
    title: "Network Topology Lab",
    dueDate: "2025-02-28",
    status: "pending",
    weight: 10,
    type: "Lab",
    score: undefined,
  },
  {
    id: "a7",
    courseId: "cs401",
    title: "Wireshark Packet Analysis",
    dueDate: "2025-01-30",
    status: "submitted",
    weight: 10,
    type: "Lab",
    score: 92,
  },
  {
    id: "a8",
    courseId: "cs203",
    title: "Dynamic Programming Problem Set",
    dueDate: "2025-03-05",
    status: "pending",
    weight: 20,
    type: "Assignment",
    score: undefined,
  },
  {
    id: "a9",
    courseId: "cs204",
    title: "Neural Network Implementation",
    dueDate: "2025-02-15",
    status: "pending",
    weight: 25,
    type: "Project",
    score: undefined,
  },
  {
    id: "a10",
    courseId: "cs205",
    title: "Cryptography Basics",
    dueDate: "2025-02-12",
    status: "graded",
    weight: 10,
    type: "Quiz",
    score: 78,
  },
];

// ─────────────────────────────────────────────────────────────
//  ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────

export const ANNOUNCEMENTS = [
  {
    id: "ann1",
    courseId: "cs302",
    courseCode: "CS302",
    title: "Final Project Submission Deadline Extended",
    body: "The deadline for the software engineering final project has been extended by one week. Please ensure you have completed all deliverables.",
    author: "Dr. Priya Narayanan",
    date: "2025-02-01",
    pinned: true,
  },
  {
    id: "ann2",
    courseId: "cs201",
    courseCode: "CS201",
    title: "Midterm Exam Review Session",
    body: "There will be a review session for the midterm exam on Friday at 3 PM in Room 301. Bring your questions.",
    author: "Dr. Sarah Chen",
    date: "2025-02-02",
    pinned: false,
  },
  {
    id: "ann3",
    courseId: "cs301",
    courseCode: "CS301",
    title: "New Lab Schedule",
    body: "Starting next week, the database lab will be held on Wednesdays instead of Tuesdays. Please update your calendars.",
    author: "Prof. Mohd Raza bin Ismail",
    date: "2025-01-28",
    pinned: false,
  },
  {
    id: "ann4",
    courseId: "cs401",
    courseCode: "CS401",
    title: "Guest Lecture on Network Security",
    body: "We have invited a guest speaker from the industry to talk about network security best practices. Attendance is encouraged.",
    author: "Dr. James Okafor",
    date: "2025-02-03",
    pinned: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  GRADE HISTORY
// ─────────────────────────────────────────────────────────────

export const GRADE_HISTORY = [
  { week: "W1", cs201: 85, cs301: 78, cs302: 88, cs401: 72 },
  { week: "W2", cs201: 87, cs301: 80, cs302: 90, cs401: 75 },
  { week: "W3", cs201: 86, cs301: 82, cs302: 91, cs401: 76 },
  { week: "W4", cs201: 88, cs301: 81, cs302: 92, cs401: 78 },
  { week: "W5", cs201: 87, cs301: 82, cs302: 93, cs401: 79 },
];

// ─────────────────────────────────────────────────────────────
//  SEMESTERS (derived from COURSES)
// ─────────────────────────────────────────────────────────────

function parseSemester(sem: string): { id: string; label: string } {
  const parts = sem.split(' ');
  const yearPart = parts[0]; // "2024/25"
  const semPart = parts[2]; // "2"
  const year = yearPart.split('/')[0]; // "2024"
  const id = `${year}-${semPart}`; // "2024-2"
  const label = `${yearPart} Semester ${semPart}`; // "2024/25 Semester 2"
  return { id, label };
}

const semesterMap = new Map<string, Course[]>();
COURSES.forEach((course) => {
  const sem = course.semester;
  if (!semesterMap.has(sem)) {
    semesterMap.set(sem, []);
  }
  semesterMap.get(sem)!.push(course);
});

export const SEMESTERS = Array.from(semesterMap.entries()).map(
  ([semKey, courses]) => {
    const { id, label } = parseSemester(semKey);
    const status = semKey === "2024/25 Sem 2" ? "In progress" : "Completed";
    return {
      id,
      label,
      status,
      courses: courses.map((c) => ({
        ...c,
        credits: c.credits || 3,
      })),
    };
  }
);

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

// Helper to get week start (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to get date string for weekday offset (0=Mon)
function getDateForWeekday(weekStart: Date, dayOffset: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
}

// Random time generator
function randomTime(baseHour: number, baseMinute: number): string {
  const h = baseHour + Math.floor(Math.random() * 2);
  const m = baseMinute + (Math.random() > 0.5 ? 0 : 30);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const today = new Date();
const currentWeekStart = getWeekStart(today);

// Pick first 6 courses for schedule
const courseList = COURSES.slice(0, 6);

const locations = [
  { lat: 3.1390, lng: 101.6869, address: 'Block A, Room 301' },
  { lat: 3.1395, lng: 101.6875, address: 'Block B, Lab 2' },
  { lat: 3.1380, lng: 101.6860, address: 'Block C, Lecture Hall' },
  { lat: 3.1400, lng: 101.6880, address: 'Block D, Room 405' },
  { lat: 3.1375, lng: 101.6855, address: 'Block E, Studio' },
];

const scheduleEntries: ClassSchedule[] = [];

courseList.forEach((course, index) => {
  const dayOffset = index % 5; // Mon-Fri
  const baseHour = 9 + (index % 4);
  const dateStr = getDateForWeekday(currentWeekStart, dayOffset);
  const loc = locations[index % locations.length];
  scheduleEntries.push({
    id: `schedule-${course.id}`,
    courseCode: course.code,
    title: course.title,
    date: dateStr,
    startTime: randomTime(baseHour, 0),
    endTime: randomTime(baseHour + 1, 0),
    location: loc,
  });
});

// Extra lab session
scheduleEntries.push({
  id: 'schedule-cs301-extra',
  courseCode: 'CS301',
  title: 'Database Lab',
  date: getDateForWeekday(currentWeekStart, 2),
  startTime: '14:00',
  endTime: '16:00',
  location: locations[1],
});

export const CLASS_SCHEDULE: ClassSchedule[] = scheduleEntries;

// Attendance records – mark some past sessions as present/absent
const attendanceRecords: Record<string, 'present' | 'absent'> = {};
scheduleEntries.forEach((entry) => {
  const entryDate = new Date(entry.date);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  if (entryDate < todayDate) {
    attendanceRecords[entry.id] = Math.random() < 0.7 ? 'present' : 'absent';
  } else {
    attendanceRecords[entry.id] = 'absent';
  }
});

export const ATTENDANCE_RECORDS = attendanceRecords;

// ─── Grading constants ──────────────────────────────────────

export const ASSESSMENT_TYPES = [
  'Test 1',
  'Test 2',
  'Test 3',
  'Quiz 1',
  'Quiz 2',
  'Quiz 3',
  'Project',
  'Assignment',
  'Lab',
  'Tutorial',
  'Presentation',
  'Midterm',
  'Final',
];

// Optional helper to initialise empty grading data for a course
export function createEmptyGradingData(): GradingData {
  return { assessments: [], scores: {} };
}