// pages/lecturer/LecturerGrading.tsx

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Trash2, Save, ChevronLeft, Edit2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useCourseData } from '../hooks/useCourseData';
import { COURSES, ASSESSMENT_TYPES, createEmptyGradingData } from '../../data';
import { useAuth } from '../../contexts/AuthContext';
import { serif, mono } from '../../utils/helpers';

import type { GradingData, Assessment } from '../../types';

export function LecturerGrading() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [gradingData, setGradingData] = useState<GradingData>(createEmptyGradingData());
  const [editingCell, setEditingCell] = useState<{ studentId: string; assessmentId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Get the course data (to get student list)
  const { courseData, loading } = useCourseData(selectedCourseId || 'dummy');

  // Load grading data from localStorage when course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const key = `grading_${selectedCourseId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setGradingData(JSON.parse(stored));
      } catch {
        setGradingData(createEmptyGradingData());
      }
    } else {
      setGradingData(createEmptyGradingData());
    }
  }, [selectedCourseId]);

  // Save grading data whenever it changes
  const saveGradingData = (data: GradingData) => {
    if (!selectedCourseId) return;
    const key = `grading_${selectedCourseId}`;
    localStorage.setItem(key, JSON.stringify(data));
    setGradingData(data);
  };

  // ─── Handlers ──────────────────────────────────────────────
  const handleAddAssessment = () => {
    const newAss: Assessment = {
      id: `ass-${Date.now()}`,
      type: ASSESSMENT_TYPES[0],
      maxScore: 10,
    };
    const newData = {
      assessments: [...gradingData.assessments, newAss],
      scores: { ...gradingData.scores },
    };
    // Initialize scores for all students for this new assessment (null = not started)
    if (courseData?.students) {
      courseData.students.forEach((student) => {
        if (!newData.scores[student.id]) newData.scores[student.id] = {};
        newData.scores[student.id][newAss.id] = null;
      });
    }
    saveGradingData(newData);
    toast.success(`Added ${newAss.type} assessment`);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    const newData = {
      assessments: gradingData.assessments.filter((a) => a.id !== assessmentId),
      scores: {} as Record<string, Record<string, number | null>>,
    };
    // Remove scores for this assessment
    Object.keys(gradingData.scores).forEach((studentId) => {
      newData.scores[studentId] = { ...gradingData.scores[studentId] };
      delete newData.scores[studentId][assessmentId];
    });
    saveGradingData(newData);
    toast.success('Assessment removed');
  };

  const handleAssessmentTypeChange = (assessmentId: string, newType: string) => {
    const newData = {
      ...gradingData,
      assessments: gradingData.assessments.map((a) =>
        a.id === assessmentId ? { ...a, type: newType } : a
      ),
    };
    saveGradingData(newData);
  };

  const handleAssessmentMaxChange = (assessmentId: string, newMax: string) => {
    const max = parseFloat(newMax);
    if (isNaN(max) || max < 0) return;
    const newData = {
      ...gradingData,
      assessments: gradingData.assessments.map((a) =>
        a.id === assessmentId ? { ...a, maxScore: max } : a
      ),
    };
    saveGradingData(newData);
  };

  const handleScoreChange = (studentId: string, assessmentId: string, value: string) => {
    let score: number | null = null;
    if (value.trim() !== '' && value.trim() !== '-') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        score = Math.min(num, 999);
      } else {
        return;
      }
    }
    const newScores = { ...gradingData.scores };
    if (!newScores[studentId]) newScores[studentId] = {};
    newScores[studentId][assessmentId] = score;
    const newData = { ...gradingData, scores: newScores };
    saveGradingData(newData);
  };

  // ─── Compute totals ──────────────────────────────────────
  const totalMax = useMemo(() => {
    return gradingData.assessments.reduce((sum, a) => sum + a.maxScore, 0);
  }, [gradingData.assessments]);

  const getStudentTotal = (studentId: string): number => {
    const studentScores = gradingData.scores[studentId] || {};
    let total = 0;
    gradingData.assessments.forEach((a) => {
      const score = studentScores[a.id];
      if (score !== null && score !== undefined) {
        total += score;
      }
    });
    return total;
  };

  // ─── Render ──────────────────────────────────────────────
  const lecturerName = user || 'Dr. Sarah Chen';
  const myCourses = COURSES.filter((c) => c.lecturer === lecturerName);

  if (loading && selectedCourseId) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Coursework Grading
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage coursework marks for your courses
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/lecturer')}>
          <ChevronLeft size={14} className="mr-2" /> Back to Dashboard
        </Button>
      </div>

      {/* Course Selector */}
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

      {selectedCourseId && courseData && (
        <>
          {/* Assessment Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assessments</span>
                <Button onClick={handleAddAssessment} size="sm">
                  <Plus size={14} className="mr-2" /> Add Assessment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gradingData.assessments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assessments added yet.</p>
              ) : (
                <div className="space-y-3">
                  {gradingData.assessments.map((ass) => (
                    <div
                      key={ass.id}
                      className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg border border-border"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={ass.type}
                            onValueChange={(val) => handleAssessmentTypeChange(ass.id, val)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ASSESSMENT_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Max Score</Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            value={ass.maxScore}
                            onChange={(e) => handleAssessmentMaxChange(ass.id, e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssessment(ass.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <div className="text-sm text-muted-foreground mt-2">
                    Total Coursework Max: <span className="font-semibold text-foreground">{totalMax}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grading Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Marks</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card min-w-[150px]">Student</TableHead>
                      {gradingData.assessments.map((ass) => (
                        <TableHead key={ass.id} className="text-center min-w-[80px]">
                          <div className="text-xs font-semibold">{ass.type}</div>
                          <div className="text-[10px] text-muted-foreground">/{ass.maxScore}</div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[80px] font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseData.students.map((student) => {
                      const total = getStudentTotal(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="sticky left-0 bg-card font-medium">
                            {student.name}
                          </TableCell>
                          {gradingData.assessments.map((ass) => {
                            const score = gradingData.scores[student.id]?.[ass.id];
                            const displayValue = score !== null && score !== undefined ? score : '-';
                            return (
                              <TableCell key={ass.id} className="text-center">
                                <Input
                                  type="text"
                                  value={displayValue === '-' ? '' : displayValue}
                                  placeholder="-"
                                  className="w-16 h-8 text-center mx-auto"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || val === '-') {
                                      handleScoreChange(student.id, ass.id, '-');
                                    } else {
                                      const num = parseFloat(val);
                                      if (!isNaN(num)) {
                                        handleScoreChange(student.id, ass.id, val);
                                      }
                                    }
                                  }}
                                  onBlur={() => {
                                    const current = gradingData.scores[student.id]?.[ass.id];
                                    if (current === null || current === undefined) {
                                      handleScoreChange(student.id, ass.id, '-');
                                    }
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-bold" style={{ fontFamily: mono }}>
                            {total} / {totalMax}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}