// src/utils/helpers.ts

import { Assignment } from '../types';

// ─── Existing helpers (keep for backward compatibility) ───

export function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export function statusColor(s: string) {
  return s === "graded" ? "text-emerald-500" : s === "submitted" ? "text-sky-400" : "text-amber-500";
}

export function statusBg(s: string) {
  return s === "graded" ? "bg-emerald-500/15" : s === "submitted" ? "bg-sky-500/15" : "bg-amber-500/15";
}

export function statusLabel(s: string) {
  return s === "graded" ? "Graded" : s === "submitted" ? "Submitted" : "Pending";
}

// ─── New helpers for assignment submission ─────────────────

const SUBMISSION_STORAGE_KEY = 'assignment_submissions';

export interface SubmissionRecord {
  submittedAt: string;
  status: 'submitted' | 'graded';
}

/**
 * Get a saved submission record for an assignment
 */
export function getSubmissionRecord(assignmentId: string): SubmissionRecord | null {
  try {
    const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY);
    if (!stored) return null;
    const submissions = JSON.parse(stored);
    return submissions[assignmentId] || null;
  } catch {
    return null;
  }
}

/**
 * Save a submission record for an assignment
 */
export function saveSubmission(assignmentId: string, record: SubmissionRecord) {
  try {
    const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY);
    const submissions = stored ? JSON.parse(stored) : {};
    submissions[assignmentId] = record;
    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submission:', e);
  }
}

/**
 * Get dynamic status info for an assignment
 * Returns label, color, background, and a time note (e.g., "Submitted 2 days early")
 */
export function getAssignmentStatusInfo(assignment: Assignment) {
  // 1. Graded
  if (assignment.score !== undefined && assignment.score !== null) {
    return {
      label: 'Graded',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      timeNote: `Score: ${assignment.score}%`,
    };
  }

  // 2. Submitted (check localStorage)
  const submission = getSubmissionRecord(assignment.id);
  if (submission) {
    const submittedAt = new Date(submission.submittedAt);
    const dueDate = new Date(assignment.dueDate);
    const diffMs = submittedAt.getTime() - dueDate.getTime();
    let timeNote = '';

    if (diffMs <= 0) {
      // Early
      const diff = Math.abs(diffMs);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 0) {
        timeNote = `${days} day${days > 1 ? 's' : ''} early`;
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours > 0) {
          timeNote = `${hours} hour${hours > 1 ? 's' : ''} early`;
        } else {
          const mins = Math.floor(diff / (1000 * 60));
          timeNote = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''} early` : 'just now';
        }
      }
    } else {
      // Late
      const diff = diffMs;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 0) {
        timeNote = `${days} day${days > 1 ? 's' : ''} late`;
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours > 0) {
          timeNote = `${hours} hour${hours > 1 ? 's' : ''} late`;
        } else {
          const mins = Math.floor(diff / (1000 * 60));
          timeNote = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''} late` : 'just now';
        }
      }
    }

    return {
      label: 'Submitted',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      timeNote: `Submitted ${timeNote}`,
    };
  }

  // 3. Not submitted – check if overdue
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  if (now > dueDate) {
    return {
      label: 'Overdue',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      timeNote: `Due ${assignment.dueDate}`,
    };
  }

  // 4. Pending (future due date)
  return {
    label: 'Pending',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    timeNote: `Due ${assignment.dueDate}`,
  };
}

// ─── Font constants ────────────────────────────────────────

export const serif = "'DM Serif Display', Georgia, serif";
export const sans = "'DM Sans', system-ui, sans-serif";
export const mono = "'JetBrains Mono', monospace";