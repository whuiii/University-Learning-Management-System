import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  BarChart,
} from 'lucide-react';
import { COURSES, ASSIGNMENTS, QUIZZES } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif, mono } from '../../utils/helpers';

// ─── Types ────────────────────────────────────────────────────
interface StudentPerformance {
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

// ─── Helpers ──────────────────────────────────────────────────
const studentList = [
  { id: 's1', name: 'Ahmad Fariz', email: 'ahmad.fariz@utn.edu.my' },
  { id: 's2', name: 'Nurul Ain Farhana', email: 'nurul.ain@utn.edu.my' },
  { id: 's3', name: 'Danial Haziq', email: 'danial.haziq@utn.edu.my' },
  { id: 's4', name: 'Farah Syahirah', email: 'farah.syahirah@utn.edu.my' },
  { id: 's5', name: 'Hazwan Zulkifli', email: 'hazwan.zulkifli@utn.edu.my' },
  { id: 's6', name: 'Lim Wei Xian', email: 'lim.weixian@utn.edu.my' },
  { id: 's7', name: 'Nurul Izzah', email: 'nurul.izzah@utn.edu.my' },
  { id: 's8', name: 'Muhammad Firdaus', email: 'muhammad.firdaus@utn.edu.my' },
];

function generatePerformanceData(courseId: string): StudentPerformance[] {
  const courseAssignments = ASSIGNMENTS.filter(a => a.courseId === courseId);
  const courseQuizzes = QUIZZES.filter(q => q.courseId === courseId);

  return studentList.map((student) => {
    // Deterministic random based on student ID + course ID
    const seed = student.id + courseId;
    const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

    // Assignment scores (0-100)
    const assignmentScores: Record<string, number> = {};
    courseAssignments.forEach((a, idx) => {
      const base = 60 + (hash + idx * 7) % 40;
      const variation = (hash + idx * 3) % 10 - 5;
      assignmentScores[a.id] = Math.min(100, Math.max(0, base + variation));
    });
    const assignmentAverage = courseAssignments.length > 0
      ? Math.round(courseAssignments.reduce((sum, a) => sum + assignmentScores[a.id], 0) / courseAssignments.length)
      : 0;

    // Quiz scores
    const quizScores: Record<string, number> = {};
    courseQuizzes.forEach((q, idx) => {
      const base = 65 + (hash + idx * 13) % 35;
      const variation = (hash + idx * 5) % 10 - 5;
      quizScores[q.id] = Math.min(100, Math.max(0, base + variation));
    });
    const quizAverage = courseQuizzes.length > 0
      ? Math.round(courseQuizzes.reduce((sum, q) => sum + quizScores[q.id], 0) / courseQuizzes.length)
      : 0;

    // Attendance (60-100%)
    const attendance = 60 + (hash % 40);

    // Overall grade (weighted: assignments 50%, quizzes 30%, attendance 20%)
    const overall = Math.round(
      assignmentAverage * 0.5 + quizAverage * 0.3 + attendance * 0.2
    );
    let gradeLetter = '';
    if (overall >= 85) gradeLetter = 'A';
    else if (overall >= 75) gradeLetter = 'B';
    else if (overall >= 65) gradeLetter = 'C';
    else if (overall >= 50) gradeLetter = 'D';
    else gradeLetter = 'F';

    return {
      studentId: student.id,
      name: student.name,
      email: student.email,
      assignmentScores,
      assignmentAverage,
      quizScores,
      quizAverage,
      attendance,
      overallGrade: overall,
      gradeLetter,
    };
  });
}

export function LecturerStudentPerformance() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ─── State ──────────────────────────────────────────────────
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StudentPerformance>('overallGrade');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // ─── Get courses ────────────────────────────────────────────
  const lecturerName = user || 'Dr. Sarah Chen';
  const myCourses = COURSES.filter((c) => c.lecturer === lecturerName);

  // ─── Performance data ──────────────────────────────────────
  const performanceData = useMemo(() => {
    if (!selectedCourseId) return [];
    return generatePerformanceData(selectedCourseId);
  }, [selectedCourseId]);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId);

  // ─── Filter and sort ───────────────────────────────────────
  const filteredData = useMemo(() => {
    let data = performanceData;
    if (searchTerm) {
      data = data.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sort
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return sorted;
  }, [performanceData, searchTerm, sortField, sortDirection]);

  // ─── Summary stats ─────────────────────────────────────────
  const stats = useMemo(() => {
    if (performanceData.length === 0) return null;
    const overalls = performanceData.map(s => s.overallGrade);
    const avg = Math.round(overalls.reduce((a, b) => a + b, 0) / overalls.length);
    const max = Math.max(...overalls);
    const min = Math.min(...overalls);
    const passing = overalls.filter(g => g >= 65).length;
    const rate = Math.round((passing / overalls.length) * 100);
    return { avg, max, min, passing, rate, total: overalls.length };
  }, [performanceData]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleSort = (field: keyof StudentPerformance) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    toast.info('Exporting performance report...');
    setTimeout(() => toast.success('Report exported!'), 1500);
  };

  // ─── Get course assignments/quizzes for expanded row ──────
  const courseAssignments = selectedCourseId
    ? ASSIGNMENTS.filter(a => a.courseId === selectedCourseId)
    : [];
  const courseQuizzes = selectedCourseId
    ? QUIZZES.filter(q => q.courseId === selectedCourseId)
    : [];

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Student Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and analyze student performance across your courses
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download size={14} className="mr-2" /> Export Report
        </Button>
      </div>

      {/* ─── Course Selector ──────────────────────────────────── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="course-select">Select Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger id="course-select">
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {myCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} – {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search Student</Label>
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Filter by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedCourseId && (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <BarChart size={48} className="mx-auto mb-4 opacity-30" />
            <p>Select a course to view student performance</p>
          </CardContent>
        </Card>
      )}

      {selectedCourseId && selectedCourse && stats && (
        <>
          {/* ─── Summary Stats ──────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Class Average</div>
                <div className="text-2xl font-light" style={{ fontFamily: serif, color: selectedCourse.color }}>
                  {stats.avg}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Highest</div>
                <div className="text-2xl font-light text-emerald-500">
                  {stats.max}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Lowest</div>
                <div className="text-2xl font-light text-red-500">
                  {stats.min}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Passing Rate</div>
                <div className="text-2xl font-light" style={{ fontFamily: serif, color: stats.rate >= 80 ? '#22c55e' : '#ef4444' }}>
                  {stats.rate}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Performance Table ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>
                {filteredData.length} students · Click headers to sort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                        Student {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-foreground text-center" onClick={() => handleSort('assignmentAverage')}>
                        Assignments {sortField === 'assignmentAverage' && (sortDirection === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-foreground text-center" onClick={() => handleSort('quizAverage')}>
                        Quizzes {sortField === 'quizAverage' && (sortDirection === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-foreground text-center" onClick={() => handleSort('attendance')}>
                        Attendance {sortField === 'attendance' && (sortDirection === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-foreground text-center" onClick={() => handleSort('overallGrade')}>
                        Overall {sortField === 'overallGrade' && (sortDirection === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                      </TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((student) => (
                      <>
                        <TableRow key={student.studentId}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {student.assignmentAverage}%
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {student.quizAverage}%
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {student.attendance}%
                          </TableCell>
                          <TableCell className="text-center font-mono font-semibold" style={{ color: student.overallGrade >= 85 ? '#22c55e' : student.overallGrade >= 65 ? '#f59e0b' : '#ef4444' }}>
                            {student.overallGrade}%
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-sm font-bold" style={{ borderColor: student.overallGrade >= 85 ? '#22c55e' : student.overallGrade >= 65 ? '#f59e0b' : '#ef4444', color: student.overallGrade >= 85 ? '#22c55e' : student.overallGrade >= 65 ? '#f59e0b' : '#ef4444' }}>
                              {student.gradeLetter}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedStudent(expandedStudent === student.studentId ? null : student.studentId)}
                            >
                              {expandedStudent === student.studentId ? 'Hide' : 'View'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {/* ─── Expanded Row ────────────────────────── */}
                        {expandedStudent === student.studentId && (
                          <TableRow className="bg-secondary/30">
                            <TableCell colSpan={7}>
                              <div className="p-4 space-y-3">
                                <div className="text-sm font-medium">Assignment Scores</div>
                                <div className="flex flex-wrap gap-2">
                                  {courseAssignments.map((a) => (
                                    <Badge key={a.id} variant="outline" className="flex items-center gap-1">
                                      {a.title.length > 15 ? a.title.slice(0, 12) + '…' : a.title}:
                                      <span className="font-mono font-semibold">{student.assignmentScores[a.id] || '-'}%</span>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-sm font-medium mt-2">Quiz Scores</div>
                                <div className="flex flex-wrap gap-2">
                                  {courseQuizzes.map((q) => (
                                    <Badge key={q.id} variant="outline" className="flex items-center gap-1">
                                      {q.title.length > 15 ? q.title.slice(0, 12) + '…' : q.title}:
                                      <span className="font-mono font-semibold">{student.quizScores[q.id] || '-'}%</span>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Attendance:</span>
                                  <span className="font-mono font-semibold ml-2">{student.attendance}%</span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No students found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}