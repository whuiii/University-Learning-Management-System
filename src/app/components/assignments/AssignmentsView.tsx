import { useState } from 'react';
import { COURSES, ASSIGNMENTS } from '../../data';
import { daysUntil, statusColor, statusLabel, serif, mono } from '../../utils/helpers';

export function AssignmentsView() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? ASSIGNMENTS : ASSIGNMENTS.filter((a) => a.status === filter);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Assignments
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {ASSIGNMENTS.filter((a) => a.status === 'pending').length} pending · 2024/25 Semester 2
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'submitted', 'graded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((a) => {
          const course = COURSES.find((c) => c.id === a.courseId);
          const days = daysUntil(a.dueDate);
          return (
            <div
              key={a.id}
              className="bg-card border border-border rounded-2xl p-5 flex items-center gap-5 hover:border-primary/20 transition-all"
            >
              <div className="w-1 h-14 rounded-full flex-shrink-0" style={{ background: course?.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-sm text-foreground">{a.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {a.courseCode} · Weight: {a.weight}% · Due {a.dueDate}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-bold ${statusColor(a.status)}`}>{statusLabel(a.status)}</p>
                {a.status === 'pending' && (
                  <p className={`text-xs mt-0.5 ${days <= 3 ? 'text-red-500' : 'text-muted-foreground'}`} style={{ fontFamily: mono }}>
                    {days <= 0 ? 'Overdue' : `${days}d left`}
                  </p>
                )}
                {'score' in a && a.score != null && (
                  <p className="text-2xl font-light text-foreground" style={{ fontFamily: serif }}>
                    {a.score}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}