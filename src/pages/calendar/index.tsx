import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { type CalendarEvent } from './components/UpcomingEvents';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import WeekView from './components/WeekView';
import UpcomingEvents from './components/UpcomingEvents';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';

const MOCK_USER = { name: 'Sarah & James', email: 'couple@together.app' };

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

const generateId = () => `evt_${Date.now()}_${Math.random()?.toString(36)?.slice(2, 7)}`;

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_001',
    title: 'Anniversary Dinner',
    startDate: '2026-03-14T19:00:00',
    endDate: '2026-03-14T22:00:00',
    location: 'Le Bernardin, New York',
    description: 'Our 5th wedding anniversary celebration at the finest French restaurant in the city.',
    category: 'anniversary',
    allDay: false,
  },
  {
    id: 'evt_002',
    title: 'Weekend Getaway – Catskills',
    startDate: '2026-03-20T10:00:00',
    endDate: '2026-03-22T18:00:00',
    location: 'Catskills, New York',
    description: 'Cabin retreat in the mountains. Pack hiking boots and warm clothes.',
    category: 'travel',
    allDay: false,
  },
  {
    id: 'evt_003',
    title: 'Couples Yoga Class',
    startDate: '2026-03-07T09:00:00',
    endDate: '2026-03-07T10:30:00',
    location: 'Harmony Yoga Studio',
    description: 'Saturday morning yoga session together.',
    category: 'date',
    allDay: false,
  },
  {
    id: 'evt_004',
    title: 'Doctor Appointment – James',
    startDate: '2026-03-10T14:00:00',
    endDate: '2026-03-10T15:00:00',
    location: 'Dr. Miller\'s Office, 5th Ave',
    description: 'Annual physical checkup.',
    category: 'appointment',
    allDay: false,
  },
  {
    id: 'evt_005',
    title: 'Movie Night – Dune Part 3',
    startDate: '2026-03-05T20:00:00',
    endDate: '2026-03-05T23:00:00',
    location: 'AMC Lincoln Square',
    description: 'Pre-booked tickets for the premiere.',
    category: 'date',
    allDay: false,
  },
  {
    id: 'evt_006',
    title: 'Sarah\'s Birthday',
    startDate: '2026-03-28T00:00:00',
    endDate: '2026-03-28T23:59:00',
    location: '',
    description: 'Plan a surprise party!',
    category: 'anniversary',
    allDay: true,
  },
  {
    id: 'evt_007',
    title: 'Grocery & Meal Prep',
    startDate: '2026-03-08T11:00:00',
    endDate: '2026-03-08T13:00:00',
    location: 'Whole Foods Market',
    description: 'Weekly grocery run and meal prep for the week.',
    category: 'other',
    allDay: false,
  },
  {
    id: 'evt_008',
    title: 'Flight to Miami',
    startDate: '2026-04-04T07:30:00',
    endDate: '2026-04-04T10:00:00',
    location: 'JFK Airport, Terminal 4',
    description: 'Spring break trip. Check-in online 24 hours before.',
    category: 'travel',
    allDay: false,
  },
  {
    id: 'evt_009',
    title: 'Dentist – Sarah',
    startDate: '2026-03-17T10:00:00',
    endDate: '2026-03-17T11:00:00',
    location: 'Bright Smile Dental, Park Ave',
    description: 'Routine cleaning appointment.',
    category: 'appointment',
    allDay: false,
  },
  {
    id: 'evt_010',
    title: 'Game Night with Friends',
    startDate: '2026-03-25T18:00:00',
    endDate: '2026-03-25T22:00:00',
    location: 'Mike & Lisa\'s Place',
    description: 'Board games and dinner. Bring Catan.',
    category: 'other',
    allDay: false,
  },
];

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  d?.setDate(d?.getDate() - d?.getDay());
  d?.setHours(0, 0, 0, 0);
  return d;
};

const CalendarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 2, 3));
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 3));
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date(2026, 2, 3)));

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'add' | 'edit'>('add');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  const isActive = (path: string): boolean => location?.pathname === path;

  const getInitials = () => {
    const name = MOCK_USER?.name || '';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

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

  const handleSaveEvent = (data: Omit<CalendarEvent, 'id'> & { id?: string }): void => {
    if (eventModalMode === 'edit' && data?.id) {
      setEvents((prev) => prev?.map((e) => (e?.id === data?.id ? { ...e, ...data } : e)));
    } else {
      setEvents((prev) => [...prev, { ...data, id: generateId() }]);
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string): void => {
    setEvents((prev) => prev?.filter((e) => e?.id !== id));
    setEventModalOpen(false);
    setDetailModalOpen(false);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: 'var(--color-card)', borderRight: '1px solid var(--color-border)', zIndex: 100 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {SIDEBAR_NAV?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-caption font-medium transition-base"
              style={{
                color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                backgroundColor: isActive(item?.path) ? 'rgba(212,118,26,0.10)' : 'transparent',
              }}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon
                name={item?.icon}
                size={18}
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                strokeWidth={isActive(item?.path) ? 2.5 : 2}
              />
              <span>{item?.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
            >
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-caption font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                {MOCK_USER?.name}
              </p>
              <p className="text-xs font-caption truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                {MOCK_USER?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-caption font-medium transition-colors hover:bg-red-50"
            style={{ color: 'var(--color-muted-foreground)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted-foreground)'; }}
          >
            <Icon name="LogOut" size={16} strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-14 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          onClick={() => navigate('/profile-page')}
          aria-label="Profile"
        >
          {getInitials()}
        </button>
      </div>
      {/* Mobile Bottom Nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}
      >
        {SIDEBAR_NAV?.map((item) => (
          <NavLink
            key={item?.path}
            to={item?.path}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            style={{ color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
            aria-current={isActive(item?.path) ? 'page' : undefined}
          >
            <Icon
              name={item?.icon}
              size={20}
              color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
              strokeWidth={isActive(item?.path) ? 2.5 : 2}
            />
            <span className="text-xs font-caption">{item?.label?.split(' ')?.pop()}</span>
          </NavLink>
        ))}
      </div>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto page-enter">
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

                {view === 'month' ? (
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

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 px-1">
                {[
                  { label: 'Date Night', color: '#FF6B35' },
                  { label: 'Appointment', color: '#3B82F6' },
                  { label: 'Travel', color: '#B8860B' },
                  { label: 'Anniversary', color: '#8B5CF6' },
                  { label: 'Other', color: '#2D5016' },
                ]?.map((item) => (
                  <div key={item?.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item?.color }} />
                    <span className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
                      {item?.label}
                    </span>
                  </div>
                ))}
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
      </main>
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
    </div>
  );
};

export default CalendarPage;