// pages/lecturer/LecturerCourseDetail.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users,
  BookOpen,
  FileText,
  Video,
  ClipboardList,
  BarChart,
  Bell,
  Plus,
  Search,
  Download,
  ChevronRight,
  Clock,
  CheckCircle2,
  MessageCircle,
  Send,
  ThumbsUp,
  Calendar,
  Trash2,
  Edit,
  Pin,
  Upload,
  Link,
  X,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GRADE_HISTORY } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif, mono, statusBg, statusColor, statusLabel } from '../../utils/helpers';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useCourseData } from '../hooks/useCourseData';

export function LecturerCourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    courseData,
    loading,
    addMaterial,
    deleteMaterial,
    addAssignment,
    deleteAssignment,
    addQuiz,
    deleteQuiz,
    addAnnouncement,
    deleteAnnouncement,
    updateOverview,
    updateGrade,
  } = useCourseData(courseId!);

  // ─── State for tab and modals ────────────────────────────
  const [tab, setTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Overview edit
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editOutcomes, setEditOutcomes] = useState<string[]>([]);

  // Announcement modal
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '', pinned: false });

  // Material modal
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'pdf' as 'pdf' | 'video' | 'link', url: '' });

  // Assignment modal
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', weight: 10, type: '' });

  // Quiz modal – includes maxAttempts now
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    dueDate: '',
    duration: 30,
    totalQuestions: 10,
    status: 'upcoming' as 'upcoming' | 'available' | 'completed' | 'graded',
    maxAttempts: 1, // 👈 FIXED: added here
  });

  // Grade editing
  const [editingGrades, setEditingGrades] = useState<Record<string, string>>({});

  // ─── Check URL params to open modals ──────────────────────
  useEffect(() => {
    const openModal = searchParams.get('openModal');
    const tabParam = searchParams.get('tab');
    if (tabParam) setTab(tabParam);
    if (openModal === 'true') {
      if (tabParam === 'announcements') setShowAnnounceModal(true);
      else if (tabParam === 'materials') setShowMaterialModal(true);
      else if (tabParam === 'assignments') setShowAssignmentModal(true);
      else if (tabParam === 'quizzes') setShowQuizModal(true);
    }
  }, [searchParams]);

  // ─── Sync edit fields with course data ────────────────────
  useEffect(() => {
    if (courseData) {
      setEditDescription(courseData.description || '');
      setEditOutcomes(courseData.learningOutcomes || []);
    }
  }, [courseData]);

  if (loading) return <div className="p-10 text-center">Loading course...</div>;
  if (!courseData) {
    navigate('/lecturer/courses', { replace: true });
    return null;
  }

  const course = courseData;

  // ─── Handlers ──────────────────────────────────────────────
  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.body.trim()) {
      toast.error('Please fill in both title and body');
      return;
    }
    addAnnouncement({ ...newAnnouncement, courseId: course.id });
    toast.success('Announcement posted!');
    setShowAnnounceModal(false);
    setNewAnnouncement({ title: '', body: '', pinned: false });
  };

  const handleUploadMaterial = () => {
    if (!newMaterial.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    addMaterial(newMaterial);
    toast.success('Material uploaded!');
    setShowMaterialModal(false);
    setNewMaterial({ title: '', type: 'pdf', url: '' });
  };

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.dueDate || !newAssignment.type) {
      toast.error('Please fill in all fields');
      return;
    }
    addAssignment({ ...newAssignment, courseId: course.id });
    toast.success('Assignment created!');
    setShowAssignmentModal(false);
    setNewAssignment({ title: '', dueDate: '', weight: 10, type: '' });
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title.trim() || !newQuiz.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    addQuiz({ ...newQuiz, courseId: course.id });
    toast.success('Quiz created!');
    setShowQuizModal(false);
    setNewQuiz({
      title: '',
      dueDate: '',
      duration: 30,
      totalQuestions: 10,
      status: 'upcoming',
      maxAttempts: 1,
    });
  };

  const handleSaveOverview = () => {
    updateOverview(editDescription, editOutcomes);
    setIsEditingOverview(false);
    toast.success('Overview updated');
  };

  const handleSaveGrades = () => {
    Object.entries(editingGrades).forEach(([key, value]) => {
      const [studentId, assignmentId] = key.split('-');
      const score = parseFloat(value);
      if (!isNaN(score)) {
        updateGrade(studentId, assignmentId, score);
      }
    });
    toast.success('Grades saved');
    setEditingGrades({});
  };

  // ─── Tabs definition ──────────────────────────────────────
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTab('announcements');
                  setShowAnnounceModal(true);
                }}
              >
                <Bell size={14} className="mr-2" /> Announce
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/lecturer/courses/${courseId}/materials/upload`)}
              >
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

      {/* ─── Tab Content ────────────────────────────────────── */}

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
                About this Course
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setIsEditingOverview(!isEditingOverview)}>
                {isEditingOverview ? <X size={14} /> : <Edit size={14} />}
              </Button>
            </div>
            {isEditingOverview ? (
              <div className="space-y-4">
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  placeholder="Course description..."
                />
                <div>
                  <Label>Learning Outcomes</Label>
                  {editOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2 mt-1">
                      <Input
                        value={outcome}
                        onChange={(e) => {
                          const newOutcomes = [...editOutcomes];
                          newOutcomes[idx] = e.target.value;
                          setEditOutcomes(newOutcomes);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOutcomes = editOutcomes.filter((_, i) => i !== idx);
                          setEditOutcomes(newOutcomes);
                        }}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setEditOutcomes([...editOutcomes, ''])}
                  >
                    <Plus size={14} className="mr-1" /> Add Outcome
                  </Button>
                </div>
                <Button onClick={handleSaveOverview}>Save Overview</Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{course.description}</p>
                <h4 className="font-semibold text-sm text-foreground mb-3">Learning Outcomes</h4>
                <ul className="space-y-2.5">
                  {(course.learningOutcomes || []).map((lo, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      {lo}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          {/* Quick stats */}
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
                  <span className="font-semibold">{course.assignments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quizzes</span>
                  <span className="font-semibold">{course.quizzes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="font-semibold">{course.materials.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Grade</span>
                  <span className="font-semibold" style={{ color: course.color }}>
                    {course.gradeValue}%
                  </span>
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

      {/* Announcements Tab */}
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
          {course.announcements.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-4">
              {course.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`bg-card border rounded-2xl p-5 hover:border-primary/20 transition-colors ${
                    ann.pinned ? 'border-primary/30' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {ann.pinned && <Pin size={14} className="text-primary flex-shrink-0" />}
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
                      onClick={() => deleteAnnouncement(ann.id)}
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

      {/* Materials Tab */}
      {tab === 'materials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Course Materials
            </h3>
            <Button onClick={() => navigate(`/lecturer/courses/${courseId}/materials/upload`)}>
              <Upload size={14} className="mr-2" /> Upload Material
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {course.materials.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">No materials uploaded yet.</div>
            ) : (
              course.materials.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i < course.materials.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {m.type === 'pdf' ? (
                      <FileText size={16} className="text-red-500" />
                    ) : m.type === 'video' ? (
                      <Video size={16} className="text-sky-400" />
                    ) : (
                      <Link size={16} className="text-blue-400" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.date} · {m.size || m.duration || ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {m.url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={m.url} target="_blank" rel="noopener noreferrer">
                          <Link size={14} />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteMaterial(m.id)}>
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {tab === 'assignments' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAssignmentModal(true)}>
              <Plus size={14} className="mr-2" /> New Assignment
            </Button>
          </div>
          {course.assignments.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
              No assignments yet.
            </div>
          ) : (
            course.assignments.map((a) => (
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
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <p className={`text-xs font-bold ${statusColor(a.status)}`}>{statusLabel(a.status)}</p>
                  <Button variant="ghost" size="sm" onClick={() => deleteAssignment(a.id)} className="text-red-500">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quizzes Tab */}
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
          {course.quizzes.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
              No quizzes created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {course.quizzes.map((q) => {
                const statusColorMap = {
                  upcoming: 'text-blue-500',
                  available: 'text-emerald-500',
                  completed: 'text-amber-500',
                  graded: 'text-sky-400',
                };
                const statusLabelMap = {
                  upcoming: 'Upcoming',
                  available: 'Available',
                  completed: 'Submitted',
                  graded: 'Graded',
                };
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
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <p className={`text-xs font-bold ${statusColorMap[q.status]}`}>{statusLabelMap[q.status]}</p>
                      {q.status === 'graded' && q.score !== null && (
                        <p className="text-2xl font-light text-foreground mt-0.5" style={{ fontFamily: serif }}>
                          {q.score}%
                        </p>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteQuiz(q.id)} className="text-red-500">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
              Enrolled Students ({course.students.length})
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {course.students
                  .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium">{s.name}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{s.email}</td>
                      <td className="px-5 py-3">
                        <Button size="sm" variant="ghost">
                          Contact
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grades Tab */}
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
              <Button size="sm" variant="outline" onClick={handleSaveGrades}>
                <Download size={14} className="mr-2" /> Save All Grades
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Student</th>
                    {course.assignments.map((a) => (
                      <th key={a.id} className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">
                        {a.title.length > 12 ? a.title.slice(0, 10) + '…' : a.title}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">Final</th>
                  </tr>
                </thead>
                <tbody>
                  {course.students.map((s) => {
                    let total = 0,
                      count = 0;
                    course.assignments.forEach((a) => {
                      const score = course.grades[s.id]?.[a.id];
                      if (score !== undefined) {
                        total += score;
                        count++;
                      }
                    });
                    const final = count > 0 ? Math.round(total / count) : 0;
                    return (
                      <tr key={s.id} className="border-t border-border hover:bg-secondary/40 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium">{s.name}</td>
                        {course.assignments.map((a) => {
                          const currentScore = course.grades[s.id]?.[a.id] ?? '';
                          return (
                            <td key={a.id} className="px-3 py-3 text-center">
                              <Input
                                className="w-16 h-8 text-center mx-auto"
                                placeholder="—"
                                value={
                                  editingGrades[`${s.id}-${a.id}`] !== undefined
                                    ? editingGrades[`${s.id}-${a.id}`]
                                    : currentScore
                                }
                                onChange={(e) =>
                                  setEditingGrades({
                                    ...editingGrades,
                                    [`${s.id}-${a.id}`]: e.target.value,
                                  })
                                }
                              />
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-center font-semibold">{final > 0 ? `${final}%` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end">
              <Button onClick={handleSaveGrades}>Save All Grades</Button>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Tab – kept as placeholder, you can extend similarly */}
      {tab === 'discussion' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
            Discussion feature coming soon.
          </div>
        </div>
      )}

      {/* ─── Modals ────────────────────────────────────────── */}

      {/* Announcement Modal */}
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
              <Label htmlFor="ann-pin" className="text-sm">
                Pin this announcement
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnounceModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePostAnnouncement}>Post Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Modal – kept for quick upload, but the main upload is on separate page */}
      <Dialog open={showMaterialModal} onOpenChange={setShowMaterialModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Quick Upload</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mat-title">Title</Label>
              <Input
                id="mat-title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                placeholder="e.g., Lecture 3 slides"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-type">Type</Label>
              <Select
                value={newMaterial.type}
                onValueChange={(val: any) => setNewMaterial({ ...newMaterial, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-url">URL (optional)</Label>
              <Input
                id="mat-url"
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaterialModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadMaterial}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ass-title">Title</Label>
              <Input
                id="ass-title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="e.g., Programming Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ass-due">Due Date</Label>
              <Input
                id="ass-due"
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ass-weight">Weight (%)</Label>
              <Input
                id="ass-weight"
                type="number"
                value={newAssignment.weight}
                onChange={(e) => setNewAssignment({ ...newAssignment, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ass-type">Type</Label>
              <Input
                id="ass-type"
                value={newAssignment.type}
                onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                placeholder="e.g., Programming, Report, Quiz"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignmentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Modal – with maxAttempts field */}
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
                  min={1}
                  value={newQuiz.duration}
                  onChange={(e) => setNewQuiz({ ...newQuiz, duration: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-questions">Number of Questions</Label>
                <Input
                  id="quiz-questions"
                  type="number"
                  min={1}
                  value={newQuiz.totalQuestions}
                  onChange={(e) => setNewQuiz({ ...newQuiz, totalQuestions: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-maxAttempts">Max Attempts</Label>
              <Input
                id="quiz-maxAttempts"
                type="number"
                min={1}
                value={newQuiz.maxAttempts}
                onChange={(e) => setNewQuiz({ ...newQuiz, maxAttempts: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-status">Status</Label>
              <Select
                value={newQuiz.status}
                onValueChange={(value: any) => setNewQuiz({ ...newQuiz, status: value })}
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
            <Button variant="outline" onClick={() => setShowQuizModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuiz}>Create Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}