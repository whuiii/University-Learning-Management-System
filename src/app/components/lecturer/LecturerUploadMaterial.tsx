import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, X, File, Check, ChevronLeft, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { useCourseData } from '../hooks/useCourseData';
import { serif } from '../../utils/helpers';

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  url: string;
}

export function LecturerUploadMaterial() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courseData, addMaterial } = useCourseData(courseId!);

  const [title, setTitle] = useState('');
  const [week, setWeek] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/zip': ['.zip'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!week) {
      toast.error('Please select a week/section');
      return;
    }
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create a material entry for each file
    files.forEach((fileItem) => {
      const extension = fileItem.name.split('.').pop()?.toLowerCase() || '';
      let type: 'pdf' | 'video' | 'link' = 'pdf';
      if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) type = 'video';
      else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) type = 'pdf'; // treat images as pdf-like? we can keep as 'link' or 'pdf'
      else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'txt'].includes(extension)) type = 'link';

      // Build a descriptive title: "Week X - [original file name]"
      const fileTitle = `Week ${week}: ${fileItem.name}`;

      addMaterial({
        title: fileTitle,
        type: type,
        url: fileItem.url, // in real app, you'd upload to server and get a URL
        // We could also store size, but the Material type doesn't have size for link type; we'll add a custom field later if needed
      });
    });

    toast.success(`${files.length} file(s) uploaded successfully`);
    setUploading(false);
    // Navigate back to course detail materials tab
    navigate(`/lecturer/courses/${courseId}?tab=materials`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!courseData) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate(`/lecturer/courses/${courseId}?tab=materials`)} className="-ml-2">
            <ChevronLeft size={14} className="mr-1" /> Back to Materials
          </Button>
          <h1 className="text-2xl font-normal text-foreground mt-2" style={{ fontFamily: serif }}>
            Upload Materials
          </h1>
          <p className="text-sm text-muted-foreground">
            {courseData.code} – {courseData.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/lecturer/courses/${courseId}?tab=materials`)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={uploading || files.length === 0}>
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Uploading...
              </>
            ) : (
              <>
                <Upload size={14} className="mr-2" /> Upload {files.length} file(s)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Material Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lecture Notes Week 7"
            />
          </div>

          {/* Week/Section */}
          <div className="space-y-2">
            <Label htmlFor="week">Week / Section <span className="text-red-500">*</span></Label>
            <Select value={week} onValueChange={setWeek}>
              <SelectTrigger id="week">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((w) => (
                  <SelectItem key={w} value={w.toString()}>
                    Week {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional information about this material..."
              rows={3}
            />
          </div>

          {/* File Dropzone */}
          <div className="space-y-2">
            <Label>Files <span className="text-red-500">*</span></Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload size={40} className="mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground">
                {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, Video, Images, Word, PowerPoint, ZIP, and more
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{files.length} file(s) selected</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <File size={16} className="text-primary flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{fileItem.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(fileItem.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileItem.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}