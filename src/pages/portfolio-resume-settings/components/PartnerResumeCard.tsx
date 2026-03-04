import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ProfilePhotoUpload from './ProfilePhotoUpload';

interface Partner {
  name?: string;
  role?: string;
  bio?: string;
  portfolioUrl?: string;
  avatar?: string | null;
  avatarAlt?: string;
}

interface PartnerForm {
  name: string;
  role: string;
  bio: string;
  portfolioUrl: string;
}

interface PartnerErrors {
  name?: string;
  role?: string;
  portfolioUrl?: string;
}

interface PartnerResumeCardProps {
  partner: Partner;
  label: string;
  onSave?: (data: PartnerForm & { avatar: string | null }) => void;
}

const MAX_BIO_LENGTH = 300;

const PartnerResumeCard = ({ partner, label, onSave }: PartnerResumeCardProps) => {
  const [form, setForm] = useState<PartnerForm>({
    name: partner?.name || '',
    role: partner?.role || '',
    bio: partner?.bio || '',
    portfolioUrl: partner?.portfolioUrl || '',
  });
  const [errors, setErrors] = useState<PartnerErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(partner?.avatar || null);
  const profilePhotoAlt = partner?.avatarAlt || '';

  const validate = (): PartnerErrors => {
    const newErrors: PartnerErrors = {};
    if (!form?.name?.trim()) newErrors.name = 'Name is required';
    if (!form?.role?.trim()) newErrors.role = 'Role/Title is required';
    if (form?.portfolioUrl && !/^https?:\/\/.+\..+/?.test(form?.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL (e.g. https://yoursite.com)';
    }
    return newErrors;
  };

  const handleChange = (field: keyof PartnerForm, value: string) => {
    if (field === 'bio' && value?.length > MAX_BIO_LENGTH) return;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors?.[field as keyof PartnerErrors]) setErrors(prev => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSave?.({ ...form, avatar: profilePhoto });
      setTimeout(() => setSaved(false), 3000);
    }, 900);
  };

  const handleVisitPortfolio = () => {
    if (form?.portfolioUrl) {
      window.open(form?.portfolioUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="rounded-2xl flex flex-col gap-5"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        padding: '28px 24px',
      }}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2"
          style={{ borderColor: 'var(--color-primary)' }}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={profilePhotoAlt || `${label} profile photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <Icon name="User" size={22} color="var(--color-muted-foreground)" strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div>
          <span
            className="text-xs font-caption font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(212,118,26,0.12)', color: 'var(--color-primary)' }}
          >
            {label}
          </span>
          <p className="font-heading text-base font-semibold mt-0.5" style={{ color: 'var(--color-foreground)' }}>
            {form?.name || 'Your Name'}
          </p>
        </div>
      </div>

      {/* Profile Photo Upload */}
      <ProfilePhotoUpload
        currentPhoto={profilePhoto}
        currentPhotoAlt={profilePhotoAlt}
        onPhotoChange={(dataUrl) => {
          setProfilePhoto(dataUrl);
          setSaved(false);
        }}
      />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-caption font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
            Full Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={form?.name}
            onChange={e => handleChange('name', e?.target?.value)}
            placeholder="e.g. Emma Sullivan"
            className="w-full rounded-lg px-4 py-3.5 text-base font-caption outline-none transition-colors"
            style={{
              backgroundColor: 'var(--color-background)',
              border: `1px solid ${errors?.name ? '#ef4444' : 'var(--color-border)'}`,
              color: 'var(--color-foreground)',
              minHeight: 48,
            }}
          />
          {errors?.name && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors?.name}</p>
          )}
        </div>

        {/* Role / Title */}
        <div>
          <label className="block text-xs font-caption font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
            Role / Title <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={form?.role}
            onChange={e => handleChange('role', e?.target?.value)}
            placeholder="e.g. UX Designer"
            className="w-full rounded-lg px-4 py-3.5 text-base font-caption outline-none transition-colors"
            style={{
              backgroundColor: 'var(--color-background)',
              border: `1px solid ${errors?.role ? '#ef4444' : 'var(--color-border)'}`,
              color: 'var(--color-foreground)',
              minHeight: 48,
            }}
          />
          {errors?.role && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors?.role}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-caption font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
              Professional Bio
            </label>
            <span
              className="text-xs font-caption"
              style={{ color: form?.bio?.length >= MAX_BIO_LENGTH ? '#ef4444' : 'var(--color-muted-foreground)' }}
            >
              {form?.bio?.length}/{MAX_BIO_LENGTH}
            </span>
          </div>
          <textarea
            value={form?.bio}
            onChange={e => handleChange('bio', e?.target?.value)}
            placeholder="A short description of your professional background and expertise..."
            rows={4}
            className="w-full rounded-lg px-4 py-3.5 text-base font-caption outline-none transition-colors resize-none"
            style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
        </div>

        {/* Portfolio URL */}
        <div>
          <label className="block text-xs font-caption font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
            Portfolio Website URL
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Icon name="Link" size={16} color="var(--color-muted-foreground)" strokeWidth={2} />
            </div>
            <input
              type="url"
              value={form?.portfolioUrl}
              onChange={e => handleChange('portfolioUrl', e?.target?.value)}
              placeholder="https://yourportfolio.com"
              className="w-full rounded-lg pl-10 pr-4 py-3.5 text-base font-caption outline-none transition-colors"
              style={{
                backgroundColor: 'var(--color-background)',
                border: `1px solid ${errors?.portfolioUrl ? '#ef4444' : 'var(--color-border)'}`,
                color: 'var(--color-foreground)',
                minHeight: 48,
              }}
            />
          </div>
          {errors?.portfolioUrl && (
            <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors?.portfolioUrl}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleVisitPortfolio}
          disabled={!form?.portfolioUrl}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-base font-caption font-medium transition-colors flex-1"
          style={{
            border: '1px solid var(--color-border)',
            color: form?.portfolioUrl ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
            backgroundColor: 'transparent',
            opacity: form?.portfolioUrl ? 1 : 0.5,
            cursor: form?.portfolioUrl ? 'pointer' : 'not-allowed',
            minHeight: 48,
          }}
        >
          <Icon name="ExternalLink" size={16} strokeWidth={2} />
          Visit Portfolio
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-base font-caption font-semibold transition-colors flex-1"
          style={{
            backgroundColor: saved ? '#22c55e' : 'var(--color-primary)',
            color: 'white',
            cursor: saving ? 'wait' : 'pointer',
            opacity: saving ? 0.8 : 1,
            minHeight: 48,
          }}
        >
          {saving ? (
            <><Icon name="Loader2" size={16} strokeWidth={2} className="animate-spin" /> Saving...</>
          ) : saved ? (
            <><Icon name="CheckCircle" size={16} strokeWidth={2} /> Saved!</>
          ) : (
            <><Icon name="Save" size={16} strokeWidth={2} /> Save Profile</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartnerResumeCard;
