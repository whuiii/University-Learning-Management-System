import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BookOpen, Beaker, Users, Calendar } from 'lucide-react';
import { COURSES } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif } from '../../utils/helpers';

export function LecturerAttendanceSessions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const lecturerName = user || 'Dr. Sarah Chen';
  const myCourses = COURSES.filter((c) => c.lecturer === lecturerName);

  // Determine which practical type to show: Lab or Tutorial
  const getPracticalType = (course: typeof COURSES[0]) => {
    // Science/Engineering/Computer courses → Lab
    const scienceKeywords = ['Computer Science', 'Engineering', 'Cybersecurity', 'Data Science', 'Software Engineering', 'Information Systems'];
    if (scienceKeywords.some(kw => course.faculty.includes(kw))) {
      return 'lab';
    }
    // Otherwise → Tutorial (Business, Accounting, Statistics, etc.)
    return 'tutorial';
  };

  const handleViewType = (type: 'lecture' | 'lab' | 'tutorial') => {
    navigate(`/lecturer/attendance/session/${selectedCourseId}/${type}`);
  };

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId);
  const practicalType = selectedCourse ? getPracticalType(selectedCourse) : 'lab';

  // Always show Lecture + one practical card
  const types = [
    { id: 'lecture', label: 'Lecture', icon: BookOpen, color: '#4A8A5C' },
    { 
      id: practicalType, 
      label: practicalType === 'lab' ? 'Lab' : 'Tutorial', 
      icon: practicalType === 'lab' ? Beaker : Users, 
      color: practicalType === 'lab' ? '#C4582A' : '#4470B4' 
    },
  ];

  return (
    <div  className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Attendance Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a course, then choose a session type to view the attendance matrix
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="course-select">Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger id="course-select">
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {myCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} – {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {!selectedCourseId && (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>Select a course to view session types</p>
          </CardContent>
        </Card>
      )}

      {selectedCourseId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:border-primary/40 transition-all hover:shadow-lg"
              onClick={() => handleViewType(type.id as any)}
            >
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3"
                  style={{ background: `${type.color}20` }}
                >
                  <type.icon size={32} style={{ color: type.color }} />
                </div>
                <CardTitle className="text-xl" style={{ fontFamily: serif }}>
                  {type.label}
                </CardTitle>
                <CardDescription>
                  View attendance matrix for all {type.label.toLowerCase()} sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full">
                  Open Matrix →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}