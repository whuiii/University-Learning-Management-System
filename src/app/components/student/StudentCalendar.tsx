import { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Trash2, BookOpen, Calendar as CalendarIcon, Clock, MapPin, FileText } from 'lucide-react';
import { COURSES, ASSIGNMENTS, CLASS_SCHEDULE } from '../../data';
import { serif } from '../../utils/helpers';

// @ts-ignore
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'assignment' | 'meeting' | 'study' | 'other' | 'class';
  description?: string;
  location?: string;
}

const eventColors = {
  assignment: '#C4582A',
  meeting: '#4470B4',
  study: '#4A8A5C',
  other: '#D4A230',
  class: '#7C3AED',
};

const eventTypeLabels = {
  assignment: 'Assignment',
  meeting: 'Meeting',
  study: 'Study Session',
  other: 'Other',
  class: 'Class',
};

// ─── Event Component ──────────────────────────────────────────
function CustomEvent({ event }: { event: CalendarEvent }) {
  const bgColor = eventColors[event.type] || '#6B7280';

  if (event.allDay) {
    return (
      <div
        className="flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium w-full h-full overflow-hidden"
        style={{ backgroundColor: bgColor, color: 'white' }}
      >
        <span className="truncate">{event.title}</span>
      </div>
    );
  }

  const durationMinutes = moment(event.end).diff(moment(event.start), 'minutes');
  const isTight = durationMinutes <= 30;

  return (
    <div
      className="flex flex-col justify-start items-start px-1.5 py-1 rounded text-[11px] font-medium w-full h-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: 'white' }}
    >
      <span className="truncate leading-tight font-semibold">{event.title}</span>
      {!isTight && (
        <span className="truncate leading-tight text-[10px] opacity-90">
          {moment(event.start).format('h:mm A')} – {moment(event.end).format('h:mm A')}
        </span>
      )}
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────
function CustomToolbar({ label, onView, onNavigate, views, view }: any) {
  const viewNames: Record<string, string> = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
  };

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('PREV')} className="h-8 w-8 p-0">
          ‹
        </Button>
        <span className="text-lg font-medium text-foreground" style={{ fontFamily: serif }}>
          {label}
        </span>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('NEXT')} className="h-8 w-8 p-0">
          ›
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')} className="text-xs h-8">
          Today
        </Button>
      </div>
      <div className="flex gap-1">
        {views.map((v: string) => (
          <Button
            key={v}
            variant={view === v ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onView(v)}
            className="text-xs h-8 capitalize"
          >
            {viewNames[v] || v}
          </Button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export function StudentCalendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    start: new Date(),
    end: new Date(Date.now() + 3600000),
    type: 'other',
    description: '',
    location: '',
  });

  // ─── Load all events (Classes, Assignments, Custom) ──────
  useEffect(() => {
    try {
      // 1. Generate Class events from CLASS_SCHEDULE (Timetable)
      const classEvents: CalendarEvent[] = CLASS_SCHEDULE.map((s) => {
        const course = COURSES.find((c) => c.code === s.courseCode);
        const startDateTime = new Date(`${s.date}T${s.startTime}`);
        const endDateTime = new Date(`${s.date}T${s.endTime}`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.warn(`Invalid schedule date for ${s.courseCode} on ${s.date}`);
          return null;
        }

        return {
          id: `class-${s.id}`,
          title: `${s.courseCode}: ${course?.title || s.title}`,
          start: startDateTime,
          end: endDateTime,
          allDay: false,
          type: 'class',
          description: `Room: ${s.location.address}`,
          location: s.location.address,
        };
      }).filter(Boolean) as CalendarEvent[];

      // 2. Load custom events from localStorage
      const stored = localStorage.getItem('student_calendar_events');
      let customEvents: CalendarEvent[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            customEvents = parsed.map((e: any) => ({
              ...e,
              start: new Date(e.start),
              end: new Date(e.end),
            }));
          } else {
            console.warn('Stored events is not an array, removing invalid data');
            localStorage.removeItem('student_calendar_events');
          }
        } catch (parseError) {
          console.error('Failed to parse stored events:', parseError);
          localStorage.removeItem('student_calendar_events');
        }
      }

      // 3. Generate Assignment events from ASSIGNMENTS
      const assignmentEvents: CalendarEvent[] = ASSIGNMENTS.map((a) => {
        const course = COURSES.find((c) => c.id === a.courseId);
        const courseCode = course?.code || a.courseId;
        const dueDate = new Date(a.dueDate);
        if (isNaN(dueDate.getTime())) {
          console.warn(`Invalid due date for assignment ${a.id}: ${a.dueDate}`);
          const fallbackDate = new Date();
          return {
            id: `assignment-${a.id}`,
            title: `${courseCode}: ${a.title}`,
            start: fallbackDate,
            end: fallbackDate,
            allDay: true,
            type: 'assignment',
            description: `Weight: ${a.weight}% · Status: ${a.status}`,
          };
        }
        const endOfDay = new Date(dueDate);
        endOfDay.setHours(23, 59, 59, 999);
        return {
          id: `assignment-${a.id}`,
          title: `${courseCode}: ${a.title}`,
          start: dueDate,
          end: endOfDay,
          allDay: true,
          type: 'assignment',
          description: `Weight: ${a.weight}% · Status: ${a.status}`,
        };
      });

      // 4. Merge all and sort
      const allEvents = [...classEvents, ...assignmentEvents, ...customEvents].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      );
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      toast.error('Could not load calendar events');
    }
  }, []);

  const saveCustomEvents = (custom: CalendarEvent[]) => {
    localStorage.setItem('student_calendar_events', JSON.stringify(custom));
  };

  // ─── CRUD Operations ──────────────────────────────────────
  const handleAddEvent = () => {
    if (!formData.title) {
      toast.error('Please enter an event title');
      return;
    }
    const newEvent: CalendarEvent = {
      id: `custom-${Date.now()}`,
      title: formData.title!,
      start: new Date(formData.start!),
      end: new Date(formData.end!),
      allDay: false,
      type: formData.type as CalendarEvent['type'],
      description: formData.description || '',
      location: formData.location || '',
    };

    const customEvents = events.filter((e) => e.id.startsWith('custom-'));
    customEvents.push(newEvent);
    saveCustomEvents(customEvents);
    setEvents([...events, newEvent]);
    toast.success('Event added successfully');
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    if (!formData.title) {
      toast.error('Please enter an event title');
      return;
    }

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: formData.title!,
      start: new Date(formData.start!),
      end: new Date(formData.end!),
      type: formData.type as CalendarEvent['type'],
      description: formData.description || '',
      location: formData.location || '',
    };

    const customEvents = events
      .filter((e) => e.id.startsWith('custom-'))
      .map((e) => (e.id === editingEvent.id ? updatedEvent : e));
    saveCustomEvents(customEvents);
    setEvents(events.map((e) => (e.id === editingEvent.id ? updatedEvent : e)));
    toast.success('Event updated');
    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    if (event.id.startsWith('assignment-') || event.id.startsWith('class-')) {
      toast.error(`Cannot delete system events (${eventTypeLabels[event.type] || 'Event'})`);
      return;
    }
    if (!event.id.startsWith('custom-')) {
      toast.error('Cannot delete this event');
      return;
    }

    const customEvents = events
      .filter((e) => e.id.startsWith('custom-'))
      .filter((e) => e.id !== event.id);
    saveCustomEvents(customEvents);
    setEvents(events.filter((e) => e.id !== event.id));
    toast.success('Event deleted');
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      type: 'other',
      description: '',
      location: '',
    });
    setEditingEvent(null);
  };

  // ─── Modified: detect month‑view clicks and set default time ──
  const openAddModal = (slotInfo?: any) => {
    let start = slotInfo?.start ? new Date(slotInfo.start) : new Date();
    let end = slotInfo?.end ? new Date(slotInfo.end) : new Date(start.getTime() + 3600000);
    
    // If the slot covers exactly 24 hours or more, it's a month‑view click
    const duration = end.getTime() - start.getTime();
    if (duration >= 86400000) { // 24 hours or more
      // Default to 9:00 – 10:00 AM on the selected day
      start = new Date(start);
      start.setHours(9, 0, 0, 0);
      end = new Date(start);
      end.setHours(10, 0, 0, 0);
    }
    
    setFormData({ ...formData, start, end });
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openDetailModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const openEditFromDetail = () => {
    if (!selectedEvent) return;
    if (selectedEvent.id.startsWith('assignment-') || selectedEvent.id.startsWith('class-')) {
      toast.error('System events cannot be edited');
      return;
    }
    setIsDetailModalOpen(false);
    setEditingEvent(selectedEvent);
    setFormData({
      title: selectedEvent.title,
      start: new Date(selectedEvent.start),
      end: new Date(selectedEvent.end),
      type: selectedEvent.type,
      description: selectedEvent.description || '',
      location: selectedEvent.location || '',
    });
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: any) => {
    openAddModal(slotInfo);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    openDetailModal(event);
  };

  // ─── Today highlight ──────────────────────────────────────
  const dayPropGetter = (date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: 'rbc-today-highlight',
        style: {
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          borderRadius: '0px',
        },
      };
    }
    return {};
  };

  // ─── Time constraints ──────────────────────────────────────
  const minTime = useMemo(() => new Date(0, 0, 0, 0 , 0, 0), []);   // 6:00 AM
  const maxTime = useMemo(() => new Date(0, 0, 0, 22, 0, 0), []);  // 10:00 PM
  const scrollToTime = useMemo(() => new Date(0, 0, 0, 8, 0, 0), []); // 8:00 AM

  const { components, views } = useMemo(() => ({
    views: {
      month: true,
      week: true,
      day: true,
    },
    components: {
      event: CustomEvent,
      toolbar: CustomToolbar,
    },
  }), []);

  // ─── Render Detail Modal ────────────────────────────────────
  const renderDetailModal = () => {
    if (!selectedEvent || !isDetailModalOpen) return null;

    const isSystemEvent = selectedEvent.id.startsWith('assignment-') || selectedEvent.id.startsWith('class-');
    const typeLabel = eventTypeLabels[selectedEvent.type] || 'Event';
    const color = eventColors[selectedEvent.type] || '#6B7280';

    return (
      <Dialog open={isDetailModalOpen} onOpenChange={(open) => {
        if (!open) setIsDetailModalOpen(false);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {typeLabel} {isSystemEvent && <span className="text-xs text-muted-foreground">(Read-only)</span>}
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon size={16} className="text-muted-foreground" />
              <span>
                {moment(selectedEvent.start).format('dddd, MMMM D, YYYY')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-muted-foreground" />
              <span>
                {selectedEvent.allDay
                  ? 'All day'
                  : `${moment(selectedEvent.start).format('h:mm A')} – ${moment(selectedEvent.end).format('h:mm A')}`
                }
              </span>
            </div>

            {selectedEvent.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted-foreground" />
                <span>{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.description && (
              <div className="flex items-start gap-2 text-sm">
                <FileText size={16} className="text-muted-foreground mt-0.5" />
                <span className="whitespace-pre-wrap">{selectedEvent.description}</span>
              </div>
            )}

            {isSystemEvent && (
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-1">
                  <BookOpen size={14} />
                  This is a system event. It cannot be edited or deleted.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            {!isSystemEvent && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEvent(selectedEvent)}
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditFromDetail}
                >
                  <BookOpen size={14} className="mr-2" /> Edit
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            My Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your timetable, assignments, and personal events
          </p>
        </div>
        <Button onClick={() => openAddModal()}>
          <Plus size={16} className="mr-2" /> Add Event
        </Button>
      </div>

      {/* ─── Legend ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">📅 Event Types:</span>
        {Object.entries(eventColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-foreground/80 capitalize">
              {key === 'class' ? 'Class (Timetable)' : key}
            </span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          <BookOpen size={12} className="inline mr-1" />
          System events are read‑only
        </span>
      </div>

      {/* ─── Calendar ────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden shadow-sm">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={views}
          defaultView={Views.MONTH}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          dayPropGetter={dayPropGetter}
          min={minTime}
          max={maxTime}
          scrollToTime={scrollToTime}
          selectable
          popup
          tooltipAccessor={(event) =>
            `${event.title}\n${eventTypeLabels[event.type] || 'Event'}\n${event.description || ''}`
          }
          dayLayoutAlgorithm="no-overlap"
          components={components}
        />
      </div>

      {/* ─── Edit/Add Modal ──────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsModalOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) setFormData({ ...formData, start: new Date(val) });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) setFormData({ ...formData, end: new Date(val) });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels)
                    .filter(([key]) => key !== 'class')
                    .map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: eventColors[key as keyof typeof eventColors] }} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Online, Room 301, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {editingEvent && editingEvent.id.startsWith('custom-') && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteEvent(editingEvent)}
              >
                <Trash2 size={14} className="mr-2" /> Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingEvent ? handleEditEvent : handleAddEvent}>
                {editingEvent ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Detail Modal ────────────────────────────────────── */}
      {renderDetailModal()}

      {/* ─── CSS Overrides ──────────────────────────────────── */}
      <style>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header {
          padding: 8px 4px;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--muted-foreground, #6b7280);
          border-bottom: 1px solid var(--border, #e5e7eb);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rbc-off-range-bg { background-color: var(--secondary, #f3f4f6); }
        .rbc-today { background-color: transparent !important; }
        .rbc-today-highlight {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-radius: 0 !important;
        }
        .rbc-day-bg { transition: background-color 0.15s ease; }
        .rbc-day-bg:hover { background-color: rgba(0,0,0,0.02); }
        .rbc-date-cell { padding: 4px; text-align: center; }
        .rbc-date-cell > a {
          color: var(--foreground, #1f2937);
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
        }
        .rbc-date-cell.rbc-now > a { color: #3b82f6; font-weight: 700; }
        .rbc-off-range .rbc-date-cell > a { color: var(--muted-foreground, #9ca3af); }
        .rbc-event { border: none !important; border-radius: 4px !important; padding: 1px 2px !important; background: transparent !important; box-shadow: none !important; cursor: pointer !important; }
        .rbc-event:hover { opacity: 0.85; }
        .rbc-event-label { display: none !important; }
        .rbc-row-segment { padding: 0 2px !important; }
        .rbc-show-more { color: #3b82f6; font-weight: 500; font-size: 0.7rem; padding: 0 4px; cursor: pointer; }
        .rbc-show-more:hover { text-decoration: underline; }
        .rbc-toolbar button {
          border-radius: 6px !important;
          font-size: 0.8rem !important;
          padding: 0.3rem 0.7rem !important;
          background: transparent !important;
          color: var(--foreground, #1f2937) !important;
          border: 1px solid transparent !important;
          transition: all 0.15s ease;
        }
        .rbc-toolbar button.rbc-active { background: #3b82f6 !important; color: white !important; border-color: #3b82f6 !important; }
        .rbc-toolbar button:hover:not(.rbc-active) { background: var(--secondary, #f3f4f6) !important; border-color: var(--border, #e5e7eb) !important; }
        .rbc-month-view, .rbc-time-view { border-radius: 8px; border: 1px solid var(--border, #e5e7eb); overflow: hidden; }
        .rbc-month-row { border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-row-bg { border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-time-header { border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-time-header-gutter, .rbc-time-header-cell { background: var(--card, white); }
        .rbc-time-content { border-top: 1px solid var(--border, #e5e7eb); }
        .rbc-timeslot-group { border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-time-slot { color: var(--muted-foreground, #6b7280); font-size: 0.7rem; padding: 2px 4px; }
        .rbc-current-time-indicator { background-color: #ef4444; height: 2px; }
        .rbc-time-view .rbc-header { border-bottom: none; padding: 6px 0; font-weight: 600; font-size: 0.75rem; color: var(--muted-foreground, #6b7280); }
        .rbc-time-view .rbc-header .rbc-day-slot { font-weight: 500; }
        .rbc-time-view .rbc-header .rbc-day-slot .rbc-date { font-size: 0.9rem; font-weight: 600; color: var(--foreground, #1f2937); }
        .rbc-time-view .rbc-event { border-radius: 3px !important; min-height: 20px; display: flex !important; align-items: stretch !important; }
        .rbc-event-content { height: 100% !important; display: flex; }
        .rbc-overlay { background: var(--card, white); border: 1px solid var(--border, #e5e7eb); border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); padding: 8px 12px; }
        .rbc-overlay-header { font-weight: 600; border-bottom: 1px solid var(--border, #e5e7eb); padding-bottom: 4px; margin-bottom: 6px; font-size: 0.9rem; }
        .rbc-overlay .rbc-event { padding: 2px 0 !important; }
        .rbc-agenda-view table { border-collapse: collapse; width: 100%; }
        .rbc-agenda-view .rbc-agenda-date-cell { padding: 8px 12px; font-weight: 600; border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-agenda-view .rbc-agenda-time-cell { padding: 8px 12px; color: var(--muted-foreground, #6b7280); border-bottom: 1px solid var(--border, #e5e7eb); }
        .rbc-agenda-view .rbc-agenda-event-cell { padding: 8px 12px; border-bottom: 1px solid var(--border, #e5e7eb); }
      `}</style>
    </div>
  );
}