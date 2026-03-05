import AppShell from '../../components/ui/AppShell';
import Icon from '../../components/AppIcon';
import PartnerResumeCard from './components/PartnerResumeCard';

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
  return (
    <AppShell>
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
    </AppShell>
  );
};

export default PortfolioResumeSettings;
