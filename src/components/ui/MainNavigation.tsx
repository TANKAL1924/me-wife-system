import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  tooltip: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Our Home',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    tooltip: 'View your shared life overview',
  },
  {
    label: 'Our Calendar',
    path: '/calendar',
    icon: 'CalendarHeart',
    tooltip: 'View and manage shared events',
  },
  {
    label: 'Our Gallery',
    path: '/gallery',
    icon: 'Images',
    tooltip: 'Browse your shared memories',
  },
  {
    label: 'Profile',
    path: '/profile-page',
    icon: 'UserCircle',
    tooltip: 'Manage your account and relationship settings',
  },
];

interface User {
  name?: string;
  email?: string;
}

interface MainNavigationProps {
  user?: User | null;
  onNavigate?: (path: string) => void;
}

const MainNavigation = ({ user = null, onNavigate }: MainNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const publicPaths = ['/homepage', '/login'];
  const isPublicPage = publicPaths?.includes(location?.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  if (isPublicPage) return null;

  const handleNavClick = (path: string) => {
    if (onNavigate) onNavigate(path);
    setMobileMenuOpen(false);
  };

  const getInitials = () => {
    if (!user?.name) return 'US';
    return user?.name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

  const isActive = (path: string) => location?.pathname === path;

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav
        className="main-nav"
        style={{ boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="main-nav-inner">
          {/* Logo */}
          <NavLink
            to="/dashboard"
            className="nav-logo-area focus-ring"
            aria-label="Go to dashboard"
            onClick={() => handleNavClick('/dashboard')}
          >
            <div className="nav-logo-icon">
              <Icon name="Heart" size={18} color="white" strokeWidth={2.5} />
            </div>
            <span className="nav-logo-text hidden sm:block">Together</span>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="nav-links hidden md:flex" role="menubar">
            {NAV_ITEMS?.map((item) => (
              <NavLink
                key={item?.path}
                to={item?.path}
                className={`nav-link focus-ring ${isActive(item?.path) ? 'active' : ''}`}
                role="menuitem"
                title={item?.tooltip}
                aria-current={isActive(item?.path) ? 'page' : undefined}
                onClick={() => handleNavClick(item?.path)}
              >
                <Icon
                  name={item?.icon}
                  size={17}
                  color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                  strokeWidth={isActive(item?.path) ? 2.5 : 2}
                />
                <span>{item?.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="nav-right">
            {/* Partner online indicator */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-caption"
              style={{
                backgroundColor: 'rgba(45, 80, 22, 0.10)',
                color: 'var(--color-success)',
              }}
              title="Your partner is online"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-success)' }}
              />
              <span className="hidden lg:inline">Partner online</span>
            </div>

            {/* Avatar */}
            <button
              className="nav-avatar focus-ring"
              onClick={() => navigate('/profile-page')}
              aria-label="Go to profile"
              title="View profile"
            >
              {getInitials()}
            </button>

            {/* Mobile menu toggle - visible only on small screens */}
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-md focus-ring transition-base hover-lift"
              style={{ color: 'var(--color-muted-foreground)' }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name="Menu" size={22} />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-tab-bar md:hidden" role="navigation" aria-label="Mobile navigation">
        <div className="mobile-tab-bar-inner">
          {NAV_ITEMS?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className={`mobile-tab-item focus-ring ${isActive(item?.path) ? 'active' : ''}`}
              aria-current={isActive(item?.path) ? 'page' : undefined}
              onClick={() => handleNavClick(item?.path)}
            >
              <div className="mobile-tab-icon">
                <Icon
                  name={item?.icon}
                  size={20}
                  color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                  strokeWidth={isActive(item?.path) ? 2.5 : 2}
                />
              </div>
              <span className="mobile-tab-label">{item?.label?.split(' ')?.pop()}</span>
            </NavLink>
          ))}

          {/* More button for mobile menu */}
          <button
            className="mobile-tab-item focus-ring"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="More options"
            aria-expanded={mobileMenuOpen}
          >
            <div className="mobile-tab-icon">
              <Icon name="MoreHorizontal" size={20} />
            </div>
            <span className="mobile-tab-label">More</span>
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      {/* Mobile Menu Panel */}
      <div
        className={`mobile-menu-panel ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal={true}
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-handle" />

        <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold font-caption"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {getInitials()}
          </div>
          <div>
            <p className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>
              {user?.name || 'Welcome back'}
            </p>
            <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              {user?.email || 'Manage your account'}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mb-6">
          {NAV_ITEMS?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-caption text-sm font-medium transition-base focus-ring ${
                isActive(item?.path) ? 'active' : ''
              }`}
              style={{
                color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                backgroundColor: isActive(item?.path) ? 'rgba(212, 118, 26, 0.10)' : 'transparent',
              }}
              aria-current={isActive(item?.path) ? 'page' : undefined}
              onClick={() => handleNavClick(item?.path)}
            >
              <Icon
                name={item?.icon}
                size={20}
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                strokeWidth={isActive(item?.path) ? 2.5 : 2}
              />
              <span>{item?.label}</span>
              {isActive(item?.path) && (
                <Icon name="ChevronRight" size={14} color="var(--color-primary)" className="ml-auto" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-md font-caption text-sm font-medium transition-base focus-ring w-full text-left hover-lift"
            style={{ color: 'var(--color-muted-foreground)' }}
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/profile-page');
            }}
          >
            <Icon name="Settings" size={18} />
            <span>Settings</span>
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-md font-caption text-sm font-medium transition-base focus-ring w-full text-left"
            style={{ color: 'var(--color-error)' }}
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
          >
            <Icon name="LogOut" size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
