import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users, BookOpen, FileText, Video, ClipboardList,
  BarChart, Bell, Plus, Search, Download, ChevronRight,
  Clock, CheckCircle2, MessageCircle, Send, ThumbsUp,
  Calendar, Trash2, Edit, Pin, Upload, Link,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { COURSES, ASSIGNMENTS, MATERIALS, GRADE_HISTORY, QUIZZES } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif, mono, statusBg, statusColor, statusLabel } from '../../utils/helpers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

// ─── Mock students ───────────────────────────────────────────
function getMockStudents(courseId: string) {
  const students = [
    { id: 's1', name: 'Ahmad Fariz', email: 'ahmad.fariz@utn.edu.my', grade: 'A-', progress: 85 },
    { id: 's2', name: 'Nurul Ain Farhana', email: 'nurul.ain@utn.edu.my', grade: 'B+', progress: 72 },
    { id: 's3', name: 'Danial Haziq', email: 'danial.haziq@utn.edu.my', grade: 'C+', progress: 60 },
    { id: 's4', name: 'Farah Syahirah', email: 'farah.syahirah@utn.edu.my', grade: 'A', progress: 92 },
    { id: 's5', name: 'Hazwan Zulkifli', email: 'hazwan.zulkifli@utn.edu.my', grade: 'B', progress: 78 },
    { id: 's6', name: 'Lim Wei Xian', email: 'lim.weixian@utn.edu.my', grade: 'A-', progress: 88 },
  ];
  const seed = courseId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const shuffled = [...students];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(5 + seed % 3, shuffled.length));
}

// ─── Types ────────────────────────────────────────────────────
interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
  author: string;
}

interface QuizForm {
  title: string;
  dueDate: string;
  duration: number;
  totalQuestions: number;
  status: 'upcoming' | 'available' | 'completed' | 'graded';
}

// ─── Component ──────────────────────────────────────────────
export function LecturerCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const course = COURSES.find((c) => c.id === courseId);
  if (!course) {
    navigate('/lecturer/courses', { replace: true });
    return null;
  }

  // ─── States ──────────────────────────────────────────────
  const [tab, setTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '', pinned: false });
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState<QuizForm>({
    title: '',
    dueDate: '',
    duration: 30,
    totalQuestions: 10,
    status: 'upcoming',
  });

  const students = useMemo(() => getMockStudents(courseId!), [courseId]);
  const courseAssignments = ASSIGNMENTS.filter((a) => a.courseId === course.id);
  const courseQuizzes = QUIZZES.filter((q) => q.courseId === course.id);

  // ─── Load announcements from localStorage ──────────────────
  useEffect(() => {
    const stored = localStorage.getItem(`announcements_${course.id}`);
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    } else {
      // Seed with sample announcements
      const sample: Announcement[] = [
        {
          id: 'ann1',
          title: 'Welcome to the Course!',
          body: 'Please review the syllabus and complete the pre‑course survey.',
          date: new Date().toISOString().split('T')[0],
          pinned: true,
          author: user || 'Dr. Sarah Chen',
        },
        {
          id: 'ann2',
          title: 'Lab Session Rescheduled',
          body: 'The lab session for this week is moved to Thursday 10 AM.',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          pinned: false,
          author: user || 'Dr. Sarah Chen',
        },
      ];
      setAnnouncements(sample);
      localStorage.setItem(`announcements_${course.id}`, JSON.stringify(sample));
    }
  }, [course.id, user]);

  const saveAnnouncements = (data: Announcement[]) => {
    localStorage.setItem(`announcements_${course.id}`, JSON.stringify(data));
    setAnnouncements(data);
  };

  // ─── Handlers ──────────────────────────────────────────────
  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.body.trim()) {
      toast.error('Please fill in both title and body');
      return;
    }
    const newItem: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      body: newAnnouncement.body,
      date: new Date().toISOString().split('T')[0],
      pinned: newAnnouncement.pinned,
      author: user || 'Dr. Sarah Chen',
    };
    const updated = [newItem, ...announcements];
    saveAnnouncements(updated);
    toast.success('Announcement posted!');
    setShowAnnounceModal(false);
    setNewAnnouncement({ title: '', body: '', pinned: false });
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
    toast.success('Announcement deleted');
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title.trim() || !newQuiz.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    // In a real app, you'd POST to the server and refresh the list
    toast.success(`Quiz "${newQuiz.title}" created!`);
    setShowQuizModal(false);
    setNewQuiz({ title: '', dueDate: '', duration: 30, totalQuestions: 10, status: 'upcoming' });
  };

  // ─── Tabs ──────────────────────────────────────────────────
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'materials', label: 'Materials' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'students', label: 'Students' },
    { id: 'grades', label: 'Grades' },
    { id: 'discussion', label: 'Discussion' },
  ];

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border border-border">
        <div className="h-44 relative" style={{ background: `${course.color}20` }}>
          <img
            src={`https://images.unsplash.com/${course.image}?w=1200&h=320&fit=crop&auto=format`}
            alt={course.title}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <div className="flex-1">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg inline-block mb-3 text-white" style={{ background: course.color }}>
                {course.code}
              </span>
              <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
                {course.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {course.lecturer} · {course.faculty} · {course.semester}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setTab('announcements')}>
                <Bell size={14} className="mr-2" /> Announce
              </Button>
              <Button size="sm" onClick={() => setTab('materials')}>
                <Upload size={14} className="mr-2" /> Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-2xl p-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ──────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h3 className="font-normal text-foreground mb-3" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              About this Course
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{course.description}</p>
            <h4 className="font-semibold text-sm text-foreground mb-3">Learning Outcomes</h4>
            <ul className="space-y-2.5">
              {[
                'Analyse algorithm time and space complexity using Big-O notation',
                'Implement core data structures including trees, heaps, and hash tables',
                'Apply appropriate data structures to solve real engineering problems',
                'Debug and optimise implementations for real-world performance',
              ].map((lo) => (
                <li key={lo} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  {lo}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-normal text-foreground mb-4 text-sm" style={{ fontFamily: serif }}>
                Quick Stats
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-semibold">{course.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assignments</span>
                  <span className="font-semibold">{courseAssignments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quizzes</span>
                  <span className="font-semibold">{courseQuizzes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="font-semibold">{MATERIALS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Grade</span>
                  <span className="font-semibold" style={{ color: course.color }}>{course.gradeValue}%</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Course Progress</span>
                  <span style={{ fontFamily: mono }}>{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-normal text-foreground mb-3 text-sm" style={{ fontFamily: serif }}>
                Next Class
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span>{course.nextClass}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Announcements Tab ────────────────────────────── */}
      {tab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Course Announcements
            </h3>
            <Button onClick={() => setShowAnnounceModal(true)}>
              <Plus size={14} className="mr-2" /> New Announcement
            </Button>
          </div>
          {announcements.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`bg-card border rounded-2xl p-5 hover:border-primary/20 transition-colors ${
                    ann.pinned ? 'border-primary/30' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {ann.pinned && (
                          <Pin size={14} className="text-primary flex-shrink-0" />
                        )}
                        <h4 className="font-semibold text-foreground">{ann.title}</h4>
                        <span className="text-xs text-muted-foreground ml-auto">{ann.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ann.body}</p>
                      <p className="text-xs text-muted-foreground mt-2">Posted by: {ann.author}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Materials Tab ──────────────────────────────────── */}
      {tab === 'materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Course Materials
            </h3>
            <Button variant="outline" onClick={() => toast.info('Upload dialog would open')}>
              <Upload size={14} className="mr-2" /> Upload Material
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {MATERIALS.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">No materials uploaded yet.</div>
            ) : (
              MATERIALS.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i < MATERIALS.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {m.type === 'pdf' ? (
                      <FileText size={16} className="text-red-500" />
                    ) : (
                      <Video size={16} className="text-sky-400" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.date} · {'size' in m ? m.size : m.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Download size={14} />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── Assignments Tab ────────────────────────────────── */}
      {tab === 'assignments' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm"><Plus size={14} className="mr-2" /> New Assignment</Button>
          </div>
          {courseAssignments.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
              No assignments yet.
            </div>
          ) : (
            courseAssignments.map((a) => (
              <div
                key={a.id}
                className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusBg(a.status)}`}>
                  <ClipboardList size={16} className={statusColor(a.status)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Due {a.dueDate} · Weight: {a.weight}% · {a.type}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${statusColor(a.status)}`}>{statusLabel(a.status)}</p>
                  <Button size="sm" variant="ghost">Grade</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── Quizzes Tab ────────────────────────────────────── */}
      {tab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Online Quizzes
            </h3>
            <Button onClick={() => setShowQuizModal(true)}>
              <Plus size={14} className="mr-2" /> Create Quiz
            </Button>
          </div>
          {courseQuizzes.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              No quizzes created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {courseQuizzes.map((q) => {
                const statusColor = {
                  upcoming: 'text-blue-500',
                  available: 'text-emerald-500',
                  completed: 'text-amber-500',
                  graded: 'text-sky-400',
                }[q.status];
                const statusLabel = {
                  upcoming: 'Upcoming',
                  available: 'Available',
                  completed: 'Submitted',
                  graded: 'Graded',
                }[q.status];
                return (
                  <div
                    key={q.id}
                    className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{q.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {q.duration} min · {q.totalQuestions} questions · Due {q.dueDate}
                        {q.attempts > 0 && ` · Attempts: ${q.attempts}/${q.maxAttempts}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-bold ${statusColor}`}>{statusLabel}</p>
                      {q.status === 'graded' && q.score !== null && (
                        <p className="text-2xl font-light text-foreground mt-0.5" style={{ fontFamily: serif }}>
                          {q.score}%
                        </p>
                      )}
                      <div className="flex gap-1 mt-1 justify-end">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="ghost" className="text-red-500">Delete</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Students Tab ───────────────────────────────────── */}
      {tab === 'students' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
              Enrolled Students ({students.length})
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 w-48"
                />
              </div>
              <Button size="sm" variant="outline">
                <Download size={14} className="mr-2" /> Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Grade</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Progress</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium">{s.name}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{s.email}</td>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: course.color }}>{s.grade}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: course.color }} />
                        </div>
                        <span className="text-xs" style={{ fontFamily: mono }}>{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Button size="sm" variant="ghost">Contact</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Grades Tab ──────────────────────────────────────── */}
      {tab === 'grades' && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-normal text-foreground" style={{ fontFamily: serif }}>
                Grade Trend
              </h3>
              <span className="text-3xl font-light" style={{ fontFamily: serif, color: course.color }}>
                {course.grade}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={GRADE_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey={course.id}
                  stroke={course.color}
                  strokeWidth={2.5}
                  dot={{ fill: course.color, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
                Assessment Breakdown
              </h3>
              <Button size="sm" variant="outline">
                <Download size={14} className="mr-2" /> Export Grades
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Student</th>
                    {courseAssignments.map((a) => (
                      <th key={a.id} className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">
                        {a.title.length > 12 ? a.title.slice(0, 10) + '…' : a.title}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">Final</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium">{s.name}</td>
                      {courseAssignments.map((a) => (
                        <td key={a.id} className="px-3 py-3 text-center">
                          <Input
                            className="w-16 h-8 text-center mx-auto"
                            placeholder="—"
                            value={editingGrades[`${s.id}-${a.id}`] || ''}
                            onChange={(e) => setEditingGrades({
                              ...editingGrades,
                              [`${s.id}-${a.id}`]: e.target.value
                            })}
                          />
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center font-semibold">
                        {Math.round(70 + Math.random() * 25)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end">
              <Button onClick={() => toast.success('Grades saved successfully')}>
                Save All Grades
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Discussion Tab ──────────────────────────────────── */}
      {tab === 'discussion' && (
        <div className="space-y-4">
          {[
            {
              author: 'Nurul Ain Farhana',
              initials: 'NA',
              time: '2h ago',
              body: 'Can someone explain the practical difference between min-heap and max-heap? I understand the theory but am unsure when to prefer one over the other.',
              replies: 3,
              likes: 5,
              lecturer: false,
            },
            {
              author: 'Danial Haziq',
              initials: 'DH',
              time: '5h ago',
              body: 'For the binary tree traversal assignment — are we expected to implement all three traversals (pre/in/post-order) or just one?',
              replies: 7,
              likes: 2,
              lecturer: false,
            },
            {
              author: 'Dr. Sarah Chen',
              initials: 'SC',
              time: 'Yesterday 4:15 PM',
              body: 'Reminder: Lab 8 will focus on AVL tree rotations. Please review Chapter 7 before attending. The lab worksheet will be available Monday morning on this portal.',
              replies: 1,
              likes: 14,
              lecturer: true,
            },
          ].map((post, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                  style={{
                    background: post.lecturer ? course.color : 'var(--secondary)',
                    color: post.lecturer ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {post.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{post.author}</span>
                    {post.lecturer && (
                      <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                        Lecturer
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">{post.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.body}</p>
                  <div className="flex items-center gap-5 mt-3">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle size={12} /> {post.replies}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp size={12} /> {post.likes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-card border border-border rounded-2xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              SC
            </div>
            <div className="flex-1 flex gap-2">
              <input
                placeholder="Post a reply as lecturer…"
                className="flex-1 bg-secondary rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="bg-primary text-primary-foreground rounded-xl px-4 hover:opacity-90 transition-opacity">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Announcement Modal ────────────────────────────── */}
      <Dialog open={showAnnounceModal} onOpenChange={setShowAnnounceModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Post New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ann-body">Body</Label>
              <Textarea
                id="ann-body"
                value={newAnnouncement.body}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })}
                placeholder="Write your announcement..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ann-pin"
                checked={newAnnouncement.pinned}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })}
              />
              <Label htmlFor="ann-pin" className="text-sm">Pin this announcement</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnounceModal(false)}>Cancel</Button>
            <Button onClick={handlePostAnnouncement}>Post Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Quiz Modal ────────────────────────────────────── */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                placeholder="e.g., Mid-term Quiz 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-due">Due Date</Label>
              <Input
                id="quiz-due"
                type="datetime-local"
                value={newQuiz.dueDate}
                onChange={(e) => setNewQuiz({ ...newQuiz, dueDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-duration">Duration (minutes)</Label>
                <Input
                  id="quiz-duration"
                  type="number"
                  value={newQuiz.duration}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-questions">Number of Questions</Label>
                <Input
                  id="quiz-questions"
                  type="number"
                  value={newQuiz.totalQuestions}
                  onChange={(e) => setNewQuiz({ ...newQuiz, totalQuestions: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-status">Status</Label>
              <Select
                value={newQuiz.status}
                onValueChange={(value) => setNewQuiz({ ...newQuiz, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuizModal(false)}>Cancel</Button>
            <Button onClick={handleCreateQuiz}>Create Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}