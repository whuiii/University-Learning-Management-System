import { COURSES, ANNOUNCEMENTS } from '../../data';
import { serif } from '../../utils/helpers';

export function AnnouncementsView() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Announcements
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {ANNOUNCEMENTS.filter((a) => a.pinned).length} pinned · {ANNOUNCEMENTS.length} total
        </p>
      </div>
      <div className="space-y-4">
        {ANNOUNCEMENTS.map((ann) => {
          const course = COURSES.find((c) => c.id === ann.courseId);
          return (
            <div
              key={ann.id}
              className={`bg-card border rounded-2xl p-6 hover:border-primary/20 transition-colors ${
                ann.pinned ? 'border-primary/25' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: course?.color }}
                  >
                    {ann.courseCode.slice(2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug" style={{ fontFamily: serif }}>
                      {ann.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {ann.author} · {ann.courseCode} · {ann.date}
                    </p>
                  </div>
                </div>
                {ann.pinned && (
                  <span className="text-[9px] font-bold bg-primary/15 text-primary px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
                    Pinned
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ann.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}