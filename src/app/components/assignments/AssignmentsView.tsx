import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES, ASSIGNMENTS } from '../../data';
import { daysUntil, serif, mono, getAssignmentStatusInfo } from '../../utils/helpers';

export function AssignmentsView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'overdue'>('all');

  // ─── Compute dynamic statuses for each assignment ────────────
  const assignmentsWithStatus = useMemo(() => {
    return ASSIGNMENTS.map((a) => {
      const info = getAssignmentStatusInfo(a);
      // Determine a clean status key for filtering
      let statusKey: 'pending' | 'submitted' | 'graded' | 'overdue' = 'pending';
      if (info.label === 'Graded') statusKey = 'graded';
      else if (info.label === 'Submitted') statusKey = 'submitted';
      else if (info.label === 'Overdue') statusKey = 'overdue';
      else statusKey = 'pending'; // includes 'Pending' (not overdue yet)
      return { ...a, statusKey, statusInfo: info };
    });
  }, []);

  // ─── Filtering ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return assignmentsWithStatus;
    return assignmentsWithStatus.filter((a) => a.statusKey === filter);
  }, [assignmentsWithStatus, filter]);

  // Count pending (not submitted, not graded) – includes overdue but we treat them separately
  const pendingCount = assignmentsWithStatus.filter(
    (a) => a.statusKey === 'pending' || a.statusKey === 'overdue'
  ).length;

  // ─── Navigation ──────────────────────────────────────────────
  const handleAssignmentClick = (assignmentId: string) => {
    const assignment = ASSIGNMENTS.find(a => a.id === assignmentId);
    if (assignment) {
      navigate(`/courses/${assignment.courseId}?tab=assignments`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Assignments
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingCount} pending · 2024/25 Semester 2
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'graded', label: 'Graded' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">
            No assignments match this filter.
          </div>
        ) : (
          filtered.map(({ id, courseId, title, type, dueDate, weight, score, statusKey, statusInfo }) => {
            const course = COURSES.find((c) => c.id === courseId);
            const courseCode = course?.code || courseId;
            const days = daysUntil(dueDate);

            return (
              <div
                key={id}
                onClick={() => handleAssignmentClick(id)}
                className="bg-card border border-border rounded-2xl p-5 flex items-center gap-5 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="w-1 h-14 rounded-full flex-shrink-0" style={{ background: course?.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">{title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {courseCode} · Weight: {weight}% · Due {dueDate}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${statusInfo.color}`}>{statusInfo.label}</p>
                  {statusInfo.timeNote && (
                    <p className={`text-[10px] mt-0.5 ${statusKey === 'overdue' ? 'text-red-500' : 'text-muted-foreground'}`} style={{ fontFamily: mono }}>
                      {statusInfo.timeNote}
                    </p>
                  )}
                  {score !== undefined && score !== null && (
                    <p className="text-2xl font-light text-foreground" style={{ fontFamily: serif }}>
                      {score}%
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}