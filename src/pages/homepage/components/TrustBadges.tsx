import React from "react";
import Icon from "../../../components/AppIcon";

const badges = [
  {
    id: 1,
    icon: "ShieldCheck",
    label: "SSL Secured",
    description: "256-bit encryption protects all your data",
    color: "var(--color-success)",
    bg: "rgba(45, 80, 22, 0.08)",
  },
  {
    id: 2,
    icon: "Lock",
    label: "Private & Encrypted",
    description: "Only you and your partner can access this space",
    color: "var(--color-primary)",
    bg: "rgba(212, 118, 26, 0.08)",
  },
  {
    id: 3,
    icon: "EyeOff",
    label: "No Third Parties",
    description: "Your data is never shared or sold to anyone",
    color: "var(--color-secondary)",
    bg: "rgba(139, 69, 19, 0.08)",
  },
];

const TrustBadges = () => {
  return (
    <section
      className="rounded-2xl p-6 md:p-8 mb-8 md:mb-12"
      style={{
        backgroundColor: "var(--color-muted)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Icon name="BadgeCheck" size={20} color="var(--color-primary)" strokeWidth={2} />
        <h2
          className="text-lg md:text-xl font-heading font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          Your Privacy, Our Priority
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {badges?.map((badge) => (
          <div
            key={badge?.id}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: badge?.bg }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <Icon name={badge?.icon} size={20} color={badge?.color} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-caption font-semibold mb-0.5"
                style={{ color: "var(--color-foreground)" }}
              >
                {badge?.label}
              </p>
              <p
                className="text-xs font-caption"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {badge?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;