import { useState, useCallback } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import Button from "../../components/ui/Button";
import SummaryCard from "./components/SummaryCard";
import UpcomingEvents from "./components/UpcomingEvents";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

const mockUser = {
  name: "Sarah & James",
  email: "sarah.james@together.com",
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1644a99bc-1772213833652.png",
  avatarAlt: "Woman with curly brown hair smiling warmly in a casual outdoor setting",
  partnerAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bfa721d1-1772395466231.png",
  partnerAvatarAlt: "Man with short dark hair wearing casual blue shirt in outdoor setting",
  anniversaryDate: "June 12, 2019",
  yearsTogther: 6
};

const summaryCards = [
  {
    id: 1,
    title: "Upcoming Events",
    value: "8",
    subtitle: "3 this week",
    iconName: "CalendarHeart",
    iconColor: "var(--color-primary)",
    bgColor: "rgba(212, 118, 26, 0.12)",
    route: "/calendar",
    actionLabel: "View Calendar"
  },
  {
    id: 2,
    title: "Shared Memories",
    value: "48",
    subtitle: "5 added this month",
    iconName: "Images",
    iconColor: "#2D5016",
    bgColor: "rgba(45, 80, 22, 0.12)",
    route: "/gallery",
    actionLabel: "Open Gallery"
  },
  {
    id: 3,
    title: "Days Together",
    value: "2,456",
    subtitle: `Since ${mockUser?.anniversaryDate}`,
    iconName: "Heart",
    iconColor: "#FF6B35",
    bgColor: "rgba(255, 107, 53, 0.12)",
    route: "/profile-page",
    actionLabel: "View Profile"
  },
  {
    id: 4,
    title: "This Month Events",
    value: "12",
    subtitle: "4 completed",
    iconName: "CheckCircle",
    iconColor: "#8B4513",
    bgColor: "rgba(139, 69, 19, 0.12)",
    route: "/calendar",
    actionLabel: "View All"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting] = useState(() => {
    const hour = new Date()?.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  });
  const [cardsLoading, setCardsLoading] = useState(false);

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  const handleRefreshCards = useCallback(() => {
    setCardsLoading(true);
    setTimeout(() => setCardsLoading(false), 1500);
  }, []);

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
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-lg font-semibold leading-tight" style={{ color: 'var(--color-foreground)' }}>Together</span>
            <span className="font-caption text-xs font-medium leading-tight" style={{ color: 'var(--color-primary)' }}>Sarah &amp; James</span>
          </div>
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
          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold leading-tight" style={{ color: 'var(--color-foreground)' }}>Together</span>
            <span className="font-caption text-xs font-medium leading-tight" style={{ color: 'var(--color-primary)' }}>Sarah &amp; James</span>
          </div>
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
      <main className="flex-1 overflow-y-auto page-enter">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Hero Welcome Banner */}
          <div
            ref={heroRef}
            className={`card mb-6 md:mb-8 overflow-hidden relative scroll-hidden ${heroVisible ? 'scroll-visible' : ''}`}
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, #8B4513 100%)",
              padding: "28px 32px",
              border: "none"
            }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white">
                    <Image src={mockUser?.avatar} alt={mockUser?.avatarAlt} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white">
                    <Image src={mockUser?.partnerAvatar} alt={mockUser?.partnerAvatarAlt} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="font-caption text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {greeting} ✨
                  </p>
                  <h1 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                    Sarah &amp; James
                  </h1>
                  <p className="font-caption text-xs md:text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Together since {mockUser?.anniversaryDate} &middot; {mockUser?.yearsTogther} beautiful years
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <span className="w-2 h-2 rounded-full bg-green-300" />
                  <span className="font-caption text-xs text-white">Partner online</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => navigate("/profile-page")}
                  className="border-white/30 text-white hover:bg-white/10">
                  Settings
                </Button>
              </div>
            </div>
            {/* Decorative hearts */}
            <div className="absolute top-4 right-8 opacity-10 hidden lg:block">
              <Icon name="Heart" size={80} color="white" strokeWidth={1} />
            </div>
            <div className="absolute bottom-2 right-24 opacity-10 hidden lg:block">
              <Icon name="Heart" size={40} color="white" strokeWidth={1} />
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div
            ref={cardsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8 scroll-hidden ${cardsVisible ? 'scroll-visible' : ''}`}
          >
            {summaryCards?.map((card) => (
              <SummaryCard key={card?.id} {...card} isLoading={cardsLoading} onRefresh={handleRefreshCards} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div
            ref={contentRef}
            className={`grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 scroll-hidden ${contentVisible ? 'scroll-visible' : ''}`}
          >
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
              <UpcomingEvents />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Anniversary Countdown Card */}
              <div
                className="card"
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(212,118,26,0.08) 0%, rgba(255,107,53,0.08) 100%)",
                  borderColor: "rgba(212, 118, 26, 0.25)"
                }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Sparkles" size={18} color="var(--color-primary)" strokeWidth={2.5} />
                  <h2 className="font-heading text-base font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Next Anniversary
                  </h2>
                </div>
                <div className="text-center py-2">
                  <p className="font-heading text-4xl font-semibold" style={{ color: "var(--color-primary)" }}>101</p>
                  <p className="font-caption text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                    days until June 12, 2026
                  </p>
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: "72%", background: "linear-gradient(90deg, var(--color-primary), #FF6B35)" }}
                    />
                  </div>
                  <p className="font-caption text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
                    72% of the year completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;