import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Download, Edit, Save, ChevronLeft, X } from 'lucide-react';
import { CLASS_SCHEDULE, COURSES } from '../../data';
import { serif, mono } from '../../utils/helpers';

type AttendanceStatus = 'present' | 'absent' | 'absent_with_reason';

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  source: 'system' | 'manual';
  reason?: string;
  timestamp?: string;
}

interface SessionAttendance {
  sessionId: string;
  records: Record<string, AttendanceRecord>;
}

const studentList = [
  { id: 's1', name: 'Ahmad Fariz' },
  { id: 's2', name: 'Nurul Ain Farhana' },
  { id: 's3', name: 'Danial Haziq' },
  { id: 's4', name: 'Farah Syahirah' },
  { id: 's5', name: 'Hazwan Zulkifli' },
  { id: 's6', name: 'Lim Wei Xian' },
  { id: 's7', name: 'Nurul Izzah' },
  { id: 's8', name: 'Muhammad Firdaus' },
];

const createRecord = (
  studentId: string,
  status: AttendanceStatus,
  source: 'system' | 'manual' = 'manual',
  reason?: string
): AttendanceRecord => ({
  studentId,
  status,
  source,
  reason,
  timestamp: new Date().toISOString(),
});

function generateSystemAttendance(sessionId: string, courseId: string): Record<string, AttendanceRecord> {
  const records: Record<string, AttendanceRecord> = {};
  studentList.forEach((student) => {
    const seed = sessionId + student.id + courseId;
    const hash = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const rand = hash % 10;
    let status: AttendanceStatus = 'absent';
    if (rand < 7) status = 'present';
    else if (rand < 8) status = 'absent_with_reason';
    else status = 'absent';
    records[student.id] = createRecord(
      student.id,
      status,
      'system',
      status === 'absent_with_reason' ? 'Medical appointment' : undefined
    );
  });
  return records;
}

// ─── Helper: get week start (Monday) ───────────────────────
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function LecturerAttendanceSessionDetail() {
  const { courseId, type } = useParams<{ courseId: string; type?: 'lecture' | 'lab' | 'tutorial' }>();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState<Record<string, SessionAttendance>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, AttendanceStatus>>({});
  const [editReasons, setEditReasons] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const course = COURSES.find((c) => c.id === courseId);
  if (!course) {
    navigate('/lecturer/attendance');
    return null;
  }

  // ─── 1. All sessions for this course ──────────────────────
  const allSessions = useMemo(() => {
    return CLASS_SCHEDULE
      .filter((s) => s.courseCode === course.code)
      .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime());
  }, [course.code]);

  // ─── 2. Group by week and pick one session per week ──────
  // We group by week start date (Monday), then assign a sequential week index.
  const sessionsByWeek = useMemo(() => {
    const weekMap = new Map<string, any[]>(); // key = week start date string
    allSessions.forEach((s) => {
      const dateObj = new Date(s.date + 'T' + s.startTime);
      const weekStart = getWeekStart(dateObj);
      const weekKey = formatDateKey(weekStart);
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      weekMap.get(weekKey)!.push(s);
    });

    // Sort weeks by date
    const sortedWeekKeys = Array.from(weekMap.keys()).sort();
    const result: { weekIndex: number; session: any }[] = [];

    sortedWeekKeys.forEach((weekKey, idx) => {
      const sessions = weekMap.get(weekKey)!;
      // Pick primary session:
      let selected = sessions[0];
      if (type) {
        const typeLower = type.toLowerCase();
        const preferred = sessions.find((s) =>
          s.title.toLowerCase().includes(typeLower)
        );
        if (preferred) selected = preferred;
        // else keep first
      } else {
        // No type: prefer "lecture" if exists
        const lecture = sessions.find((s) =>
          s.title.toLowerCase().includes('lecture')
        );
        if (lecture) selected = lecture;
      }
      result.push({ weekIndex: idx, session: selected });
    });

    return result;
  }, [allSessions, type]);

  // ─── 3. Load / initialise attendance data ────────────────
  useEffect(() => {
    if (!courseId) return;
    const storedKey = `attendance_${courseId}`;
    const stored = localStorage.getItem(storedKey);
    if (stored) {
      try {
        setAttendanceData(JSON.parse(stored));
        return;
      } catch {}
    }
    const initial: Record<string, SessionAttendance> = {};
    allSessions.forEach((s) => {
      initial[s.id] = {
        sessionId: s.id,
        records: generateSystemAttendance(s.id, courseId),
      };
    });
    setAttendanceData(initial);
    localStorage.setItem(storedKey, JSON.stringify(initial));
  }, [courseId, allSessions]);

  const saveAttendance = (data: Record<string, SessionAttendance>) => {
    localStorage.setItem(`attendance_${courseId}`, JSON.stringify(data));
    setAttendanceData(data);
  };

  const getStatus = (studentId: string, sessionId: string): AttendanceStatus => {
    return attendanceData[sessionId]?.records[studentId]?.status || 'absent';
  };
  const getSource = (studentId: string, sessionId: string): string => {
    return attendanceData[sessionId]?.records[studentId]?.source || 'system';
  };
  const getReason = (studentId: string, sessionId: string): string => {
    return attendanceData[sessionId]?.records[studentId]?.reason || '';
  };

  const isPast = (s: any) => new Date(s.date + 'T' + s.startTime) <= new Date();

  // ─── 4. Edit mode ──────────────────────────────────────────
  const enableEditMode = () => {
    const newEditValues: Record<string, AttendanceStatus> = {};
    const newReasons: Record<string, string> = {};
    sessionsByWeek.forEach(({ weekIndex, session }) => {
      studentList.forEach((student) => {
        const key = `${weekIndex}-${student.id}`;
        newEditValues[key] = getStatus(student.id, session.id);
        newReasons[key] = getReason(student.id, session.id);
      });
    });
    setEditValues(newEditValues);
    setEditReasons(newReasons);
    setIsEditMode(true);
    console.log('Edit mode enabled. Week count:', sessionsByWeek.length);
    console.log('Edit values sample:', Object.keys(newEditValues).slice(0, 5));
  };

  const saveChanges = () => {
    const updatedData = { ...attendanceData };
    sessionsByWeek.forEach(({ weekIndex, session }) => {
      studentList.forEach((student) => {
        const key = `${weekIndex}-${student.id}`;
        const newStatus = editValues[key];
        if (newStatus !== undefined) {
          if (!updatedData[session.id]) updatedData[session.id] = { sessionId: session.id, records: {} };
          updatedData[session.id].records[student.id] = {
            studentId: student.id,
            status: newStatus,
            source: 'manual',
            reason: newStatus === 'absent_with_reason' ? editReasons[key] || '' : undefined,
            timestamp: new Date().toISOString(),
          };
        }
      });
    });
    saveAttendance(updatedData);
    toast.success(`Attendance updated for ${sessionsByWeek.length} weeks`);
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditValues({});
    setEditReasons({});
  };

  const handleStatusChange = (weekIndex: number, studentId: string, newStatus: AttendanceStatus) => {
    const key = `${weekIndex}-${studentId}`;
    setEditValues((prev) => ({ ...prev, [key]: newStatus }));
    if (newStatus !== 'absent_with_reason') {
      setEditReasons((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleReasonChange = (weekIndex: number, studentId: string, reason: string) => {
    const key = `${weekIndex}-${studentId}`;
    setEditReasons((prev) => ({ ...prev, [key]: reason }));
  };

  // ─── 5. Student statistics (only past sessions) ──────────
  const getStudentStats = (studentId: string) => {
    let total = 0,
      present = 0,
      absent = 0,
      absentWithReason = 0;
    allSessions.forEach((s) => {
      if (!isPast(s)) return;
      total++;
      const status = getStatus(studentId, s.id);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'absent_with_reason') absentWithReason++;
    });
    return { total, present, absent, absentWithReason, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  // ─── 6. Export CSV ─────────────────────────────────────────
  const handleExport = () => {
    const headers = ['Student', ...sessionsByWeek.map((_, idx) => `Week ${idx + 1}`), 'Present', 'Absent', '%'];
    const rows = studentList.map((student) => {
      const stats = getStudentStats(student.id);
      const statuses = sessionsByWeek.map(({ session }) => getStatus(student.id, session.id));
      return [student.name, ...statuses, stats.present, stats.absent, `${stats.percentage}%`];
    });
    const csv = [
      `Course: ${course.code} - ${course.title}`,
      `Type: ${type?.toUpperCase() || 'All'}`,
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${courseId}_${type || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
  };

  const filteredStudents = studentList.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── 7. Render ─────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Button variant="ghost" onClick={() => navigate('/lecturer/attendance')} className="mb-2 -ml-2">
            <ChevronLeft size={14} className="mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            {course.code} – {course.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {type?.toUpperCase() || 'All'} Attendance Matrix ({sessionsByWeek.length} weeks)
            {isEditMode ? ' – Edit mode' : ''}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={cancelEdit}>
                <X size={14} className="mr-1" /> Cancel
              </Button>
              <Button onClick={saveChanges}>
                <Save size={14} className="mr-2" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleExport}>
                <Download size={14} className="mr-2" /> Export
              </Button>
              <Button onClick={enableEditMode}>
                <Edit size={14} className="mr-2" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card w-[180px] min-w-[160px]">Student</TableHead>
                  {sessionsByWeek.map((_, idx) => (
                    <TableHead key={idx} className="text-center min-w-[70px]">
                      <div className="text-sm font-semibold">Week {idx + 1}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">A</TableHead>
                  <TableHead className="text-center">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const stats = getStudentStats(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="sticky left-0 bg-card font-medium">{student.name}</TableCell>
                      {sessionsByWeek.map(({ weekIndex, session }) => {
                        const isPastSession = isPast(session);
                        const key = `${weekIndex}-${student.id}`;
                        const currentStatus = isEditMode
                          ? editValues[key] || getStatus(student.id, session.id)
                          : getStatus(student.id, session.id);
                        const source = getSource(student.id, session.id);
                        const reason = isEditMode
                          ? editReasons[key] || getReason(student.id, session.id)
                          : getReason(student.id, session.id);

                        let bgColor = 'bg-secondary/20';
                        let label = '—';
                        let textColor = 'text-muted-foreground';
                        if (currentStatus === 'present') { bgColor = 'bg-emerald-500/20'; label = '✓'; textColor = 'text-emerald-500'; }
                        else if (currentStatus === 'absent') { bgColor = 'bg-red-500/20'; label = '✗'; textColor = 'text-red-500'; }
                        else if (currentStatus === 'absent_with_reason') { bgColor = 'bg-amber-500/20'; label = '⚠'; textColor = 'text-amber-500'; }

                        return (
                          <TableCell key={weekIndex} className="text-center">
                            {isEditMode ? (
                              <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                <Select
                                  value={currentStatus}
                                  onValueChange={(val) => handleStatusChange(weekIndex, student.id, val as AttendanceStatus)}
                                >
                                  <SelectTrigger className="h-7 w-24 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="absent_with_reason">Absent (Reason)</SelectItem>
                                  </SelectContent>
                                </Select>
                                {currentStatus === 'absent_with_reason' && (
                                  <Input
                                    placeholder="Reason..."
                                    value={editReasons[key] || ''}
                                    onChange={(e) => handleReasonChange(weekIndex, student.id, e.target.value)}
                                    className="h-6 w-24 text-xs"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className={`${isPastSession ? bgColor : ''} rounded p-1`} title={isPastSession ? `${currentStatus}${reason ? '\nReason: '+reason : ''}\nSource: ${source}` : 'Future session'}>
                                {isPastSession ? (
                                  <span className={`text-sm font-medium ${textColor}`}>
                                    {label}
                                    {source === 'manual' && <span className="ml-0.5 text-[8px] text-amber-500">*</span>}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-mono text-emerald-500">{stats.present}</TableCell>
                      <TableCell className="text-center font-mono text-red-500">{stats.absent + stats.absentWithReason}</TableCell>
                      <TableCell className="text-center font-bold" style={{ fontFamily: mono, color: stats.percentage >= 80 ? '#22c55e' : stats.percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                        {stats.percentage}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/20" /> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/20" /> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/20" /> Absent (Reason)</span>
            <span className="flex items-center gap-1"><span className="text-[10px]">*</span> Manual override</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  // only the first 2 week is working
}
