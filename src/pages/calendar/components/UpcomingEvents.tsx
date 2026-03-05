import Icon from '../../../components/AppIcon';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
}

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: () => void;
}

const UpcomingEvents = ({ events, onEventClick }: UpcomingEventsProps) => {
  const now = new Date();
  const upcoming = events?.filter((e) => new Date(e.startDate) >= now)?.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())?.slice(0, 8);

  return (
    <div
      className="rounded-xl border h-full flex flex-col"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h3 className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Upcoming Events
        </h3>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)]">
        {upcoming?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Icon name="CalendarOff" size={32} color="var(--color-muted-foreground)" />
            <p className="text-sm font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              No upcoming events
            </p>
          </div>
        ) : (
          upcoming?.map((ev) => (
            <button
              key={ev?.id}
              onClick={() => onEventClick(ev)}
              className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-base group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-caption font-semibold truncate group-hover:text-primary-color transition-base"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {ev?.title}
                  </p>
                  <p className="text-xs font-caption mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {formatDateTime(ev?.startDate)}
                  </p>
                  {ev?.location && (
                    <p className="text-xs font-caption flex items-center gap-1 mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                      <Icon name="MapPin" size={10} />
                      <span className="truncate">{ev?.location}</span>
                    </p>
                  )}
                </div>
                <Icon name="ChevronRight" size={14} color="var(--color-muted-foreground)" className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-base" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;