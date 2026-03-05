import { type CalendarEvent } from './UpcomingEvents';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WeekView = ({ weekStart, events, selectedDate, onDateSelect, onEventClick }: WeekViewProps) => {
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d?.setDate(weekStart?.getDate() + i);
    return d;
  });

  const getEventsForDay = (date: Date): CalendarEvent[] =>
    events?.filter((e) => {
      const d = new Date(e.startDate);
      return (d?.getDate() === date?.getDate() &&
      d?.getMonth() === date?.getMonth() && d?.getFullYear() === date?.getFullYear());
    });

  const isToday = (date: Date): boolean =>
    date?.getDate() === today?.getDate() &&
    date?.getMonth() === today?.getMonth() &&
    date?.getFullYear() === today?.getFullYear();

  const isSelected = (date: Date): boolean =>
    !!selectedDate &&
    date?.getDate() === selectedDate?.getDate() &&
    date?.getMonth() === selectedDate?.getMonth() &&
    date?.getFullYear() === selectedDate?.getFullYear();

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: 'var(--color-border)' }}>
        {days?.map((date, idx) => {
          const dayEvents = getEventsForDay(date);
          const todayCell = isToday(date);
          const selected = isSelected(date);

          return (
            <div
              key={idx}
              onClick={() => onDateSelect(date)}
              className="min-h-[120px] md:min-h-[160px] p-2 cursor-pointer transition-base hover:bg-orange-50"
              style={{
                backgroundColor: selected ? 'rgba(212,118,26,0.08)' : 'var(--color-card)',
              }}
            >
              {/* Header */}
              <div className="flex flex-col items-center mb-2">
                <span
                  className="text-xs font-caption uppercase tracking-wide mb-1"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {DAYS?.[date?.getDay()]}
                </span>
                <span
                  className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-caption font-semibold"
                  style={{
                    backgroundColor: todayCell ? 'var(--color-primary)' : 'transparent',
                    color: todayCell ? 'white' : selected ? 'var(--color-primary)' : 'var(--color-foreground)',
                  }}
                >
                  {date?.getDate()}
                </span>
              </div>
              {/* Events */}
              <div className="flex flex-col gap-1">
                {dayEvents?.map((ev) => (
                  <button
                    key={ev?.id}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onEventClick(ev);
                    }}
                    className={`w-full text-left text-xs px-1.5 py-1 rounded border truncate font-caption transition-base hover:opacity-80 bg-orange-50 text-orange-700 border-orange-200`}
                  >
                    <span className="hidden sm:inline">{ev?.title}</span>
                    <span className="sm:hidden truncate">{ev?.title?.slice(0, 6)}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;