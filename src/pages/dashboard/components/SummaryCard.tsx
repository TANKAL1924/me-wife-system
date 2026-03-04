import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import useScrollAnimation from "../../../hooks/useScrollAnimation";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  iconColor?: string;
  bgColor?: string;
  route?: string;
  actionLabel?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

// Skeleton loader for SummaryCard
const SummaryCardSkeleton = () => (
  <div className="card flex flex-col gap-4 animate-pulse" style={{ padding: "24px" }}>
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 rounded-md w-24" style={{ backgroundColor: "var(--color-muted)" }} />
        <div className="h-9 rounded-md w-16" style={{ backgroundColor: "var(--color-muted)" }} />
        <div className="h-3 rounded-md w-32" style={{ backgroundColor: "var(--color-muted)" }} />
      </div>
      <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ backgroundColor: "var(--color-muted)" }} />
    </div>
    <div className="h-7 rounded-md w-28" style={{ backgroundColor: "var(--color-muted)" }} />
  </div>
);

const SummaryCard = ({ title, value, subtitle, iconName, iconColor, bgColor, route, actionLabel, isLoading, onRefresh }: SummaryCardProps) => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  if (isLoading) return <SummaryCardSkeleton />;

  return (
    <div
      ref={ref}
      className={`card flex flex-col gap-4 cursor-pointer hover-lift transition-base scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
      style={{ padding: "24px" }}
      onClick={() => route && navigate(route)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e?.key === "Enter" && route && navigate(route)}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-caption text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            {title}
          </p>
          <p className="font-heading text-3xl md:text-4xl font-semibold" style={{ color: "var(--color-foreground)" }}>
            {value}
          </p>
          {subtitle && (
            <p className="font-caption text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bgColor || "rgba(212, 118, 26, 0.12)" }}
          >
            <Icon name={iconName} size={22} color={iconColor || "var(--color-primary)"} strokeWidth={2} />
          </div>
          {onRefresh && (
            <button
              onClick={(e) => { e?.stopPropagation(); onRefresh(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
              title="Refresh"
              aria-label={`Refresh ${title}`}
            >
              <Icon name="RefreshCw" size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      {actionLabel && (
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={14}
          onClick={(e) => { e?.stopPropagation(); if (route) navigate(route); }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export { SummaryCardSkeleton };
export default SummaryCard;