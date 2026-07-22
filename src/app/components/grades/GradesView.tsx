import { useState, useMemo } from 'react';
import { TrendingUp, Download, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { SEMESTERS } from '../../data';
import { serif, mono } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';

export function GradesView() {
  const { theme } = useTheme();
  const [selectedView, setSelectedView] = useState<'overall' | string>('overall');

  // ─── Compute overall data ──────────────────────────────────────
  const allCourses = useMemo(() => {
    return SEMESTERS.flatMap((s) => s.courses);
  }, []);

  const overallStats = useMemo(() => {
    if (allCourses.length === 0) return null;
    const totalCredits = allCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const avgGrade = allCourses.reduce((sum, c) => sum + c.gradeValue, 0) / allCourses.length;
    const highest = allCourses.reduce((max, c) => (c.gradeValue > max.gradeValue ? c : max), allCourses[0]);
    const cgpa = (avgGrade / 20).toFixed(2);
    return { totalCredits, avgGrade, highest, cgpa, count: allCourses.length };
  }, [allCourses]);

  // ─── Get current semester data ──────────────────────────────
  const currentSemester = SEMESTERS.find((s) => s.id === selectedView);
  const isOverall = selectedView === 'overall';

  // Courses and stats for the current selection
  const courses = useMemo(() => {
    if (isOverall) return allCourses;
    return currentSemester?.courses || [];
  }, [isOverall, currentSemester, allCourses]);

  const stats = useMemo(() => {
    if (courses.length === 0) return null;
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const avgGrade = courses.reduce((sum, c) => sum + c.gradeValue, 0) / courses.length;
    const highest = courses.reduce((max, c) => (c.gradeValue > max.gradeValue ? c : max), courses[0]);
    const cgpa = (avgGrade / 20).toFixed(2);
    return { totalCredits, avgGrade, highest, cgpa, count: courses.length };
  }, [courses]);

  // ─── Chart data ──────────────────────────────────────────────
  const chartData = courses.map((c) => ({ name: c.code, grade: c.gradeValue, color: c.color }));

  // ─── Download CSV ─────────────────────────────────────────────
  const handleDownload = () => {
    if (courses.length === 0) return;

    const headers = ['Semester', 'Code', 'Title', 'Lecturer', 'Grade', 'Score (%)', 'Credits'];
    const rows = courses.map((c) => {
      const semester = SEMESTERS.find((s) => s.courses.some((sc) => sc.id === c.id));
      return [
        semester?.label || 'Unknown',
        c.code,
        c.title,
        c.lecturer,
        c.grade,
        c.gradeValue,
        c.credits || '',
      ];
    });

    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.join(',') + '\n';
    });

    // Summary
    if (stats) {
      csv += `\n"CGPA",${stats.cgpa}\n`;
      csv += `"Total Credits",${stats.totalCredits}\n`;
      csv += `"Highest Grade","${stats.highest.grade} (${stats.highest.gradeValue}%)"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isOverall ? 'overall_grades.csv' : `grades_${currentSemester?.label.replace(/\s/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Render ──────────────────────────────────────────────────

  // Determine if current semester is ongoing (only for non-overall)
  const isOngoing = !isOverall && currentSemester?.status === 'In progress';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Academic Grades
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="overall">Overall Performance</option>
              {SEMESTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} {s.status && `· ${s.status}`}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              {isOverall ? 'All semesters' : currentSemester?.status || ''}
            </span>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* ─── Stats Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">
            {isOverall ? 'Overall CGPA' : 'Semester CGPA'}
            {isOngoing && <span className="ml-2 text-amber-500">(Ongoing)</span>}
          </p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {stats ? stats.cgpa : '-'}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} included
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">Highest Grade</p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {stats ? `${stats.highest.gradeValue}%` : 'N/A'}
          </p>
          <p className="text-xs mt-2 text-muted-foreground truncate">
            {stats?.highest.title || 'No courses'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">Credit Hours</p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {stats ? stats.totalCredits : 0}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            {isOverall ? 'Across all semesters' : 'This semester'}
          </p>
        </div>
      </div>

      {/* ─── Grade Chart ────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-normal text-foreground mb-5" style={{ fontFamily: serif }}>
          {isOverall ? 'Grade Distribution (All Semesters)' : 'Grade by Course'}
        </h3>
        {courses.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            No courses to display.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={44}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: 12 }}
                cursor={{ fill: 'rgba(128,128,128,0.05)' }}
              />
              <Bar dataKey="grade" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ─── Course List ────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
            {isOverall ? 'All Courses' : 'Course Grades'}
          </h3>
          <span className="text-xs text-muted-foreground">
            {courses.length} courses
          </span>
        </div>
        {courses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No courses found for this selection.</div>
        ) : (
          courses.map((c, i) => (
            <div
              key={c.id}
              className={`px-5 py-4 flex items-center gap-4 ${i < courses.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {c.code} · {c.lecturer}
                  {!isOverall && (
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      {SEMESTERS.find((s) => s.courses.some((sc) => sc.id === c.id))?.label || ''}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-28 hidden md:block">
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.gradeValue}%`, background: c.color }} />
                  </div>
                </div>
                <span className="font-semibold text-foreground w-12 text-right" style={{ fontFamily: mono }}>
                  {c.gradeValue}%
                </span>
                <span className="font-bold w-8 text-right" style={{ fontFamily: mono, color: c.color }}>
                  {c.grade}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}