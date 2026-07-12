import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Clock, ChevronRight } from 'lucide-react';
import { COURSES } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif, mono } from '../../utils/helpers';

export function LecturerCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter courses taught by this lecturer
  const lecturerName = user || 'Dr. Sarah Chen';
  const myCourses = COURSES.filter((c) => c.lecturer === lecturerName);

  const [filter, setFilter] = useState('all');

  const handleViewCourse = (courseId: string) => {
    navigate(`/lecturer/courses/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          My Courses
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          2024/25 Semester 2 · You are teaching {myCourses.length} course(s)
        </p>
      </div>

      {/* Filters (optional – keep for consistency) */}
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

      {/* Course grid */}
      {myCourses.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          You are not assigned to any courses yet.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-2xl overflow-hidden text-left group hover:border-primary/25 transition-all cursor-pointer"
              onClick={() => handleViewCourse(course.id)}
            >
              {/* Image header */}
              <div className="h-32 relative overflow-hidden" style={{ background: `${course.color}20` }}>
                <img
                  src={`https://images.unsplash.com/${course.image}?w=700&h=200&fit=crop&auto=format`}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: course.color }}>
                    {course.code}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1" style={{ fontFamily: serif }}>
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{course.lecturer}</p>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>Course Progress</span>
                    <span style={{ fontFamily: mono }}>{course.progress}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {course.enrolled} enrolled
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {course.nextClass}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCourse(course.id);
                    }}
                  >
                    Manage <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}