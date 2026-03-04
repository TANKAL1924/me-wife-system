import { useRef } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface PartnerInfo {
  firstName: string;
  anniversary?: string;
  yearsTogther?: number;
  location?: string;
  daysToAnniversary?: number;
}

interface CouplePhoto {
  src: string;
  alt: string;
}

interface ProfileHeroProps {
  partner1: PartnerInfo;
  partner2: PartnerInfo;
  couplePhoto: CouplePhoto;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditToggle: () => void;
  isEditing: boolean;
}

const ProfileHero = ({ partner1, partner2, couplePhoto, onPhotoUpload, onEditToggle, isEditing }: ProfileHeroProps) => {
  const couplePhotoRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-6"
      style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 w-32 h-32 rounded-full border-2 border-white" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border-2 border-white" />
      </div>
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
          {/* Couple Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-warm-lg">
              <Image
                src={couplePhoto?.src}
                alt={couplePhoto?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => couplePhotoRef?.current?.click()}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-warm-md transition-base hover-lift"
              style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-primary)' }}
              aria-label="Upload couple photo"
            >
              <Icon name="Camera" size={16} />
            </button>
            <input ref={couplePhotoRef} type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} />
          </div>

          {/* Couple Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <Icon name="Heart" size={18} color="white" strokeWidth={2.5} />
              <span className="text-white text-sm font-caption opacity-90">Together since</span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-1">
              {partner1?.firstName} &amp; {partner2?.firstName}
            </h1>
            <p className="text-white opacity-80 font-caption text-sm mb-4">
              Married on {partner1?.anniversary} · {partner1?.yearsTogther} years together
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-caption"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <Icon name="MapPin" size={12} color="white" />
                {partner1?.location}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-caption"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <Icon name="Calendar" size={12} color="white" />
                Next anniversary in {partner1?.daysToAnniversary} days
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex-shrink-0">
            <Button
              variant={isEditing ? 'secondary' : 'outline'}
              size="sm"
              iconName={isEditing ? 'X' : 'Edit2'}
              iconPosition="left"
              onClick={onEditToggle}
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;