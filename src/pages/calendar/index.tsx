import { useState, useEffect } from 'react';
import AppShell from '../../components/ui/AppShell';
import { type CalendarEvent } from './components/UpcomingEvents';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import WeekView from './components/WeekView';
import UpcomingEvents from './components/UpcomingEvents';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './service/calendarService';

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  d?.setDate(d?.getDate() - d?.getDay());
  d?.setHours(0, 0, 0, 0);
  return d;
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 2, 3));
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 3));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date(2026, 2, 3)));

  useEffect(() => {
    fetchEvents().then(({ data }) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'add' | 'edit'>('add');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    } else {
      const newStart = new Date(weekStart);
      newStart?.setDate(newStart?.getDate() - 7);
      setWeekStart(newStart);
      setCurrentDate(newStart);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    } else {
      const newStart = new Date(weekStart);
      newStart?.setDate(newStart?.getDate() + 7);
      setWeekStart(newStart);
      setCurrentDate(newStart);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
    setWeekStart(getWeekStart(today));
  };

  const handleViewChange = (v: 'month' | 'week'): void => {
    setView(v);
    if (v === 'week') setWeekStart(getWeekStart(selectedDate || new Date()));
  };

  const handleDateSelect = (date: Date): void => setSelectedDate(date);

  const handleAddEvent = (): void => {
    setEventModalMode('add');
    setEditingEvent(null);
    setEventModalOpen(true);
  };

  const handleEventClick = (ev: CalendarEvent): void => {
    setDetailEvent(ev);
    setDetailModalOpen(true);
  };

  const handleEditFromDetail = (ev: CalendarEvent): void => {
    setDetailModalOpen(false);
    setEditingEvent(ev);
    setEventModalMode('edit');
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (data: Omit<CalendarEvent, 'id'> & { id?: string }): Promise<void> => {
    if (eventModalMode === 'edit' && data?.id) {
      const { data: updated } = await updateEvent(data as CalendarEvent);
      if (updated) setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      const { data: created } = await createEvent(data);
      if (created) setEvents((prev) => [...prev, created]);
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = async (id: string): Promise<void> => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setEventModalOpen(false);
    setDetailModalOpen(false);
  };

  return (
    <AppShell>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Page title */}
          <div className="mb-5">
            <h1 className="font-heading text-2xl md:text-3xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Our Calendar
            </h1>
            <p className="text-sm font-caption mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              Plan and manage your shared schedule together
            </p>
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-5">

            {/* Calendar area */}
            <div className="flex-1 min-w-0">
              <div
                className="rounded-xl border p-4 md:p-5"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <CalendarHeader
                  currentDate={currentDate}
                  view={view}
                  onViewChange={handleViewChange}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onToday={handleToday}
                  onAddEvent={handleAddEvent}
                />

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <span className="text-sm font-caption" style={{ color: 'var(--color-muted-foreground)' }}>Loading events...</span>
                  </div>
                ) : view === 'month' ? (
                  <CalendarGrid
                    currentDate={currentDate}
                    events={events}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onEventClick={handleEventClick}
                  />
                ) : (
                  <WeekView
                    weekStart={weekStart}
                    events={events}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onEventClick={handleEventClick}
                  />
                )}
              </div>
            </div>

            {/* Sidebar panel */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-6" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                <UpcomingEvents
                  events={events}
                  onEventClick={handleEventClick}
                  onAddEvent={handleAddEvent}
                />
              </div>
            </div>
          </div>
        </div>
      {/* Modals */}
      <EventModal
        isOpen={eventModalOpen}
        mode={eventModalMode}
        event={editingEvent}
        selectedDate={selectedDate}
        onClose={() => setEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
      <EventDetailModal
        isOpen={detailModalOpen}
        event={detailEvent}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteEvent}
      />
    </AppShell>
  );
};

export default CalendarPage;