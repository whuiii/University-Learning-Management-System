import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import {
  Flame,
  BookOpen,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { COURSES, ASSIGNMENTS, ANNOUNCEMENTS, GRADE_HISTORY } from '../../data';
import { daysUntil, serif, mono } from '../../utils/helpers';
import { Skeleton } from '../../components/ui/skeleton';

export function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading for 1.2s to show skeletons
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const pending = ASSIGNMENTS.filter((a) => a.status === 'pending');
  const avgGrade = Math.round(
    COURSES.reduce((s, c) => s + c.gradeValue, 0) / COURSES.length
  );
  const completedModules = COURSES.reduce((s, c) => s + c.completedModules, 0);
  const totalModules = COURSES.reduce((s, c) => s + c.modules, 0);

  // Confetti if avg grade >= 90
  useEffect(() => {
    if (!loading && avgGrade >= 90) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [loading, avgGrade]);

  const streakData = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: false },
    { day: 'F', active: true },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  const handleCourseOpen = (courseId: string) => {
    toast.info(`Opening ${COURSES.find(c => c.id === courseId)?.title}`);
    navigate(`/courses/${courseId}`);
  };

  // ─── Card animation variants ──────────────────────────────────
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3 },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 tracking-wide">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <h1
            className="text-3xl font-normal text-foreground"
            style={{ fontFamily: serif }}
          >
            Good day, Ahmad 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            You have{' '}
            <span className="text-foreground font-semibold">
              {pending.length} assignments
            </span>{' '}
            due this week.
          </p>
        </div>
        {/* Streak */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-4 py-2.5"
          >
            <Flame size={15} style={{ color: '#D4A230' }} />
            <span className="text-sm font-semibold text-foreground">
              4-day streak
            </span>
          </motion.div>
          <div className="flex gap-1">
            {streakData.map((d, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    d.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <span className="text-[10px] font-medium">{d.day}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Enrolled Courses',
            value: COURSES.length,
            icon: BookOpen,
            color: '#C4582A',
            sub: '2 with next class today',
          },
          {
            label: 'Pending Work',
            value: pending.length,
            icon: ClipboardList,
            color: '#D4A230',
            sub: 'Nearest due in 6 days',
          },
          {
            label: 'Average Grade',
            value: `${avgGrade}%`,
            icon: TrendingUp,
            color: '#4A8A5C',
            sub: '+3% from last semester',
          },
          {
            label: 'Modules Done',
            value: `${completedModules}/${totalModules}`,
            icon: CheckCircle2,
            color: '#4470B4',
            sub: `${Math.round((completedModules / totalModules) * 100)}% of semester`,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400 } }}
            className="bg-card border border-border rounded-2xl p-5 group hover:border-primary/25 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}18` }}
              >
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <p
              className="text-2xl font-light text-foreground mb-0.5"
              style={{ fontFamily: serif }}
            >
              {s.value}
            </p>
            <p className="text-xs font-medium text-foreground mb-1">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-normal text-foreground"
              style={{ fontFamily: serif, fontSize: '1.1rem' }}
            >
              My Courses
            </h3>
            <button
              onClick={() => navigate('/courses')}
              className="text-xs text-primary hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {loading
              ? // Skeleton loaders
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
                  >
                    <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  </div>
                ))
              : COURSES.map((c) => (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.005, borderColor: 'var(--primary)' }}
                    onClick={() => handleCourseOpen(c.id)}
                    className="w-full bg-card border border-border rounded-2xl p-4 text-left group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                        style={{ background: c.color }}
                      >
                        {c.code.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {c.title}
                          </p>
                          <span
                            className="text-sm font-bold flex-shrink-0"
                            style={{ fontFamily: mono, color: c.color }}
                          >
                            {c.grade}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2.5">
                          {c.lecturer} · {c.nextClass}
                        </p>
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.progress}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{ background: c.color }}
                            />
                          </div>
                          <span
                            className="text-[10px] text-muted-foreground flex-shrink-0"
                            style={{ fontFamily: mono }}
                          >
                            {c.progress}%
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      />
                    </div>
                  </motion.button>
                ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Deadlines */}
          <div>
            <h3
              className="font-normal text-foreground mb-3"
              style={{ fontFamily: serif, fontSize: '1.05rem' }}
            >
              Deadlines
            </h3>
            <div className="space-y-2.5">
              {pending.map((a) => {
                const days = daysUntil(a.dueDate);
                const course = COURSES.find((c) => c.id === a.courseId);
                return (
                  <motion.div
                    key={a.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-3 bg-card border border-border rounded-xl p-3.5"
                  >
                    <div
                      className="w-1 h-full min-h-[2.5rem] rounded-full flex-shrink-0"
                      style={{ background: course?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-snug mb-1">
                        {a.title}
                      </p>
                      {/* ✅ FIX: use course?.code instead of a.courseCode */}
                      <p className="text-[10px] text-muted-foreground">
                        {course?.code || a.courseId} · {a.type}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                        days <= 3
                          ? 'bg-red-500/15 text-red-500'
                          : days <= 7
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-emerald-500/15 text-emerald-500'
                      }`}
                      style={{ fontFamily: mono }}
                    >
                      {days <= 0 ? 'Late' : `${days}d`}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Grade trend mini */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-normal text-foreground text-sm"
                style={{ fontFamily: serif }}
              >
                Grade Trend
              </h3>
              <span className="text-xs text-muted-foreground">5 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={GRADE_HISTORY}>
                <Line
                  type="monotone"
                  dataKey="cs302"
                  stroke="#4A8A5C"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cs201"
                  stroke="#C4582A"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {[
                ['CS302', '#4A8A5C'],
                ['CS201', '#C4582A'],
              ].map(([code, color]) => (
                <div key={code} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] text-muted-foreground">{code}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pinned announcement */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-card border border-primary/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                Pinned
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground mb-1">
              {ANNOUNCEMENTS[0].title}
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {ANNOUNCEMENTS[0].body.slice(0, 80)}…
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              {ANNOUNCEMENTS[0].courseCode} · {ANNOUNCEMENTS[0].date}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}