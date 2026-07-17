import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Video,
  Download,
  Play,
  ClipboardList,
  MessageCircle,
  Send,
  ThumbsUp,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { COURSES, ASSIGNMENTS, MATERIALS, GRADE_HISTORY, QUIZZES } from '../../data';
import { statusBg, statusColor, statusLabel, serif, mono } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';

export function CourseDetailView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const course = COURSES.find((c) => c.id === courseId);
  if (!course) {
    // If course not found, redirect to courses list
    navigate('/courses', { replace: true });
    return null;
  }

  const tab = searchParams.get('tab') || 'overview';
  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab });
  };

  const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'materials', label: 'Materials' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'quizzes', label: 'Quizzes' },   // new
  { id: 'grades', label: 'Grades' },
  { id: 'discussion', label: 'Discussion' },
];

  const courseAssignments = ASSIGNMENTS.filter((a) => a.courseId === course.id);

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
            <div>
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-2xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all ${
              tab === t.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
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
                Progress
              </h4>
              <div className="text-center">
                <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
                  {course.progress}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">complete</p>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-4">
                <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                {course.completedModules} of {course.modules} modules
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-normal text-foreground mb-3 text-sm" style={{ fontFamily: serif }}>
                Info
              </h4>
              {[
                ['Students', `${course.enrolled}`],
                ['Next Class', course.nextClass],
                ['Semester', course.semester],
                ['Grade', course.grade],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span
                    className="font-semibold text-foreground"
                    style={k === 'Grade' ? { color: course.color } : {}}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'materials' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between">
            <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
              Course Materials
            </h3>
            <span className="text-xs text-muted-foreground">{MATERIALS.length} files</span>
          </div>
          {MATERIALS.map((m, i) => (
            <div
              key={m.id}
              className={`px-5 py-4 flex items-center gap-4 hover:bg-secondary/40 transition-colors ${
                i < MATERIALS.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  m.type === 'pdf' ? 'bg-red-500/12' : 'bg-sky-500/12'
                }`}
              >
                {m.type === 'pdf' ? (
                  <FileText size={15} className="text-red-500" />
                ) : (
                  <Video size={15} className="text-sky-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {'size' in m ? m.size : m.duration} · {m.date}
                </p>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                {m.type === 'pdf' ? <Download size={15} /> : <Play size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'assignments' && (
        <div className="space-y-3">
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
                  {'score' in a && a.score != null && (
                    <p className="text-2xl font-light text-foreground mt-0.5" style={{ fontFamily: serif }}>
                      {a.score}%
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'quizzes' && (
        <div className="space-y-3">
          {(() => {
            const courseQuizzes = QUIZZES.filter((q) => q.courseId === course.id);
            if (courseQuizzes.length === 0) {
              return (
                <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
                  No quizzes available for this course yet.
                </div>
              );
            }
            return courseQuizzes.map((q) => {
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

              const canStart = q.status === 'available' || q.status === 'upcoming';

              return (
                <div
                  key={q.id}
                  className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusColor} bg-opacity-10`}>
                    <FileText size={16} className={statusColor} />
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
                    {canStart && (
                      <Button
                        size="sm"
                        className="mt-1"
                        onClick={() => toast.info(`Starting quiz: ${q.title}`)}
                      >
                        {q.attempts > 0 ? 'Resume' : 'Start'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

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
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
                Assessment Breakdown
              </h3>
            </div>
            {[
              { name: 'Assignment 1', weight: 10, score: 85 },
              { name: 'Assignment 2', weight: 15, score: 91 },
              { name: 'Quiz 1', weight: 8, score: 88 },
              { name: 'Mid-Semester Exam', weight: 30, score: null },
              { name: 'Final Project', weight: 20, score: null },
              { name: 'Final Exam', weight: 17, score: null },
            ].map((item, i, arr) => (
              <div
                key={item.name}
                className={`px-5 py-3.5 flex items-center gap-4 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Weight: {item.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground" style={{ fontFamily: mono }}>
                    {item.score != null ? `${item.score}%` : '—'}
                  </p>
                  <p className={`text-[10px] ${item.score != null ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                    {item.score != null ? 'Graded' : 'Upcoming'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              AF
            </div>
            <div className="flex-1 flex gap-2">
              <input
                placeholder="Ask a question or start a discussion…"
                className="flex-1 bg-secondary rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="bg-primary text-primary-foreground rounded-xl px-4 hover:opacity-90 transition-opacity">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}