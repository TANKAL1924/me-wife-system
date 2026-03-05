import { useState } from 'react';
import AppShell from '../../components/ui/AppShell';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
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

type PartnerKey = 'partner1' | 'partner2';

const ProfilePage = () => {
  const [data, setData] = useState<typeof INITIAL_DATA>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  return (
    <AppShell>
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
    </AppShell>
  );
};

export default ProfilePage;