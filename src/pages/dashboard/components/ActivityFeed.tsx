import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

interface Activity {
  id: number;
  type: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  timestamp: string;
  avatar: string;
  avatarAlt: string;
  user: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "calendar",
    iconName: "CalendarCheck",
    iconColor: "var(--color-primary)",
    iconBg: "rgba(212, 118, 26, 0.12)",
    title: "Anniversary Dinner added",
    description: "Booked at La Maison restaurant for March 15",
    timestamp: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1621864134272-7ed5f6e2ae26",
    avatarAlt: "Woman with curly brown hair smiling warmly in casual setting",
    user: "Sarah"
  },
  {
    id: 2,
    type: "gallery",
    iconName: "Image",
    iconColor: "#2D5016",
    iconBg: "rgba(45, 80, 22, 0.12)",
    title: "3 photos uploaded",
    description: "Weekend hiking trip at Blue Ridge Mountains",
    timestamp: "5 hours ago",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9d82898-1763295192035.png",
    avatarAlt: "Man with short dark hair wearing casual blue shirt outdoors",
    user: "James"
  },
  {
    id: 3,
    type: "calendar",
    iconName: "CalendarPlus",
    iconColor: "#FF6B35",
    iconBg: "rgba(255, 107, 53, 0.12)",
    title: "Doctor\'s appointment scheduled",
    description: "Annual checkup on March 20 at 10:00 AM",
    timestamp: "Yesterday",
    avatar: "https://images.unsplash.com/photo-1621864134272-7ed5f6e2ae26",
    avatarAlt: "Woman with curly brown hair smiling warmly in casual setting",
    user: "Sarah"
  },
  {
    id: 4,
    type: "profile",
    iconName: "UserCheck",
    iconColor: "#8B4513",
    iconBg: "rgba(139, 69, 19, 0.12)",
    title: "Profile updated",
    description: "Updated emergency contact information",
    timestamp: "2 days ago",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9d82898-1763295192035.png",
    avatarAlt: "Man with short dark hair wearing casual blue shirt outdoors",
    user: "James"
  },
  {
    id: 5,
    type: "gallery",
    iconName: "Image",
    iconColor: "#2D5016",
    iconBg: "rgba(45, 80, 22, 0.12)",
    title: "New album created",
    description: "Valentine\'s Day 2026 memories collection",
    timestamp: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1621864134272-7ed5f6e2ae26",
    avatarAlt: "Woman with curly brown hair smiling warmly in casual setting",
    user: "Sarah"
  }
];

// Skeleton row for activity feed
const ActivitySkeleton = () => (
  <div className="flex flex-col gap-0 animate-pulse">
    {[1, 2, 3, 4]?.map((i) => (
      <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < 4 ? "1px solid var(--color-border)" : "none" }}>
        <div className="w-9 h-9 rounded-lg flex-shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-muted)" }} />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="h-3.5 rounded-md w-40" style={{ backgroundColor: "var(--color-muted)" }} />
            <div className="h-3 rounded-md w-16 flex-shrink-0" style={{ backgroundColor: "var(--color-muted)" }} />
          </div>
          <div className="h-3 rounded-md w-56" style={{ backgroundColor: "var(--color-muted)" }} />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--color-muted)" }} />
            <div className="h-3 rounded-md w-16" style={{ backgroundColor: "var(--color-muted)" }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ActivityFeedProps {
  isLoading: boolean;
  onRefresh: () => void;
}

const ActivityFeed = ({ isLoading, onRefresh }: ActivityFeedProps) => {
  return (
    <div className="card" style={{ padding: "24px" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon name="Activity" size={18} color="var(--color-primary)" strokeWidth={2.5} />
          <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--color-foreground)" }}>
            Recent Activity
          </h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--color-muted)",
            color: "var(--color-muted-foreground)",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
          aria-label="Refresh activity feed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Refreshing…
            </>
          ) : (
            <>
              <Icon name="RefreshCw" size={13} strokeWidth={2} />
              Refresh
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <ActivitySkeleton />
      ) : (
        <div className="flex flex-col gap-0">
          {activities?.map((activity, index) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 py-3"
              style={{
                borderBottom: index < activities?.length - 1 ? "1px solid var(--color-border)" : "none"
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: activity?.iconBg }}
              >
                <Icon name={activity?.iconName} size={16} color={activity?.iconColor} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-caption text-sm font-semibold line-clamp-1" style={{ color: "var(--color-foreground)" }}>
                    {activity?.title}
                  </p>
                  <span className="font-data text-xs whitespace-nowrap flex-shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
                    {activity?.timestamp}
                  </span>
                </div>
                <p className="font-caption text-xs line-clamp-1 mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                  {activity?.description}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={activity?.avatar} alt={activity?.avatarAlt} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-caption text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    by {activity?.user}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;