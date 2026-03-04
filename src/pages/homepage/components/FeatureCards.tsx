import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const features = [
  {
    id: 1,
    label: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    description: "Overview of your shared life, quick stats, and activity summaries at a glance.",
    color: "var(--color-primary)",
    bg: "rgba(212, 118, 26, 0.10)",
  },
  {
    id: 2,
    label: "Our Calendar",
    icon: "CalendarHeart",
    path: "/calendar",
    description: "Plan dates, anniversaries, and shared events on your synchronized calendar.",
    color: "var(--color-secondary)",
    bg: "rgba(139, 69, 19, 0.10)",
  },
  {
    id: 3,
    label: "Our Gallery",
    icon: "Images",
    path: "/gallery",
    description: "Store and revisit your favorite photos and cherished memories together.",
    color: "var(--color-accent)",
    bg: "rgba(255, 107, 53, 0.10)",
  },
  {
    id: 4,
    label: "Profile",
    icon: "UserCircle",
    path: "/profile-page",
    description: "Manage personal information, preferences, and account settings.",
    color: "var(--color-success)",
    bg: "rgba(45, 80, 22, 0.10)",
  },
];

const FeatureCards = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-8 md:mb-12">
      <h2
        className="text-xl md:text-2xl font-heading font-semibold mb-2"
        style={{ color: "var(--color-foreground)" }}
      >
        Quick Access
      </h2>
      <p
        className="text-sm md:text-base mb-6 font-caption"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        Jump right into any section of your shared space.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {features?.map((feat) => (
          <button
            key={feat?.id}
            onClick={() => navigate(feat?.path)}
            className="card text-left group cursor-pointer hover-lift transition-base focus-ring w-full min-w-0"
            style={{ padding: "24px" }}
            aria-label={`Navigate to ${feat?.label}`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-base"
              style={{ backgroundColor: feat?.bg }}
            >
              <Icon name={feat?.icon} size={24} color={feat?.color} strokeWidth={2} />
            </div>
            <h3
              className="text-base font-heading font-semibold mb-1"
              style={{ color: "var(--color-foreground)" }}
            >
              {feat?.label}
            </h3>
            <p
              className="text-sm font-caption line-clamp-2"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {feat?.description}
            </p>
            <div
              className="flex items-center gap-1 mt-3 text-xs font-caption font-medium transition-base"
              style={{ color: feat?.color }}
            >
              <span>Open</span>
              <Icon name="ArrowRight" size={13} color={feat?.color} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;