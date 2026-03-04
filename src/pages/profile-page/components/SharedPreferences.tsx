import Icon from '../../../components/AppIcon';

interface ImportantDate {
  icon: string;
  label: string;
  date: string;
  daysAway: number | string;
}

interface Preferences {
  interests: string[];
  importantDates: ImportantDate[];
}

interface SharedPreferencesProps {
  preferences: Preferences;
  isEditing: boolean;
  onTagToggle: (category: string, tag: string) => void;
}

const TAG_COLORS = [
  'rgba(212,118,26,0.12)',
  'rgba(139,69,19,0.10)',
  'rgba(255,107,53,0.10)',
];

const SharedPreferences = ({ preferences, isEditing, onTagToggle }: SharedPreferencesProps) => {
  const allInterests = [
    'Hiking', 'Cooking', 'Travel', 'Movies', 'Music', 'Reading',
    'Photography', 'Yoga', 'Cycling', 'Art', 'Gaming', 'Dancing',
    'Wine Tasting', 'Gardening', 'Fitness', 'Beach', 'Camping', 'Theater'
  ];

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(212,118,26,0.12)' }}>
          <Icon name="Sparkles" size={18} color="var(--color-primary)" />
        </div>
        <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Shared Preferences
        </h2>
      </div>
      <div className="mb-5">
        <h3 className="text-xs font-caption font-semibold mb-3 uppercase tracking-wide"
          style={{ color: 'var(--color-muted-foreground)' }}>Shared Interests</h3>
        <div className="flex flex-wrap gap-2">
          {(isEditing ? allInterests : preferences?.interests)?.map((interest, i) => {
            const isSelected = preferences?.interests?.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => isEditing && onTagToggle('interests', interest)}
                className="px-3 py-1.5 rounded-full text-sm font-caption transition-base"
                style={{
                  backgroundColor: isSelected ? TAG_COLORS?.[i % TAG_COLORS?.length] : 'var(--color-muted)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'transparent'}`,
                  cursor: isEditing ? 'pointer' : 'default',
                }}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-caption font-semibold mb-3 uppercase tracking-wide"
          style={{ color: 'var(--color-muted-foreground)' }}>Important Dates</h3>
        <div className="space-y-2">
          {preferences?.importantDates?.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--color-muted)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(212,118,26,0.12)' }}>
                  <Icon name={d?.icon} size={15} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{d?.label}</p>
                  <p className="text-xs font-data" style={{ color: 'var(--color-muted-foreground)' }}>{d?.date}</p>
                </div>
              </div>
              <span className="text-xs font-caption px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(212,118,26,0.10)', color: 'var(--color-primary)' }}>
                {d?.daysAway}d away
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedPreferences;