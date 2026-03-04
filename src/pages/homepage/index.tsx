import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import HeroSection from "./components/HeroSection";
import FeatureCards from "./components/FeatureCards";
import RecentActivity from "./components/RecentActivity";
import TrustBadges from "./components/TrustBadges";
import FooterBar from "./components/FooterBar";

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

const mockUser = { name: "James & Emma", email: "james.emma@together.com" };

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coupleName = "James & Emma";

  const isActive = (path: string): boolean => location?.pathname === path;

  const getInitials = () => {
    const name = mockUser?.name || '';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: 'var(--color-card)', borderRight: '1px solid var(--color-border)', zIndex: 100 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {SIDEBAR_NAV?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-caption font-medium transition-base"
              style={{
                color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                backgroundColor: isActive(item?.path) ? 'rgba(212,118,26,0.10)' : 'transparent',
              }}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon
                name={item?.icon}
                size={18}
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                strokeWidth={isActive(item?.path) ? 2.5 : 2}
              />
              <span>{item?.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
            >
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-caption font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                {mockUser?.name}
              </p>
              <p className="text-xs font-caption truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                {mockUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-caption font-medium transition-colors hover:bg-red-50"
            style={{ color: 'var(--color-muted-foreground)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted-foreground)'; }}
          >
            <Icon name="LogOut" size={16} strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-14 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          onClick={() => navigate('/profile-page')}
          aria-label="Profile"
        >
          {getInitials()}
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}
      >
        {SIDEBAR_NAV?.map((item) => (
          <NavLink
            key={item?.path}
            to={item?.path}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            style={{ color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
            aria-current={isActive(item?.path) ? 'page' : undefined}
          >
            <Icon
              name={item?.icon}
              size={20}
              color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
              strokeWidth={isActive(item?.path) ? 2.5 : 2}
            />
            <span className="text-xs font-caption">{item?.label?.split(' ')?.pop()}</span>
          </NavLink>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Hero */}
          <HeroSection coupleName={coupleName} />

          {/* Feature cards */}
          <FeatureCards />

          {/* Recent activity + Trust side by side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 md:mb-12">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-6">
              {/* Couple stats card */}
              <div className="card" style={{ padding: "24px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Sparkles" size={18} color="var(--color-primary)" />
                  <h3 className="text-base font-heading font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Your Journey
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Memories saved", value: "142", icon: "Images", color: "var(--color-accent)" },
                    { label: "Events planned", value: "28", icon: "CalendarHeart", color: "var(--color-primary)" },
                    { label: "Days together", value: "1,247", icon: "Heart", color: "var(--color-secondary)" },
                  ]?.map((stat) => (
                    <div
                      key={stat?.label}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name={stat?.icon} size={15} color={stat?.color} />
                        <span className="text-sm font-caption" style={{ color: "var(--color-muted-foreground)" }}>
                          {stat?.label}
                        </span>
                      </div>
                      <span className="text-sm font-data font-semibold whitespace-nowrap" style={{ color: "var(--color-foreground)" }}>
                        {stat?.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <div
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
              >
                <Icon name="CalendarPlus" size={24} color="white" />
                <p className="text-sm font-caption font-semibold" style={{ color: "white" }}>
                  Plan your next date night
                </p>
                <p className="text-xs font-caption" style={{ color: "rgba(255,255,255,0.8)" }}>
                  Add events and reminders to your shared calendar.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/calendar")}
                  style={{
                    borderColor: "rgba(255,255,255,0.6)",
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  Open Calendar
                </Button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <TrustBadges />

          {/* Footer */}
          <FooterBar />
        </div>
      </main>
    </div>
  );
};

export default Homepage;