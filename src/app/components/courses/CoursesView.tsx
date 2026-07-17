import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import { COURSES } from '../../data';
import { serif, mono } from '../../utils/helpers';

export function CoursesView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          My Courses
        </h2>
        <p className="text-sm text-muted-foreground mt-1">2024/25 Semester 2 · {COURSES.length} active courses</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All Courses' : f === 'in-progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COURSES.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/courses/${c.id}`)}
            className="bg-card border border-border rounded-2xl overflow-hidden text-left group hover:border-primary/25 transition-all"
          >
            <div className="h-32 relative overflow-hidden" style={{ background: `${c.color}20` }}>
              <img
                src={`https://images.unsplash.com/${c.image}?w=700&h=200&fit=crop&auto=format`}
                alt={c.title}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: c.color }}>
                  {c.code}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1" style={{ fontFamily: serif }}>
                {c.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{c.lecturer}</p>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                  <span>
                    {c.completedModules}/{c.modules} modules
                  </span>
                  <span style={{ fontFamily: mono }}>{c.progress}%</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: c.color }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {c.enrolled}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {c.nextClass}
                  </span>
                </div>
                <span className="font-bold text-sm" style={{ fontFamily: mono, color: c.color }}>
                  {c.grade}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}