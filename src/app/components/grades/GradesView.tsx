import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { COURSES } from '../../data';
import { serif, mono } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';

export function GradesView() {
  const { theme } = useTheme();
  const chartData = COURSES.map((c) => ({ name: c.code, grade: c.gradeValue, color: c.color }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Academic Grades
        </h2>
        <p className="text-sm text-muted-foreground mt-1">2024/25 Semester 2 · In progress</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Current CGPA', value: '3.52', sub: '+0.08 from last semester', up: true },
          { label: 'Highest Grade', value: '92%', sub: 'Software Engineering' },
          { label: 'Credit Hours', value: '15', sub: 'This semester · 82 total' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
            <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
            <p className="text-4xl font-light text-foreground" style={{ fontFamily: serif }}>
              {s.value}
            </p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${s.up ? 'text-emerald-500' : 'text-muted-foreground'}`}>
              {s.up && <TrendingUp size={10} />}
              {s.sub}
            </p>
          </div>
        ))}
      </div>
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
            Course Grades
          </h3>
        </div>
        {COURSES.map((c, i) => (
          <div
            key={c.id}
            className={`px-5 py-4 flex items-center gap-4 ${i < COURSES.length - 1 ? 'border-b border-border' : ''}`}
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