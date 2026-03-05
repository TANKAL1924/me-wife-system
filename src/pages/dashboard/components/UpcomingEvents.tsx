import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { fetchEvents } from "../../calendar/service/calendarService";
import type { CalendarEvent } from "../../calendar/components/UpcomingEvents";

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents().then(({ data }) => {
      const now = new Date();
      const upcoming = data
        .filter((e) => new Date(e.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 10);
      setEvents(upcoming);
      setLoading(false);
    });
  }, []);

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon name="CalendarHeart" size={18} color="var(--color-primary)" strokeWidth={2.5} />
          <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
            Upcoming Events
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
          View All
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: "var(--color-muted)" }} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Icon name="CalendarOff" size={28} color="var(--color-muted-foreground)" />
          <p className="font-caption text-sm" style={{ color: "var(--color-muted-foreground)" }}>No upcoming events</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-xl transition-base hover-lift cursor-pointer"
              style={{ backgroundColor: "var(--color-muted)" }}
              onClick={() => navigate("/calendar")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e?.key === "Enter" && navigate("/calendar")}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(212, 118, 26, 0.12)" }}
              >
                <Icon name="Calendar" size={16} color="var(--color-primary)" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-caption text-sm font-semibold line-clamp-1" style={{ color: "var(--color-foreground)" }}>
                  {event.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="Clock" size={11} color="var(--color-muted-foreground)" />
                  <span className="font-data text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {formatDateTime(event.startDate)}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon name="MapPin" size={11} color="var(--color-muted-foreground)" />
                    <span className="font-caption text-xs line-clamp-1" style={{ color: "var(--color-muted-foreground)" }}>
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
