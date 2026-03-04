import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const actions = [
  {
    id: 1,
    label: "Add Event",
    description: "Schedule a new shared event",
    iconName: "CalendarPlus",
    iconColor: "var(--color-primary)",
    bgColor: "rgba(212, 118, 26, 0.12)",
    route: "/calendar",
  },
  {
    id: 2,
    label: "Upload Photo",
    description: "Add a new memory to gallery",
    iconName: "ImagePlus",
    iconColor: "#2D5016",
    bgColor: "rgba(45, 80, 22, 0.12)",
    route: "/gallery",
  },
  {
    id: 3,
    label: "View Calendar",
    description: "Check upcoming schedules",
    iconName: "CalendarHeart",
    iconColor: "#FF6B35",
    bgColor: "rgba(255, 107, 53, 0.12)",
    route: "/calendar",
  },
  {
    id: 4,
    label: "Update Profile",
    description: "Edit personal information",
    iconName: "UserCircle",
    iconColor: "#8B4513",
    bgColor: "rgba(139, 69, 19, 0.12)",
    route: "/profile-page",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ padding: "24px" }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon name="Zap" size={18} color="var(--color-primary)" strokeWidth={2.5} />
        <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
          Quick Actions
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions?.map((action) => (
          <button
            key={action?.id}
            className="flex flex-col items-start gap-2 p-3 rounded-xl border transition-base hover-lift focus-ring text-left"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
            }}
            onClick={() => navigate(action?.route)}
            aria-label={action?.label}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: action?.bgColor }}
            >
              <Icon name={action?.iconName} size={18} color={action?.iconColor} strokeWidth={2} />
            </div>
            <div>
              <p className="font-caption text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                {action?.label}
              </p>
              <p className="font-caption text-xs line-clamp-2" style={{ color: "var(--color-muted-foreground)" }}>
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;