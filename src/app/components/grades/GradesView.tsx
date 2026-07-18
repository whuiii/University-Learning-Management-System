import { useState } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { SEMESTERS } from '../../data';
import { serif, mono } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';

export function GradesView() {
  const { theme } = useTheme();
  const [selectedSemesterId, setSelectedSemesterId] = useState(SEMESTERS[0]?.id || '');

  // Find the current semester data
  const currentSemester = SEMESTERS.find((s) => s.id === selectedSemesterId) || SEMESTERS[0];
  const courses = currentSemester?.courses || [];

  // Compute stats
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const highest = courses.length
    ? courses.reduce((max, c) => (c.gradeValue > max.gradeValue ? c : max), courses[0])
    : null;
  // Dummy CGPA – replace with real calculation if grade points available
  const cgpa = courses.length
    ? (courses.reduce((sum, c) => sum + (c.gradeValue / 20), 0) / courses.length).toFixed(2) // rough estimate
    : '0.00';

  // Chart data
  const chartData = courses.map((c) => ({ name: c.code, grade: c.gradeValue, color: c.color }));

  // Download CSV for the current semester
  const handleDownload = () => {
    if (courses.length === 0) return;

    // Headers
    const headers = ['Code', 'Title', 'Lecturer', 'Grade', 'Score (%)', 'Credits'];
    const rows = courses.map((c) => [
      c.code,
      c.title,
      c.lecturer,
      c.grade,
      c.gradeValue,
      c.credits || '',
    ]);

    // Build CSV string
    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.join(',') + '\n';
    });

    // Add summary stats at the end
    csv += `\n"CGPA",${cgpa}\n`;
    csv += `"Total Credits",${totalCredits}\n`;
    csv += `"Highest Grade","${highest?.grade || 'N/A'} (${highest?.gradeValue || 0}%)"\n`;

    // Create and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${currentSemester.label.replace(/\s/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with semester selector and download button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Academic Grades
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {SEMESTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} {s.status && `· ${s.status}`}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">
              {currentSemester?.status || ''}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">Current CGPA</p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {cgpa}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            {courses.length} courses this semester
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">Highest Grade</p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {highest ? `${highest.gradeValue}%` : 'N/A'}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            {highest?.title || 'No courses'}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-2">Credit Hours</p>
          <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
            {totalCredits}
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            This semester · {courses.reduce((sum, c) => sum + (c.credits || 0), 0)} total
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-normal text-foreground mb-5" style={{ fontFamily: serif }}>
          Grade by Course
        </h3>
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
      </div>

      {/* Course List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
            Course Grades
          </h3>
          <span className="text-xs text-muted-foreground">
            {courses.length} courses
          </span>
        </div>
        {courses.map((c, i) => (
          <div
            key={c.id}
            className={`px-5 py-4 flex items-center gap-4 ${i < courses.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.code} · {c.lecturer}</p>
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
        ))}
      </div>
    </div>
  );
}