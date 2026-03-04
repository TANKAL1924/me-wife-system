import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const events = [
  {
    id: 1,
    title: "Anniversary Dinner",
    date: "Mar 15, 2026",
    time: "07:30 PM",
    location: "La Maison Restaurant",
    category: "Special",
    categoryColor: "#FF6B35",
    categoryBg: "rgba(255, 107, 53, 0.12)",
  },
  {
    id: 2,
    title: "Doctor\'s Appointment",
    date: "Mar 20, 2026",
    time: "10:00 AM",
    location: "City Medical Center",
    category: "Health",
    categoryColor: "#2D5016",
    categoryBg: "rgba(45, 80, 22, 0.12)",
  },
  {
    id: 3,
    title: "Weekend Getaway",
    date: "Mar 28, 2026",
    time: "09:00 AM",
    location: "Blue Ridge Mountains",
    category: "Travel",
    categoryColor: "var(--color-primary)",
    categoryBg: "rgba(212, 118, 26, 0.12)",
  },
];

const UpcomingEvents = () => {
  const navigate = useNavigate();

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
      <div className="flex flex-col gap-3">
        {events?.map((event) => (
          <div
            key={event?.id}
            className="flex items-start gap-3 p-3 rounded-xl transition-base hover-lift cursor-pointer"
            style={{ backgroundColor: "var(--color-muted)" }}
            onClick={() => navigate("/calendar")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e?.key === "Enter" && navigate("/calendar")}
          >
            <div
              className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
              style={{ backgroundColor: event?.categoryBg }}
            >
              <Icon name="Calendar" size={16} color={event?.categoryColor} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-caption text-sm font-semibold line-clamp-1" style={{ color: "var(--color-foreground)" }}>
                  {event?.title}
                </p>
                <span
                  className="font-caption text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event?.categoryBg, color: event?.categoryColor }}
                >
                  {event?.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={11} color="var(--color-muted-foreground)" />
                  <span className="font-data text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {event?.date} · {event?.time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Icon name="MapPin" size={11} color="var(--color-muted-foreground)" />
                <span className="font-caption text-xs line-clamp-1" style={{ color: "var(--color-muted-foreground)" }}>
                  {event?.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;