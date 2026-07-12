import { useNavigate } from 'react-router-dom';
import { BookMarked, Inbox, Users, Award, Plus, FileCheck, BookOpen } from 'lucide-react';
import { COURSES } from '../../data';
import { serif, mono } from '../../utils/helpers';

export function LecturerDashboard() {
  const navigate = useNavigate();

  const pendingSubmissions = [
    { student: 'Nurul Ain Farhana', course: 'CS201', assignment: 'Binary Tree Traversal', submitted: '2h ago', urgent: false },
    { student: 'Danial Haziq', course: 'CS201', assignment: 'Binary Tree Traversal', submitted: '3h ago', urgent: false },
    { student: 'Farah Syahirah', course: 'CS302', assignment: 'UML Class Diagram', submitted: '5h ago', urgent: true },
    { student: 'Hazwan Zulkifli', course: 'CS302', assignment: 'UML Class Diagram', submitted: '1d ago', urgent: true },
    { student: 'Lim Wei Xian', course: 'CS201', assignment: 'Binary Tree Traversal', submitted: '1d ago', urgent: false },
  ];

  const classPerf = COURSES.slice(0, 3).map((c) => ({
    name: c.code,
    avg: Math.round(c.gradeValue * 0.9),
    passing: Math.round(85 + Math.random() * 10),
    color: c.color,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-1.5 tracking-wide">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Good morning, Dr. Chen 🌿
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          <span className="text-foreground font-semibold">14 submissions</span> awaiting your review across 3 courses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Courses Teaching', value: '3', icon: BookMarked, color: '#4A8A5C', sub: '2024/25 Sem 2' },
          { label: 'Pending Reviews', value: '14', icon: Inbox, color: '#D4A230', sub: 'Oldest: 2 days ago' },
          { label: 'Total Students', value: '110', icon: Users, color: '#C4582A', sub: 'Across all courses' },
          { label: 'Avg Class Grade', value: '79%', icon: Award, color: '#4470B4', sub: '+4% from last semester' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/25 transition-all">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: `${s.color}18` }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-light text-foreground mb-0.5" style={{ fontFamily: serif }}>
              {s.value}
            </p>
            <p className="text-xs font-medium text-foreground mb-1">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions queue */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Grading Queue
            </h3>
            <span className="text-xs bg-amber-500/15 text-amber-500 px-2.5 py-1 rounded-full font-semibold">
              14 pending
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {pendingSubmissions.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                  i < pendingSubmissions.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {s.student
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{s.student}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.course} · {s.assignment}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground">{s.submitted}</p>
                  {s.urgent && (
                    <span className="text-[9px] bg-red-500/15 text-red-500 px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
                      Urgent
                    </span>
                  )}
                </div>
                <button className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium flex-shrink-0">
                  Grade
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Class performance */}
          <div>
            <h3 className="font-normal text-foreground mb-3" style={{ fontFamily: serif, fontSize: '1.05rem' }}>
              Class Performance
            </h3>
            <div className="space-y-3">
              {classPerf.map((c) => (
                <div key={c.name} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-foreground">{c.name}</span>
                    <span className="text-sm font-bold text-foreground" style={{ fontFamily: mono, color: c.color }}>
                      {c.avg}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${c.avg}%`, background: c.color }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{c.passing}% of students passing</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-normal text-foreground mb-3 text-sm" style={{ fontFamily: serif }}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: 'Post Announcement' },
                { icon: FileCheck, label: 'Create Assignment' },
                { icon: BookOpen, label: 'Upload Materials' },
              ].map((a) => (
                <button
                  key={a.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground"
                >
                  <a.icon size={14} className="text-primary" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}