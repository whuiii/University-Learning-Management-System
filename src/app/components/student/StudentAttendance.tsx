import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CLASS_SCHEDULE, ATTENDANCE_RECORDS } from '../../data';
import { serif } from '../../utils/helpers';
import type { ClassSchedule } from '../../data';

// ---------- Types ----------
type AttendanceStatus = 'present' | 'absent' | 'missed' | 'upcoming' | 'not_started' | 'available';

interface AbsenceRequest {
  reason: string;
  proof?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// ---------- Helpers ----------
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = (day === 0 ? 6 : day - 1); // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// ---------- Main Component ----------
export function StudentAttendance() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(ATTENDANCE_RECORDS);
  const [processing, setProcessing] = useState<string | null>(null);

  // Absence request state
  const [absenceRequests, setAbsenceRequests] = useState<Record<string, AbsenceRequest>>({});
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [absenceReason, setAbsenceReason] = useState('');
  const [absenceProof, setAbsenceProof] = useState<File | null>(null);
  const [submittingAbsence, setSubmittingAbsence] = useState(false);

  // Calendar state
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(today));
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // ---------- Geolocation ----------
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        toast.error('Unable to get your location. Please enable location services.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ---------- Class status logic ----------
  const getClassStatus = (cls: ClassSchedule): {
    status: AttendanceStatus;
    canMark: boolean;
    message: string;
  } => {
    const now = new Date();
    const start = new Date(`${cls.date}T${cls.startTime}`);
    const end = new Date(`${cls.date}T${cls.endTime}`);
    const isToday = cls.date === formatDate(today);
    const isPast = cls.date < formatDate(today);
    const isFuture = cls.date > formatDate(today);

    if (isPast) {
      const status = attendance[cls.id];
      return {
        status: status === 'present' ? 'present' : 'absent',
        canMark: false,
        message: status === 'present' ? 'Present' : 'Absent',
      };
    }
    if (isFuture) {
      return { status: 'upcoming', canMark: false, message: 'Upcoming' };
    }
    // Today
    if (now < start) {
      return { status: 'not_started', canMark: false, message: 'Not started yet' };
    }
    if (now > end) {
      const status = attendance[cls.id];
      return {
        status: status === 'present' ? 'present' : 'missed',
        canMark: false,
        message: status === 'present' ? 'Present' : 'Missed',
      };
    }
    // Within class time
    const hasMarked = attendance[cls.id] === 'present';
    return {
      status: hasMarked ? 'present' : 'available',
      canMark: !hasMarked,
      message: hasMarked ? 'Present' : 'Mark Attendance',
    };
  };

  // ---------- Mark attendance ----------
  const handleMarkAttendance = (cls: ClassSchedule) => {
    if (!userLocation) {
      toast.error('Location not available. Please enable GPS.');
      return;
    }

    const { lat, lng } = cls.location;
    const distance = getDistanceFromLatLonInMeters(
      userLocation.lat,
      userLocation.lng,
      lat,
      lng
    );

    // Log location details to console for your reference
    console.log(`📍 Class: ${cls.courseCode} - ${cls.title}`);
    console.log(`   Your location: ${userLocation.lat}, ${userLocation.lng}`);
    console.log(`   Class location: ${lat}, ${lng}`);
    console.log(`   Distance: ${Math.round(distance)}m`);
    console.log(`   Address: ${cls.location.address}`);

    if (distance > 100) {
      toast.error(
        `You are too far from the class location (${Math.round(
          distance
        )}m away). Please go to the class room.`
      );
      return;
    }

    setProcessing(cls.id);
    setTimeout(() => {
      setAttendance((prev) => ({ ...prev, [cls.id]: 'present' }));
      toast.success(`Attendance marked for ${cls.title}!`);
      setProcessing(null);
    }, 1200);
  };

  // ---------- Absence submission ----------
  const openAbsenceModal = (classId: string) => {
    setSelectedClassId(classId);
    setAbsenceReason('');
    setAbsenceProof(null);
    setShowAbsenceModal(true);
  };

  const handleSubmitAbsence = async () => {
    if (!selectedClassId) return;
    if (!absenceReason.trim()) {
      toast.error('Please provide a reason for your absence.');
      return;
    }

    setSubmittingAbsence(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const proofName = absenceProof ? absenceProof.name : undefined;

    setAbsenceRequests((prev) => ({
      ...prev,
      [selectedClassId]: {
        reason: absenceReason.trim(),
        proof: proofName,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      },
    }));

    toast.success('Absence reason submitted for review.');
    setShowAbsenceModal(false);
    setSubmittingAbsence(false);
  };

  // ---------- Calendar helpers ----------
  const goToToday = () => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
    setSelectedDate(today);
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const weekStartDate = currentWeekStart;
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  const selectedDateStr = formatDate(selectedDate);
  const filteredClasses = CLASS_SCHEDULE.filter((cls) => cls.date === selectedDateStr);

  // ---------- Render absence modal ----------
  const renderAbsenceModal = () => {
    if (!showAbsenceModal) return null;
    const cls = CLASS_SCHEDULE.find((c) => c.id === selectedClassId);
    if (!cls) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Submit Absence Reason</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {cls.courseCode} – {cls.title} ({cls.date})
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason *</label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={4}
                placeholder="Explain why you were absent..."
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Proof (optional)</label>
              <input
                type="file"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAbsenceProof(file);
                }}
              />
              {absenceProof && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {absenceProof.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAbsenceModal(false)}
              disabled={submittingAbsence}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAbsence}
              disabled={submittingAbsence || !absenceReason.trim()}
            >
              {submittingAbsence ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ---------- Render absence status badge ----------
  const renderAbsenceStatus = (classId: string) => {
    const request = absenceRequests[classId];
    if (!request) return null;

    const statusMap = {
      pending: { label: 'Pending Review', variant: 'outline' as const, icon: AlertCircle },
      approved: { label: 'Approved', variant: 'outline' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'outline' as const, icon: XCircle },
    };
    const info = statusMap[request.status];
    const Icon = info.icon;
    return (
      <Badge variant={info.variant} className="gap-1">
        <Icon size={12} />
        {info.label}
      </Badge>
    );
  };

  // ---------- Main render ----------
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          My Attendance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mark your attendance for today's classes. Location verification is required.
        </p>
      </div>

      {/* Location status */}
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          {locationLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : userLocation ? (
            <>
              <MapPin className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">
                GPS enabled – you are at {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-500">Location unavailable – please enable GPS</span>
            </>
          )}
        </CardContent>
      </Card>

      {/* Calendar navigation with Today button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newStart = new Date(currentWeekStart);
              newStart.setDate(newStart.getDate() - 7);
              setCurrentWeekStart(newStart);
            }}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newStart = new Date(currentWeekStart);
              newStart.setDate(newStart.getDate() + 7);
              setCurrentWeekStart(newStart);
            }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        <span className="text-sm font-medium">
          {weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –
          {new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <Button variant="default" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Calendar grid – neutral background, no attendance colours */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground text-center py-1">
            {day}
          </div>
        ))}
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const isToday = dateStr === formatDate(today);
          const isSelected = dateStr === formatDate(selectedDate);

          let bgClass = 'bg-background';
          let borderClass = 'border-border';
          let textClass = 'text-foreground';

          if (isToday) {
            borderClass = 'border-primary border-2';
          }
          if (isSelected) {
            bgClass = 'bg-primary/20';
            borderClass = 'border-primary';
          }

          return (
            <button
              key={dateStr}
              className={`flex flex-col items-center justify-center p-2 rounded-md border ${borderClass} ${bgClass} ${textClass} transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 h-12`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-sm font-medium">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Classes for selected date */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Classes on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        {filteredClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No classes scheduled on this day.</p>
        ) : (
          <div className="space-y-3">
            {filteredClasses.map((cls) => {
              const statusInfo = getClassStatus(cls);
              const isPast = cls.date < formatDate(today);
              const isToday = cls.date === formatDate(today);
              const absenceRequest = absenceRequests[cls.id];
              const isPresent = attendance[cls.id] === 'present';

              const canSubmitAbsence = !isPresent && !absenceRequest && (isToday || isPast);

              return (
                <Card key={cls.id} className="border-border hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{cls.courseCode}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm font-medium">{cls.title}</span>
                        {isToday && (
                          <Badge variant="secondary" className="text-xs">Today</Badge>
                        )}
                        {isPast && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">Past</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {cls.startTime} – {cls.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {cls.location.address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {isPresent ? (
                        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                          <CheckCircle size={12} className="mr-1" /> Present
                        </Badge>
                      ) : isPast ? (
                        <Badge variant="outline" className="text-red-500 border-red-500/30">
                          <XCircle size={12} className="mr-1" /> Absent
                        </Badge>
                      ) : (
                        <>
                          {statusInfo.canMark ? (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAttendance(cls)}
                              disabled={!userLocation || processing === cls.id}
                              className="min-w-[120px]"
                            >
                              {processing === cls.id ? (
                                <Loader2 size={14} className="animate-spin mr-2" />
                              ) : null}
                              {processing === cls.id ? 'Processing…' : 'Mark Attendance'}
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="text-muted-foreground">
                              {statusInfo.message}
                            </Badge>
                          )}
                        </>
                      )}

                      {absenceRequest && (
                        <div className="ml-1">{renderAbsenceStatus(cls.id)}</div>
                      )}

                      {canSubmitAbsence && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAbsenceModal(cls.id)}
                          className="gap-1"
                        >
                          <FileText size={14} />
                          Submit Absence
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Absence Modal */}
      {renderAbsenceModal()}
    </div>
  );
}