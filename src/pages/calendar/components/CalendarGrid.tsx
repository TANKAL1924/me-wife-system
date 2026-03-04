import { type CalendarEvent, type EventCategory } from './UpcomingEvents';

const EVENT_COLORS: Record<EventCategory, string> = {
  date: 'bg-pink-100 text-pink-700 border-pink-200',
  appointment: 'bg-blue-100 text-blue-700 border-blue-200',
  travel: 'bg-amber-100 text-amber-700 border-amber-200',
  anniversary: 'bg-purple-100 text-purple-700 border-purple-200',
  other: 'bg-green-100 text-green-700 border-green-200',
};

const EVENT_DOT_COLORS: Record<EventCategory, string> = {
  date: 'bg-pink-500',
  appointment: 'bg-blue-500',
  travel: 'bg-amber-500',
  anniversary: 'bg-purple-500',
  other: 'bg-green-500',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarGrid = ({ currentDate, events, selectedDate, onDateSelect, onEventClick }: CalendarGridProps) => {
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();

  const firstDay = new Date(year, month, 1)?.getDay();
  const daysInMonth = new Date(year, month + 1, 0)?.getDate();
  const daysInPrevMonth = new Date(year, month, 0)?.getDate();

  const today = new Date();
  const isToday = (day: number): boolean =>
    day === today?.getDate() && month === today?.getMonth() && year === today?.getFullYear();

  const isSelected = (day: number): boolean =>
    !!selectedDate &&
    day === selectedDate?.getDate() &&
    month === selectedDate?.getMonth() &&
    year === selectedDate?.getFullYear();

  const getEventsForDay = (day: number): CalendarEvent[] => {
    return events?.filter((e) => {
      let d = new Date(e.startDate);
      return d?.getDate() === day && d?.getMonth() === month && d?.getFullYear() === year;
    });
  };

  const cells = [];
  // Prev month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells?.push({ day: daysInPrevMonth - i, current: false, type: 'prev' });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells?.push({ day: d, current: true, type: 'current' });
  }
  // Next month leading days
  const remaining = 42 - cells?.length;
  for (let d = 1; d <= remaining; d++) {
    cells?.push({ day: d, current: false, type: 'next' });
  }

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK?.map((d) => (
          <div
            key={d}
            className="text-center py-2 text-xs font-caption font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <span className="hidden sm:inline">{d}</span>
            <span className="sm:hidden">{d?.[0]}</span>
          </div>
        ))}
      </div>
      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
        {cells?.map((cell, idx) => {
          const dayEvents = cell?.current ? getEventsForDay(cell?.day) : [];
          const selected = cell?.current && isSelected(cell?.day);
          const todayCell = cell?.current && isToday(cell?.day);

          return (
            <div
              key={idx}
              onClick={() => cell?.current && onDateSelect(new Date(year, month, cell.day))}
              className={`min-h-[72px] md:min-h-[96px] p-1 md:p-2 cursor-pointer transition-base ${
                cell?.current ? 'hover:bg-orange-50' : ''
              }`}
              style={{
                backgroundColor: selected
                  ? 'rgba(212,118,26,0.08)'
                  : 'var(--color-card)',
                opacity: cell?.current ? 1 : 0.4,
              }}
            >
              {/* Day number */}
              <div className="flex items-center justify-center mb-1">
                <span
                  className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-caption font-medium transition-base ${
                    todayCell
                      ? 'text-white'
                      : selected
                      ? 'font-bold' :''
                  }`}
                  style={{
                    backgroundColor: todayCell ? 'var(--color-primary)' : 'transparent',
                    color: todayCell
                      ? 'white'
                      : selected
                      ? 'var(--color-primary)'
                      : cell?.current
                      ? 'var(--color-foreground)'
                      : 'var(--color-muted-foreground)',
                  }}
                >
                  {cell?.day}
                </span>
              </div>
              {/* Events */}
              <div className="flex flex-col gap-0.5">
                {dayEvents?.slice(0, 2)?.map((ev) => (
                  <button
                    key={ev?.id}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onEventClick(ev);
                    }}
                    className={`w-full text-left text-xs px-1 py-0.5 rounded border truncate font-caption transition-base hover:opacity-80 ${
                      EVENT_COLORS?.[ev?.category] || EVENT_COLORS?.other
                    }`}
                  >
                    <span className="hidden md:inline">{ev?.title}</span>
                    <span className="md:hidden">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          EVENT_DOT_COLORS?.[ev?.category] || EVENT_DOT_COLORS?.other
                        }`}
                      />
                    </span>
                  </button>
                ))}
                {dayEvents?.length > 2 && (
                  <span
                    className="text-xs font-caption px-1"
                    style={{ color: 'var(--color-muted-foreground)' }}
                  >
                    +{dayEvents?.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { EVENT_COLORS, EVENT_DOT_COLORS };
export default CalendarGrid;