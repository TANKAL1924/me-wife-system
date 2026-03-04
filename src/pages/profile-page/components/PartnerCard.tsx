import { useRef } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

interface Partner {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  occupation?: string;
  avatar?: string;
  avatarAlt?: string;
}

interface PartnerCardProps {
  partner: Partner;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}


const PartnerCard = ({ partner, isEditing, onChange, onPhotoChange, label }: PartnerCardProps) => {
  const photoRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e?.target?.value);
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2"
            style={{ borderColor: 'var(--color-border)' }}>
            <Image src={partner?.avatar ?? ''} alt={partner?.avatarAlt ?? ''} className="w-full h-full object-cover" />
          </div>
          {isEditing && (
            <button
              onClick={() => photoRef?.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-warm-sm transition-base"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              aria-label={`Change ${label} photo`}
            >
              <Icon name="Camera" size={12} />
            </button>
          )}
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
        </div>
        <div>
          <span className="text-xs font-caption px-2 py-0.5 rounded-full mb-1 inline-block"
            style={{ backgroundColor: 'rgba(212,118,26,0.12)', color: 'var(--color-primary)' }}>
            {label}
          </span>
          <h3 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {partner?.firstName} {partner?.lastName}
          </h3>
          <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>{partner?.email}</p>
        </div>
      </div>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="First Name" type="text" value={partner?.firstName} onChange={handleFieldChange('firstName')} placeholder="First name" />
          <Input label="Last Name" type="text" value={partner?.lastName} onChange={handleFieldChange('lastName')} placeholder="Last name" />
          <Input label="Email" type="email" value={partner?.email} onChange={handleFieldChange('email')} placeholder="Email address" />
          <Input label="Phone" type="tel" value={partner?.phone} onChange={handleFieldChange('phone')} placeholder="Phone number" />
          <Input label="Date of Birth" type="date" value={partner?.dob} onChange={handleFieldChange('dob')} />
          <Input label="Occupation" type="text" value={partner?.occupation} onChange={handleFieldChange('occupation')} placeholder="Your occupation" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'Mail', label: 'Email', value: partner?.email },
            { icon: 'Phone', label: 'Phone', value: partner?.phone },
            { icon: 'Cake', label: 'Birthday', value: partner?.dob },
            { icon: 'Briefcase', label: 'Occupation', value: partner?.occupation },
          ]?.map(({ icon, label: fieldLabel, value }) => (
            <div key={fieldLabel} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-muted)' }}>
              <Icon name={icon} size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>{fieldLabel}</p>
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerCard;