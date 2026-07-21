// src/app/components/student/AssignmentDetailView.tsx – modified

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ChevronLeft, Download, Paperclip, Send } from 'lucide-react';
import { ASSIGNMENTS, COURSES } from '../../data';
import { serif, statusColor, statusLabel, daysUntil, getAssignmentStatusInfo, saveSubmission } from '../../utils/helpers';

export function AssignmentDetailView() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const assignment = ASSIGNMENTS.find((a) => a.id === assignmentId);
  if (!assignment) {
    navigate('/assignments', { replace: true });
    return null;
  }

  const course = COURSES.find((c) => c.id === assignment.courseId);
  const statusInfo = getAssignmentStatusInfo(assignment);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (assignment.submissionType === 'file' && !selectedFile) {
      toast.error('Please attach a file before submitting.');
      return;
    }
    if (assignment.submissionType === 'text' && !submissionText.trim()) {
      toast.error('Please write something before submitting.');
      return;
    }
    if (assignment.submissionType === 'both' && !submissionText.trim() && !selectedFile) {
      toast.error('Please provide either text or a file.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      // Save submission to localStorage
      saveSubmission(assignment.id, {
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      });
      toast.success(`Assignment "${assignment.title}" submitted!`);
      setIsSubmitting(false);
      navigate('/assignments');
    }, 1500);
  };

  const days = daysUntil(assignment.dueDate);
  const isOverdue = days < 0;

  const isGraded = assignment.score !== undefined && assignment.score !== null;
  const isSubmitted = statusInfo.label === 'Submitted';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/assignments')} className="-ml-2">
        <ChevronLeft size={14} className="mr-1" /> Back to Assignments
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
                {assignment.title}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span>{course?.code || assignment.courseId}</span>
                <span>•</span>
                <span>Due {assignment.dueDate}</span>
                <span>•</span>
                <span>Weight: {assignment.weight}%</span>
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
                {isOverdue && !isSubmitted && !isGraded && (
                  <Badge variant="destructive">Overdue</Badge>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{assignment.type}</span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none my-4">
            <h3 className="text-sm font-semibold text-foreground">Instructions</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {assignment.instructions || 'No specific instructions provided.'}
            </p>
          </div>

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="my-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {assignment.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    className="flex items-center gap-1.5 text-xs bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Paperclip size={12} />
                    {att.name}
                    <Download size={10} className="ml-1" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-5 mt-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Your Submission</h3>

            {isGraded ? (
              <div className="bg-secondary/30 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">You scored</p>
                <p className="text-3xl font-light text-foreground" style={{ fontFamily: serif }}>
                  {assignment.score}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Assignment has been graded.</p>
              </div>
            ) : isSubmitted ? (
              <div className="bg-amber-500/10 rounded-xl p-4 text-center">
                <p className="text-sm text-amber-500">Submitted – waiting for grading</p>
                <p className="text-xs text-muted-foreground mt-2">{statusInfo.timeNote}</p>
                {submissionText && <p className="text-xs text-muted-foreground mt-2">{submissionText}</p>}
                {selectedFile && <p className="text-xs text-muted-foreground">File: {selectedFile.name}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                {(assignment.submissionType === 'text' || assignment.submissionType === 'both') && (
                  <div>
                    <Label htmlFor="submission-text">Write your answer</Label>
                    <Textarea
                      id="submission-text"
                      placeholder="Type your response here..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                )}

                {(assignment.submissionType === 'file' || assignment.submissionType === 'both') && (
                  <div>
                    <Label htmlFor="file-upload">Upload file</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : <><Send size={14} className="mr-2" /> Submit Assignment</>}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}