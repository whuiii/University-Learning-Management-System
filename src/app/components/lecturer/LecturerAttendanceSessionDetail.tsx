import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export function LecturerAttendanceSessionDetail() {
  const { courseId, type } = useParams<{ courseId: string; type: 'lecture' | 'lab' | 'tutorial' }>();
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

  // All sessions for this course, filtered by type
  const sessions = useMemo(() => {
    if (!courseId || !type) return [];
    return CLASS_SCHEDULE
      .filter((s) => s.courseId === courseId && s.type === type)
      .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime());
  }, [courseId, type]);

  // Map week number to session
  const sessionsByWeek = useMemo(() => {
    const map: Record<number, any> = {};
    sessions.forEach((s) => {
      const match = s.title.match(/(\d+)/);
      const week = match ? parseInt(match[1]) : Math.ceil((new Date(s.date).getTime() - new Date('2026-07-13').getTime()) / (7 * 24 * 60 * 60 * 1000));
      map[week] = s;
    });
    return map;
  }, [sessions]);

  const maxWeek = Math.max(12, ...Object.keys(sessionsByWeek).map(Number));

  // Load attendance from localStorage
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
    sessions.forEach((s) => {
      initial[s.id] = {
        sessionId: s.id,
        records: generateSystemAttendance(s.id, courseId),
      };
    });
    setAttendanceData(initial);
    localStorage.setItem(storedKey, JSON.stringify(initial));
  }, [courseId, sessions]);

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

  // Enable edit mode – populate editValues and editReasons from current data
  const enableEditMode = () => {
    const newEditValues: Record<string, AttendanceStatus> = {};
    const newReasons: Record<string, string> = {};
    sessions.forEach((s) => {
      if (!isPast(s)) return;
      studentList.forEach((student) => {
        const key = `${student.id}-${s.id}`;
        newEditValues[key] = getStatus(student.id, s.id);
        newReasons[key] = getReason(student.id, s.id);
      });
    });
    setEditValues(newEditValues);
    setEditReasons(newReasons);
    setIsEditMode(true);
  };

  // Save changes
  const saveChanges = () => {
    const updatedData = { ...attendanceData };
    sessions.forEach((s) => {
      if (!isPast(s)) return;
      studentList.forEach((student) => {
        const key = `${student.id}-${s.id}`;
        const newStatus = editValues[key];
        if (newStatus !== undefined) {
          if (!updatedData[s.id]) updatedData[s.id] = { sessionId: s.id, records: {} };
          updatedData[s.id].records[student.id] = {
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
    toast.success('Attendance updated');
    setIsEditMode(false);
  };

  // Cancel edit mode – discard changes
  const cancelEdit = () => {
    setIsEditMode(false);
    setEditValues({});
    setEditReasons({});
  };

  // Handle status change in edit mode
  const handleStatusChange = (studentId: string, sessionId: string, newStatus: AttendanceStatus) => {
    const key = `${studentId}-${sessionId}`;
    setEditValues((prev) => ({ ...prev, [key]: newStatus }));
    if (newStatus !== 'absent_with_reason') {
      setEditReasons((prev) => ({ ...prev, [key]: '' }));
    }
  };

  // Handle reason change in edit mode
  const handleReasonChange = (studentId: string, sessionId: string, reason: string) => {
    const key = `${studentId}-${sessionId}`;
    setEditReasons((prev) => ({ ...prev, [key]: reason }));
  };

  // Student statistics
  const getStudentStats = (studentId: string) => {
    let total = 0,
      present = 0,
      absent = 0,
      absentWithReason = 0;
    sessions.forEach((s) => {
      if (!isPast(s)) return;
      total++;
      const status = getStatus(studentId, s.id);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'absent_with_reason') absentWithReason++;
    });
    return { total, present, absent, absentWithReason, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  // Export CSV
  const handleExport = () => {
    const headers = ['Student', ...Array.from({ length: maxWeek }, (_, i) => `Week ${i+1}`), 'Present', 'Absent', '%'];
    const rows = studentList.map((student) => {
      const stats = getStudentStats(student.id);
      const statuses = Array.from({ length: maxWeek }, (_, i) => {
        const weekNum = i + 1;
        const session = sessionsByWeek[weekNum];
        return session ? getStatus(student.id, session.id) : '—';
      });
      return [student.name, ...statuses, stats.present, stats.absent, `${stats.percentage}%`];
    });
    const csv = [
      `Course: ${course.code} - ${course.title}`,
      `Type: ${type?.toUpperCase()}`,
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${courseId}_${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
  };

  const filteredStudents = studentList.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div  className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Button variant="ghost" onClick={() => navigate('/lecturer/attendance')} className="mb-2 -ml-2">
            <ChevronLeft size={14} className="mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            {course.code} – {course.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {type?.toUpperCase()} Attendance Matrix (Weeks 1–{maxWeek})
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
                  {Array.from({ length: maxWeek }, (_, i) => (
                    <TableHead key={i} className="text-center min-w-[70px]">
                      <div className="text-sm font-semibold">Week {i + 1}</div>
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
                      {Array.from({ length: maxWeek }, (_, i) => {
                        const weekNum = i + 1;
                        const session = sessionsByWeek[weekNum];
                        if (!session) {
                          return <TableCell key={i} className="text-center text-muted-foreground">—</TableCell>;
                        }
                        const isPastSession = isPast(session);
                        const currentStatus = isEditMode && isPastSession
                          ? editValues[`${student.id}-${session.id}`] || getStatus(student.id, session.id)
                          : getStatus(student.id, session.id);
                        const source = getSource(student.id, session.id);
                        const reason = isEditMode && isPastSession
                          ? editReasons[`${student.id}-${session.id}`] || getReason(student.id, session.id)
                          : getReason(student.id, session.id);

                        let bgColor = 'bg-secondary/20';
                        let label = '—';
                        let textColor = 'text-muted-foreground';
                        if (currentStatus === 'present') { bgColor = 'bg-emerald-500/20'; label = '✓'; textColor = 'text-emerald-500'; }
                        else if (currentStatus === 'absent') { bgColor = 'bg-red-500/20'; label = '✗'; textColor = 'text-red-500'; }
                        else if (currentStatus === 'absent_with_reason') { bgColor = 'bg-amber-500/20'; label = '⚠'; textColor = 'text-amber-500'; }

                        return (
                          <TableCell key={i} className="text-center">
                            {isEditMode && isPastSession ? (
                              <div className="flex flex-col items-center gap-1 min-w-[100px]">
                                <Select
                                  value={currentStatus}
                                  onValueChange={(val) => handleStatusChange(student.id, session.id, val as AttendanceStatus)}
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
                                    value={editReasons[`${student.id}-${session.id}`] || ''}
                                    onChange={(e) => handleReasonChange(student.id, session.id, e.target.value)}
                                    className="h-6 w-24 text-xs"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className={`${bgColor} rounded p-1`} title={isPastSession ? `${currentStatus}${reason ? '\nReason: '+reason : ''}\nSource: ${source}` : 'No session'}>
                                {isPastSession ? (
                                  <span className={`text-sm font-medium ${textColor}`}>
                                    {label}
                                    {source === 'manual' && <span className="ml-0.5 text-[8px] text-amber-500">*</span>}
                                  </span>
                                ) : <span className="text-sm text-muted-foreground">—</span>}
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
}