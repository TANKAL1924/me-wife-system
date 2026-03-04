import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import PartnerResumeCard from './components/PartnerResumeCard';

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

const mockUser = {
  name: 'Sarah & James',
  email: 'sarah.james@together.com',
};

const initialPartners = {
  partner1: {
    name: 'Emma Sullivan',
    role: 'UX Designer',
    bio: 'Passionate UX designer with 6+ years crafting intuitive digital experiences. Specializing in user research, interaction design, and design systems.',
    portfolioUrl: '',
    avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b0fc12a3-1772142869573.png',
    avatarAlt: 'Young woman with warm smile, brown hair, wearing casual white top in bright indoor setting',
  },
};

const PortfolioResumeSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string): boolean => location?.pathname === path;

  const getInitials = () => {
    const name = mockUser?.name || '';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>

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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-caption font-medium transition-colors"
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
            className="flex flex-col items-center gap-0.5 px-2 py-1"
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
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <Icon name="Briefcase" size={18} color="white" strokeWidth={2.5} />
              </div>
              <h1 className="font-heading text-xl md:text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Portfolio &amp; Resume Settings
              </h1>
            </div>
            <p className="font-caption text-sm ml-12" style={{ color: 'var(--color-muted-foreground)' }}>
              Manage your individual professional profiles and portfolio links.
            </p>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 gap-5 md:gap-6 max-w-xl">
            <PartnerResumeCard
              partner={initialPartners?.partner1}
              label="My Profile"
              onSave={(data) => console.log('Profile saved:', data)}
            />
          </div>

          {/* Info Banner */}
          <div
            className="mt-6 rounded-xl flex items-start gap-3 px-4 py-3"
            style={{ backgroundColor: 'rgba(212,118,26,0.08)', border: '1px solid rgba(212,118,26,0.2)' }}
          >
            <Icon name="Info" size={16} color="var(--color-primary)" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
            <p className="font-caption text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Add your portfolio website URL and save your profile. Use the <strong style={{ color: 'var(--color-foreground)' }}>Visit Portfolio</strong> button to preview your site in a new tab.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioResumeSettings;
