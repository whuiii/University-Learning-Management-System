import { useState, useEffect } from 'react';
import { FullCourse, Material, Assignment, Quiz, Announcement } from '../../types';
import { COURSES } from '../../data';

const STORAGE_KEY_PREFIX = 'courseData_';

function createFullCourseFromCourse(courseId: string): FullCourse | null {
  const base = COURSES.find((c) => c.id === courseId);
  if (!base) return null; // ✅ return null instead of throwing
  return {
    ...base,
    learningOutcomes: base.learningOutcomes || [],
    materials: [],
    assignments: [],
    quizzes: [],
    announcements: [],
    students: [
      { id: 's1', name: 'Ahmad Fariz', email: 'ahmad.fariz@utp.edu.my' },
      { id: 's2', name: 'Nurul Ain Farhana', email: 'nurul.ain@utp.edu.my' },
      { id: 's3', name: 'Danial Haziq', email: 'danial.haziq@utp.edu.my' },
      { id: 's4', name: 'Farah Syahirah', email: 'farah.syahirah@utp.edu.my' },
      { id: 's5', name: 'Hazwan Zulkifli', email: 'hazwan.zulkifli@utp.edu.my' },
      { id: 's6', name: 'Lim Wei Xian', email: 'lim.weixian@utp.edu.my' },
      { id: 's7', name: 'Nurul Izzah', email: 'nurul.izzah@utp.edu.my' },
      { id: 's8', name: 'Muhammad Firdaus', email: 'muhammad.firdaus@utp.edu.my' },
    ],
    grades: {},
  };
}

export function useCourseData(courseId: string) {
  const [courseData, setCourseData] = useState<FullCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setCourseData(null);
      return;
    }
    const key = STORAGE_KEY_PREFIX + courseId;
    const stored = localStorage.getItem(key);
    let data: FullCourse | null;
    if (stored) {
      data = JSON.parse(stored);
    } else {
      data = createFullCourseFromCourse(courseId);
      if (data) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
    setCourseData(data);
    setLoading(false);
  }, [courseId]);


  const updateCourseData = (newData: FullCourse | ((prev: FullCourse) => FullCourse)) => {
    setCourseData((prev) => {
      if (!prev) return prev;
      const updated = typeof newData === 'function' ? newData(prev) : newData;
      localStorage.setItem(STORAGE_KEY_PREFIX + courseId, JSON.stringify(updated));
      return updated;
    });
  };

  // ─── Material CRUD ──────────────────────────────────────────
  const addMaterial = (material: Omit<Material, 'id' | 'date'>) => {
    const newMaterial: Material = {
      ...material,
      id: `mat-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    updateCourseData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));
  };

  const deleteMaterial = (id: string) => {
    updateCourseData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  // ─── Assignment CRUD ──────────────────────────────────────
  const addAssignment = (assignment: Omit<Assignment, 'id' | 'status' | 'score'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: `ass-${Date.now()}`,
      status: 'pending',
      score: undefined,
    };
    updateCourseData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment],
    }));
  };

  const deleteAssignment = (id: string) => {
    updateCourseData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
  };

  // ─── Quiz CRUD ─────────────────────────────────────────────
  const addQuiz = (quiz: Omit<Quiz, 'id' | 'attempts' | 'score'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      attempts: 0,
      score: null,
    };
    updateCourseData((prev) => ({
      ...prev,
      quizzes: [...prev.quizzes, newQuiz],
    }));
  };

  const deleteQuiz = (id: string) => {
    updateCourseData((prev) => ({
      ...prev,
      quizzes: prev.quizzes.filter((q) => q.id !== id),
    }));
  };

  // ─── Announcement CRUD ────────────────────────────────────
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date' | 'author'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Dr. Sarah Chen', // can be replaced with actual user from auth context
    };
    updateCourseData((prev) => ({
      ...prev,
      announcements: [newAnnouncement, ...prev.announcements],
    }));
  };

  const deleteAnnouncement = (id: string) => {
    updateCourseData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((a) => a.id !== id),
    }));
  };

  // ─── Overview update ──────────────────────────────────────
  const updateOverview = (description: string, learningOutcomes: string[]) => {
    updateCourseData((prev) => ({
      ...prev,
      description,
      learningOutcomes,
    }));
  };

  // ─── Grade update ─────────────────────────────────────────
  const updateGrade = (studentId: string, assignmentId: string, score: number) => {
    updateCourseData((prev) => {
      const grades = { ...prev.grades };
      if (!grades[studentId]) grades[studentId] = {};
      grades[studentId][assignmentId] = score;
      return { ...prev, grades };
    });
  };

  return {
    courseData,
    loading,
    updateCourseData,
    addMaterial,
    deleteMaterial,
    addAssignment,
    deleteAssignment,
    addQuiz,
    deleteQuiz,
    addAnnouncement,
    deleteAnnouncement,
    updateOverview,
    updateGrade,
  };
}