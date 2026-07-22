// src/data/index.ts

import { Course, GradingData, StudentPerformance , ClassSchedule, Quiz, Assignment} from '../types';

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

export const ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    courseId: "cs201",
    title: "Binary Search Tree Implementation",
    dueDate: "2025-02-10",
    status: "pending",
    weight: 15,
    type: "Programming",
    score: undefined,
    instructions:
      "Implement a Binary Search Tree (BST) with the following operations:\n" +
      "- `insert(key)` – add a node\n" +
      "- `delete(key)` – remove a node\n" +
      "- `search(key)` – find a node\n" +
      "- `inorder()` – return sorted list\n\n" +
      "Provide complexity analysis (time & space) for each operation.\n" +
      "Write test cases to verify correctness.",
    attachments: [
      { name: "BST_Starter_Code.zip", url: "#" },
      { name: "BST_Assignment_Spec.pdf", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Implement Breadth‑First Search (BFS) and Depth‑First Search (DFS) on an adjacency list graph.\n" +
      "Your implementation should:\n" +
      "- Build a graph from input edges\n" +
      "- Perform both traversals from a given start node\n" +
      "- Print the order of visited nodes\n" +
      "Extra: detect cycles in directed graphs.",
    attachments: [
      { name: "graph_traversal_template.py", url: "#" },
      { name: "sample_inputs.txt", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Given a set of SQL queries and a sample database schema, rewrite the queries to improve performance.\n" +
      "Provide:\n" +
      "- Original query and its execution plan\n" +
      "- Optimised query and new execution plan\n" +
      "- Explanation of changes (indexes, joins, subqueries, etc.)",
    attachments: [
      { name: "queries.sql", url: "#" },
      { name: "schema_diagram.png", url: "#" },
    ],
    submissionType: "both",
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
    instructions:
      "As a team, conduct a sprint planning session for a new feature.\n" +
      "Deliverables:\n" +
      "- Sprint backlog (user stories with points)\n" +
      "- Sprint goal and timeline\n" +
      "- Risk assessment\n" +
      "Submit your team's presentation slides and backlog spreadsheet.",
    attachments: [
      { name: "Sprint_Planning_Template.xlsx", url: "#" },
      { name: "Sample_Backlog.pdf", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Draw a Use Case Diagram for a Library Management System.\n" +
      "Include at least 5 actors and 10 use cases.\n" +
      "Write a brief description for each use case.\n" +
      "Submit your diagram as a PDF or image, and the description as a text file.",
    attachments: [
      { name: "Use_Case_Template.md", url: "#" },
      { name: "Example_Use_Case.png", url: "#" },
    ],
    submissionType: "both",
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
    instructions:
      "Using Cisco Packet Tracer, build a network with:\n" +
      "- 2 routers, 3 switches, and 6 end devices\n" +
      "- Configure static routing and VLANs\n" +
      "- Test connectivity using ping and traceroute\n" +
      "Submit your .pkt file and a report with screenshots.",
    attachments: [
      { name: "Lab_Instructions.pdf", url: "#" },
      { name: "Starting_Topology.pkt", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Capture network traffic using Wireshark and analyse:\n" +
      "- TCP handshake\n" +
      "- HTTP request/response\n" +
      "- DNS query\n" +
      "Answer the questions in the provided worksheet.",
    attachments: [
      { name: "Wireshark_Worksheet.docx", url: "#" },
      { name: "capture_sample.pcapng", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Solve the following DP problems (provide code and explanation):\n" +
      "1. Fibonacci (bottom‑up and memoization)\n" +
      "2. Longest Common Subsequence\n" +
      "3. 0/1 Knapsack\n" +
      "For each, explain the recurrence and time complexity.",
    attachments: [
      { name: "dp_problems.pdf", url: "#" },
      { name: "starter_code.zip", url: "#" },
    ],
    submissionType: "both",
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
    instructions:
      "Implement a feedforward neural network from scratch (no high‑level libraries).\n" +
      "Train it on the MNIST dataset.\n" +
      "Report accuracy and provide a Jupyter notebook with your code, training logs, and visualisations.",
    attachments: [
      { name: "MNIST_data.zip", url: "#" },
      { name: "network_architecture.png", url: "#" },
    ],
    submissionType: "file",
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
    instructions:
      "Answer the following questions (max 500 words):\n" +
      "1. Explain symmetric vs asymmetric encryption.\n" +
      "2. What is a hash function and where is it used?\n" +
      "3. Describe the RSA algorithm briefly.\n" +
      "Submit your answers as a PDF or text file.",
    attachments: [
      { name: "crypto_questions.pdf", url: "#" },
    ],
    submissionType: "text",
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


// ─────────────────────────────────────────────────────────────
//  QUIZZES  (NEW – needed by LecturerStudentPerformance)
// ─────────────────────────────────────────────────────────────
export const QUIZZES: Quiz[] = [
  {
    id: 'q1',
    courseId: 'cs201',
    title: 'Data Structures Quiz 1',
    dueDate: '2025-02-14',
    duration: 30,
    totalQuestions: 10,
    status: 'available',
    score: null,
    attempts: 0,
    maxAttempts: 2,
  },
  {
    id: 'q2',
    courseId: 'cs201',
    title: 'Algorithms Quiz 2',
    dueDate: '2025-03-01',
    duration: 45,
    totalQuestions: 12,
    status: 'upcoming',
    score: null,
    attempts: 0,
    maxAttempts: 2,
  },
  {
    id: 'q3',
    courseId: 'cs302',
    title: 'Software Engineering Quiz',
    dueDate: '2025-02-20',
    duration: 20,
    totalQuestions: 8,
    status: 'completed',
    score: 85,
    attempts: 1,
    maxAttempts: 3,
  },
  {
    id: 'q4',
    courseId: 'cs301',
    title: 'SQL Fundamentals Quiz',
    dueDate: '2025-02-12',
    duration: 25,
    totalQuestions: 10,
    status: 'graded',
    score: 92,
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: 'q5',
    courseId: 'cs401',
    title: 'Network Protocols Quiz',
    dueDate: '2025-02-28',
    duration: 30,
    totalQuestions: 10,
    status: 'available',
    score: null,
    attempts: 0,
    maxAttempts: 2,
  },
];


// ─────────────────────────────────────────────────────────────
//  MATERIALS (mock data for course materials)
// ─────────────────────────────────────────────────────────────

export const MATERIALS = [
  {
    id: 'mat1',
    type: 'pdf' as const,
    title: 'Lecture 1: Introduction to Data Structures',
    date: '2025-01-15',
    size: '2.4 MB',
  },
  {
    id: 'mat2',
    type: 'video' as const,
    title: 'Lecture 2: Arrays and Linked Lists',
    date: '2025-01-20',
    duration: '42 min',
  },
  {
    id: 'mat3',
    type: 'pdf' as const,
    title: 'Lab 1: Implementing a Stack',
    date: '2025-01-22',
    size: '1.1 MB',
  },
  {
    id: 'mat4',
    type: 'video' as const,
    title: 'Lecture 3: Trees and Heaps',
    date: '2025-01-27',
    duration: '38 min',
  },
  {
    id: 'mat5',
    type: 'pdf' as const,
    title: 'Assignment 1 Specification',
    date: '2025-02-01',
    size: '0.8 MB',
  },
  {
    id: 'mat6',
    type: 'video' as const,
    title: 'Lecture 4: Hash Tables',
    date: '2025-02-03',
    duration: '45 min',
  },
  {
    id: 'mat7',
    type: 'pdf' as const,
    title: 'Lab 2: Binary Search Trees',
    date: '2025-02-05',
    size: '1.3 MB',
  },
];


// ─────────────────────────────────────────────────────────────
//  CLASS SCHEDULE (TIMETABLE) – NEW REALISTIC GENERATION
// ─────────────────────────────────────────────────────────────

// Helper: Get the Monday of the current week
function getThisWeekMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? 6 : day - 1); // Monday = 0 diff
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Generate dates for each weekday (Mon–Fri) for a given week offset
function getWeekDates(weekOffset: number): Record<string, string> {
  const monday = getThisWeekMonday();
  monday.setDate(monday.getDate() + weekOffset * 7);
  const dates: Record<string, string> = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  days.forEach((day, idx) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + idx);
    dates[day] = d.toISOString().split('T')[0];
  });
  return dates;
}

// Define a student's weekly timetable (courses, days, times, rooms)
// Each entry: { courseCode, title, day, startTime, endTime, room, type? }
const timetableTemplate: {
  courseCode: string;
  title: string;
  day: string; // 'Monday'...'Friday'
  startTime: string; // HH:mm
  endTime: string;
  room: string;
  type?: 'lecture' | 'lab' | 'tutorial';
}[] = [
  // CS201: Data Structures & Algorithms (Dr. Sarah Chen)
  {
    courseCode: 'CS201',
    title: 'Data Structures & Algorithms',
    day: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'DK3',
    type: 'lecture',
  },
  {
    courseCode: 'CS201',
    title: 'Data Structures Lab',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Lab B',
    type: 'lab',
  },
  {
    courseCode: 'CS201',
    title: 'Data Structures Tutorial',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    room: 'Room 301',
    type: 'tutorial',
  },

  // CS301: Database Systems (Prof. Mohd Raza)
  {
    courseCode: 'CS301',
    title: 'Database Systems',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'DK2',
    type: 'lecture',
  },
  {
    courseCode: 'CS301',
    title: 'Database Lab',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Lab C',
    type: 'lab',
  },

  // CS302: Software Engineering (Dr. Priya Narayanan)
  {
    courseCode: 'CS302',
    title: 'Software Engineering',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'DK1',
    type: 'lecture',
  },
  {
    courseCode: 'CS302',
    title: 'Software Engineering Lab',
    day: 'Friday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Lab D',
    type: 'lab',
  },

  // CS401: Computer Networks (Dr. James Okafor)
  {
    courseCode: 'CS401',
    title: 'Computer Networks',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'DK3',
    type: 'lecture',
  },
  {
    courseCode: 'CS401',
    title: 'Networks Lab',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '11:00',
    room: 'Lab E',
    type: 'lab',
  },

  // CS203: Algorithm Design & Analysis (Dr. Sarah Chen)
  {
    courseCode: 'CS203',
    title: 'Algorithm Design & Analysis',
    day: 'Monday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'DK2',
    type: 'lecture',
  },
  {
    courseCode: 'CS203',
    title: 'Algorithms Tutorial',
    day: 'Wednesday',
    startTime: '16:00',
    endTime: '17:00',
    room: 'Room 305',
    type: 'tutorial',
  },
];

// Generate the actual schedule for the current semester (14 weeks)
const semesterWeeks = 14;

// Location mapping (room -> lat/lng)
const locationMap: Record<string, { lat: number; lng: number; address: string }> = {
  'DK3': { lat: 3.140, lng: 101.687, address: 'DK3, Faculty of Computer Science' },
  'DK2': { lat: 3.139, lng: 101.686, address: 'DK2, Faculty of Computer Science' },
  'DK1': { lat: 3.138, lng: 101.685, address: 'DK1, Faculty of Computer Science' },
  'Lab B': { lat: 3.139, lng: 101.687, address: 'Lab B, Faculty of Computer Science' },
  'Lab C': { lat: 3.138, lng: 101.686, address: 'Lab C, Faculty of Computer Science' },
  'Lab D': { lat: 3.139, lng: 101.688, address: 'Lab D, Faculty of Computer Science' },
  'Lab E': { lat: 3.140, lng: 101.689, address: 'Lab E, Faculty of Computer Science' },
  'Room 301': { lat: 3.138, lng: 101.685, address: 'Room 301, Faculty of Computer Science' },
  'Room 305': { lat: 3.137, lng: 101.684, address: 'Room 305, Faculty of Computer Science' },
};

for (let week = 0; week < semesterWeeks; week++) {
  const weekDates = getWeekDates(week);
  timetableTemplate.forEach((entry) => {
    const dateStr = weekDates[entry.day];
    if (!dateStr) return;
    const location = locationMap[entry.room] || {
      lat: 3.140,
      lng: 101.687,
      address: entry.room,
    };
    scheduleEntries.push({
      id: `schedule-${week}-${entry.courseCode}-${entry.day}-${entry.startTime}`,
      courseCode: entry.courseCode,
      title: entry.title,
      date: dateStr,
      startTime: entry.startTime,
      endTime: entry.endTime,
      location,
    });
  });
}

