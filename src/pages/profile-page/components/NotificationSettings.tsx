import Icon from '../../../components/AppIcon';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
  label: string;
  description?: string;
}

interface NotificationState {
  anniversary: boolean;
  calendarEvents: boolean;
  galleryUploads: boolean;
  birthdays: boolean;
  emailDigest: boolean;
}

interface NotificationSettingsProps {
  notifications: NotificationState;
  onChange: (key: keyof NotificationState, value: boolean) => void;
}

const ToggleSwitch = ({ checked, onChange, id, label, description }: ToggleSwitchProps) => (
  <div className="flex items-start justify-between gap-4 py-3"
    style={{ borderBottom: '1px solid var(--color-border)' }}>
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="text-sm font-medium cursor-pointer block"
        style={{ color: 'var(--color-foreground)' }}>{label}</label>
      {description && (
        <p className="text-xs font-caption mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{description}</p>
      )}
    </div>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-11 h-6 rounded-full transition-base focus-ring"
      style={{ backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-muted)' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-warm-sm transition-base"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  </div>
);

const NotificationSettings = ({ notifications, onChange }: NotificationSettingsProps) => {
  const handleToggle = (key: keyof NotificationState) => (val: boolean) => onChange(key, val);

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(212,118,26,0.12)' }}>
          <Icon name="Bell" size={18} color="var(--color-primary)" />
        </div>
        <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Notifications
        </h2>
      </div>
      <div>
        <ToggleSwitch id="notif-anniversary" checked={notifications?.anniversary} onChange={handleToggle('anniversary')}
          label="Anniversary Reminders" description="Get notified 7 days before your anniversary" />
        <ToggleSwitch id="notif-events" checked={notifications?.calendarEvents} onChange={handleToggle('calendarEvents')}
          label="Calendar Events" description="Reminders for upcoming shared events" />
        <ToggleSwitch id="notif-gallery" checked={notifications?.galleryUploads} onChange={handleToggle('galleryUploads')}
          label="Gallery Uploads" description="When your partner adds new photos" />
        <ToggleSwitch id="notif-birthday" checked={notifications?.birthdays} onChange={handleToggle('birthdays')}
          label="Birthday Reminders" description="Reminders for birthdays and special dates" />
        <ToggleSwitch id="notif-email" checked={notifications?.emailDigest} onChange={handleToggle('emailDigest')}
          label="Weekly Email Digest" description="A weekly summary of your shared activities" />
      </div>
    </div>
  );
};

export default NotificationSettings;