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
import { Plus, Trash2 } from 'lucide-react';
import { COURSES, ASSIGNMENTS } from '../../data';
import { serif } from '../../utils/helpers';

// CSS import – TypeScript may complain; we'll add a declaration below
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// ─── Types ────────────────────────────────────────────────────
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'assignment' | 'meeting' | 'study' | 'other';
  description?: string;
  location?: string;
}

// ─── Helpers ──────────────────────────────────────────────────
const eventColors = {
  assignment: '#C4582A',
  meeting: '#4470B4',
  study: '#4A8A5C',
  other: '#D4A230',
};

const eventTypeLabels = {
  assignment: 'Assignment',
  meeting: 'Meeting',
  study: 'Study Session',
  other: 'Other',
};

function getEventStyle(event: CalendarEvent) {
  return {
    style: {
      backgroundColor: eventColors[event.type],
      borderRadius: '4px',
      border: 'none',
      color: 'white',
      padding: '2px 4px',
    },
  };
}

// ─── Component ────────────────────────────────────────────────
export function StudentCalendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    start: new Date(),
    end: new Date(Date.now() + 3600000),
    type: 'other',
    description: '',
    location: '',
  });

  // Load events from localStorage + assignments
  useEffect(() => {
    try {
      // Load custom events from localStorage
      const stored = localStorage.getItem('student_calendar_events');
      const customEvents = stored ? JSON.parse(stored) : [];

      // Convert assignment deadlines to calendar events
      const assignmentEvents: CalendarEvent[] = ASSIGNMENTS.map((a) => {
        // Find the course to get its code
        const course = COURSES.find((c) => c.id === a.courseId);
        const courseCode = course?.code || a.courseId; // fallback to ID if not found
        return {
          id: `assignment-${a.id}`,
          title: `${courseCode}: ${a.title}`,
          start: new Date(a.dueDate),
          end: new Date(a.dueDate),
          type: 'assignment',
          description: `Weight: ${a.weight}% · Status: ${a.status}`,
        };
      });

      // Merge and sort by start date
      const allEvents = [...assignmentEvents, ...customEvents].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      );
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      toast.error('Could not load calendar events');
    }
  }, []);

  // Save custom events to localStorage
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
      start: formData.start!,
      end: formData.end!,
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
      start: formData.start!,
      end: formData.end!,
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
    if (!event.id.startsWith('custom-')) {
      toast.error('Cannot delete assignment events');
      return;
    }
    const customEvents = events
      .filter((e) => e.id.startsWith('custom-'))
      .filter((e) => e.id !== event.id);
    saveCustomEvents(customEvents);
    setEvents(events.filter((e) => e.id !== event.id));
    toast.success('Event deleted');
    setIsModalOpen(false);
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

  const openAddModal = (slotInfo?: any) => {
    const start = slotInfo?.start || new Date();
    const end = slotInfo?.end || new Date(start.getTime() + 3600000);
    setFormData({ ...formData, start, end });
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      start: event.start,
      end: event.end,
      type: event.type,
      description: event.description || '',
      location: event.location || '',
    });
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: any) => {
    openAddModal(slotInfo);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    openEditModal(event);
  };

  // ─── Today's Date Highlighting ────────────────────────────
  const dayPropGetter = (date: Date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        style: {
          backgroundColor: '#3b82f6', // primary blue
          color: 'white',
          borderRadius: '50%',
          fontWeight: 'bold',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        },
        className: 'rbc-today-highlight',
      };
    }
    return {};
  };

  const { views } = useMemo(() => ({
    views: {
      month: true,
      week: true,
      day: true,
    },
  }), []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            My Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your schedule – assignments, meetings, and study sessions
          </p>
        </div>
        <Button onClick={() => openAddModal()}>
          <Plus size={16} className="mr-2" /> Add Event
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden">
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
          eventPropGetter={getEventStyle}
          dayPropGetter={dayPropGetter}
          selectable
          popup
          tooltipAccessor={(event) =>
            `${event.title}\n${event.type === 'assignment' ? 'Assignment' : 'Custom'}\n${event.description || ''}`
          }
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      {/* ─── Add/Edit Modal ─────────────────────────────────── */}
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
                  onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
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
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
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
    </div>
  );
}