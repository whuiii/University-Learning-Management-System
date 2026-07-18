import { useNavigate } from 'react-router-dom';
import { BookMarked, Inbox, Users, Award, Plus, FileCheck, BookOpen, ChevronRight } from 'lucide-react';
import { COURSES, ASSIGNMENTS } from '../../data';
import { serif } from '../../utils/helpers';

export function LecturerDashboard() {
  const navigate = useNavigate();

  // ─── Stats ──────────────────────────────────────────────
  const totalCourses = COURSES.length;
  const totalStudents = COURSES.reduce((acc, c) => acc + c.enrolled, 0);
  const pendingSubmissions = ASSIGNMENTS.filter((a) => a.status === 'pending').length;
  const avgGrade =
    COURSES.length > 0
      ? Math.round(COURSES.reduce((acc, c) => acc + c.gradeValue, 0) / COURSES.length)
      : 0;

  // Filter courses taught by this lecturer (hardcoded for now)
  const myCourses = COURSES.filter((c) => c.lecturer === 'Dr. Sarah Chen');

  // ─── Quick action handlers ─────────────────────────────
  const handlePostAnnouncement = () => {
    if (myCourses.length > 0) {
      navigate(`/lecturer/courses/${myCourses[0].id}?tab=announcements&openModal=true`);
    }
  };

  const handleCreateAssignment = () => {
    if (myCourses.length > 0) {
      navigate(`/lecturer/courses/${myCourses[0].id}?tab=assignments&openModal=true`);
    }
  };

  const handleUploadMaterial = () => {
    if (myCourses.length > 0) {
      navigate(`/lecturer/courses/${myCourses[0].id}?tab=materials&openModal=true`);
    }
  };

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
          <span className="text-foreground font-semibold">{pendingSubmissions} submissions</span> awaiting your review across {totalCourses} courses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Courses Teaching', value: totalCourses, icon: BookMarked, color: '#4A8A5C', sub: '2024/25 Sem 2' },
          { label: 'Pending Reviews', value: pendingSubmissions, icon: Inbox, color: '#D4A230', sub: 'Awaiting grading' },
          { label: 'Total Students', value: totalStudents, icon: Users, color: '#C4582A', sub: 'Across all courses' },
          { label: 'Avg Class Grade', value: `${avgGrade}%`, icon: Award, color: '#4470B4', sub: 'Overall average' },
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
        {/* Submissions queue – show pending assignments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-normal text-foreground" style={{ fontFamily: serif, fontSize: '1.1rem' }}>
              Grading Queue
            </h3>
            <span className="text-xs bg-amber-500/15 text-amber-500 px-2.5 py-1 rounded-full font-semibold">
              {pendingSubmissions} pending
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {ASSIGNMENTS.filter((a) => a.status === 'pending').slice(0, 5).map((a) => {
              const course = COURSES.find((c) => c.id === a.courseId);
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border last:border-0"
                  onClick={() => navigate(`/lecturer/courses/${a.courseId}?tab=grades`)}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {course?.code || '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course?.title || 'Unknown course'} · Due {a.dueDate}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground">submitted</span>
                  </div>
                  <button className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium flex-shrink-0">
                    Grade
                  </button>
                </div>
              );
            })}
            {pendingSubmissions === 0 && (
              <div className="p-5 text-center text-muted-foreground text-sm">All caught up! 🎉</div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-5">
          {/* Quick actions */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-normal text-foreground mb-3 text-sm" style={{ fontFamily: serif }}>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handlePostAnnouncement}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground"
              >
                <Plus size={14} className="text-primary" />
                Post Announcement
              </button>
              <button
                onClick={handleCreateAssignment}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground"
              >
                <FileCheck size={14} className="text-primary" />
                Create Assignment
              </button>
              <button
                onClick={handleUploadMaterial}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground"
              >
                <BookOpen size={14} className="text-primary" />
                Upload Materials
              </button>
            </div>
          </div>

          {/* My Courses (list) */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-normal text-foreground mb-3 text-sm" style={{ fontFamily: serif }}>
              My Courses
            </h3>
            <div className="space-y-2">
              {myCourses.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-1.5 hover:bg-secondary/30 rounded-lg px-2 cursor-pointer"
                  onClick={() => navigate(`/lecturer/courses/${c.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: c.color }}>{c.code}</span>
                    <span className="text-sm truncate max-w-[120px]">{c.title}</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              ))}
              {myCourses.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-1">
                  +{myCourses.length - 3} more
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}