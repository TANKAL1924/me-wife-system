import { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHero from './components/ProfileHero';
import PartnerCard from './components/PartnerCard';

const INITIAL_DATA = {
  partner1: {
    firstName: "Emma",
    lastName: "Sullivan",
    email: "emma.sullivan@email.com",
    phone: "(415) 555-0182",
    dob: "1992-06-14",
    occupation: "UX Designer",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b0fc12a3-1772142869573.png",
    avatarAlt: "Young woman with warm smile, brown hair, wearing casual white top in bright indoor setting",
    anniversary: "06/12/2018",
    yearsTogther: 7,
    daysToAnniversary: 101,
    location: "San Francisco, CA"
  },
  partner2: {
    firstName: "James",
    lastName: "Sullivan",
    email: "james.sullivan@email.com",
    phone: "(415) 555-0247",
    dob: "1990-03-22",
    occupation: "Software Engineer",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf18c72d-1763296478319.png",
    avatarAlt: "Young man with friendly smile, dark hair, wearing navy blue shirt in professional setting"
  },
  couplePhoto: {
    src: "https://images.unsplash.com/photo-1560357078-4aec529ca338",
    alt: "Happy couple smiling together outdoors during golden hour, woman in floral dress and man in casual shirt"
  }
};

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

type PartnerKey = 'partner1' | 'partner2';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<typeof INITIAL_DATA>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentUser = {
    name: `${data?.partner1?.firstName} ${data?.partner1?.lastName}`,
    email: data?.partner1?.email
  };

  const getInitials = () => {
    if (!currentUser?.name) return 'US';
    return currentUser?.name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

  const handlePartnerChange = (partnerKey: PartnerKey) => (field: string, value: string) => {
    setData((prev) => ({ ...prev, [partnerKey]: { ...prev?.[partnerKey], [field]: value } }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const isActive = (path: string) => location?.pathname === path;

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
                {currentUser?.name}
              </p>
              <p className="text-xs font-caption truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                {currentUser?.email}
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
      <main className="flex-1 overflow-y-auto page-enter">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          {/* Save Success Toast */}
          {saveSuccess &&
            <div
              className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-warm-lg"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              role="alert"
            >
              <Icon name="CheckCircle" size={18} color="var(--color-success)" />
              <span className="text-sm font-caption" style={{ color: 'var(--color-foreground)' }}>
                Profile saved successfully!
              </span>
            </div>
          }

          {/* Hero */}
          <ProfileHero
            partner1={data?.partner1}
            partner2={data?.partner2}
            couplePhoto={data?.couplePhoto}
            onPhotoUpload={() => {}}
            onEditToggle={handleEditToggle}
            isEditing={isEditing}
          />

          {/* Profile Content */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PartnerCard
                partner={data?.partner1}
                isEditing={isEditing}
                onChange={handlePartnerChange('partner1')}
                onPhotoChange={() => {}}
                label="Partner 1"
              />
              <PartnerCard
                partner={data?.partner2}
                isEditing={isEditing}
                onChange={handlePartnerChange('partner2')}
                onPhotoChange={() => {}}
                label="Partner 2"
              />
            </div>
            {isEditing &&
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="default" iconName="Save" iconPosition="left" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            }
          </div>

          {/* Footer */}
          <footer className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              &copy; {new Date()?.getFullYear()} Together &mdash; Your private couple space. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;