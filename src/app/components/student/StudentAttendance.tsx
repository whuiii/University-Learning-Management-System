import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CLASS_SCHEDULE, ATTENDANCE_RECORDS } from '../../data';
import { serif } from '../../utils/helpers';
import type { ClassSchedule } from '../../data';

// Calculate distance between two coordinates (in meters)
function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function StudentAttendance() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(ATTENDANCE_RECORDS);
  const [processing, setProcessing] = useState<string | null>(null);

  // Get user's current location
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

  // Get today's date string
  const today = new Date().toISOString().split('T')[0];

  // Filter classes: upcoming (today & future) and past
  const todayClasses = CLASS_SCHEDULE.filter((cls) => cls.date === today);
  const futureClasses = CLASS_SCHEDULE.filter((cls) => cls.date > today);
  const pastClasses = CLASS_SCHEDULE.filter((cls) => cls.date < today);

  // For today's classes, check if we are within the time window
  const getClassStatus = (cls: ClassSchedule) => {
    const now = new Date();
    const classDate = new Date(cls.date);
    const start = new Date(`${cls.date}T${cls.startTime}`);
    const end = new Date(`${cls.date}T${cls.endTime}`);
    const isToday = cls.date === today;
    const isPast = cls.date < today;
    const isFuture = cls.date > today;

    if (isPast) {
      const status = attendance[cls.id];
      return { status, canMark: false, message: status === 'present' ? 'Present' : 'Absent' };
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
      return { status: status || 'missed', canMark: false, message: status === 'present' ? 'Present' : 'Missed' };
    }
    // Within class time
    const hasMarked = attendance[cls.id] === 'present';
    return { status: hasMarked ? 'present' : 'available', canMark: !hasMarked, message: hasMarked ? 'Present' : 'Mark Attendance' };
  };

  // Handle marking attendance
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

    if (distance > 100) {
      toast.error(`You are too far from the class location (${Math.round(distance)}m away). Please go to the class room.`);
      return;
    }

    setProcessing(cls.id);
    // Simulate an API call
    setTimeout(() => {
      setAttendance((prev) => ({ ...prev, [cls.id]: 'present' }));
      toast.success(`Attendance marked for ${cls.title}!`);
      setProcessing(null);
    }, 1200);
  };

  // Group classes for display
  const groups = [
    { label: 'Today\'s Classes', classes: todayClasses },
    { label: 'Upcoming Classes', classes: futureClasses },
    { label: 'Past Classes', classes: pastClasses },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
                Location detected: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
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

      {/* Class lists */}
      {groups.map((group) => (
        <div key={group.label}>
          <h2 className="text-lg font-semibold text-foreground mb-3">{group.label}</h2>
          {group.classes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes found.</p>
          ) : (
            <div className="space-y-3">
              {group.classes.map((cls) => {
                const statusInfo = getClassStatus(cls);
                const isPast = group.label === 'Past Classes';
                return (
                  <Card key={cls.id} className="border-border hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{cls.courseCode}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm font-medium">{cls.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {cls.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {cls.startTime} – {cls.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {cls.room}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isPast ? (
                          attendance[cls.id] === 'present' ? (
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                              <CheckCircle size={12} className="mr-1" /> Present
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-500 border-red-500/30">
                              <XCircle size={12} className="mr-1" /> Absent
                            </Badge>
                          )
                        ) : (
                          <>
                            {statusInfo.status === 'present' ? (
                              <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                                <CheckCircle size={12} className="mr-1" /> Present
                              </Badge>
                            ) : statusInfo.canMark ? (
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
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}