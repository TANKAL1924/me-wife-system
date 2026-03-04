import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const widgets = [
  {
    id: 1,
    label: "Our Calendar",
    description: "3 events this week",
    iconName: "CalendarHeart",
    iconColor: "var(--color-primary)",
    bgColor: "rgba(212, 118, 26, 0.10)",
    borderColor: "rgba(212, 118, 26, 0.20)",
    badge: "3",
    route: "/calendar",
  },
  {
    id: 2,
    label: "Our Gallery",
    description: "48 shared memories",
    iconName: "Images",
    iconColor: "#2D5016",
    bgColor: "rgba(45, 80, 22, 0.10)",
    borderColor: "rgba(45, 80, 22, 0.20)",
    badge: null,
    route: "/gallery",
  },
  {
    id: 3,
    label: "Our Profile",
    description: "View & edit details",
    iconName: "UserCircle",
    iconColor: "#8B4513",
    bgColor: "rgba(139, 69, 19, 0.10)",
    borderColor: "rgba(139, 69, 19, 0.20)",
    badge: "1",
    route: "/profile-page",
  },
];

const NavigationWidgets = () => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon name="LayoutGrid" size={18} color="var(--color-primary)" strokeWidth={2.5} />
        <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
          Navigate To
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {widgets?.map((widget) => (
          <button
            key={widget?.id}
            className="flex items-center gap-3 p-3 rounded-xl border transition-base hover-lift focus-ring text-left w-full"
            style={{
              backgroundColor: widget?.bgColor,
              borderColor: widget?.borderColor,
            }}
            onClick={() => navigate(widget?.route)}
            aria-label={`Navigate to ${widget?.label}`}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <Icon name={widget?.iconName} size={20} color={widget?.iconColor} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-caption text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                {widget?.label}
              </p>
              <p className="font-caption text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                {widget?.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {widget?.badge && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center font-data text-xs font-semibold"
                  style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
                >
                  {widget?.badge}
                </span>
              )}
              <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationWidgets;