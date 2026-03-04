import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

interface Milestone {
  label: string;
  date: string;
}

interface Relationship {
  anniversary?: string;
  firstDate?: string;
  engagementDate?: string;
  location?: string;
  story?: string;
  yearsTogther?: number | string;
  milestones?: Milestone[];
}

interface RelationshipInfoProps {
  relationship: Relationship;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
}

const MILESTONE_ICONS: Record<string, string> = {
  'First Date': 'Coffee',
  'Got Engaged': 'Diamond',
  'Wedding Day': 'Heart',
  'First Home': 'Home',
  'Honeymoon': 'Plane',
};

const RelationshipInfo = ({ relationship, isEditing, onChange }: RelationshipInfoProps) => {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e?.target?.value);

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(212,118,26,0.12)' }}>
          <Icon name="HeartHandshake" size={18} color="var(--color-primary)" />
        </div>
        <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Relationship Info
        </h2>
      </div>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Anniversary Date" type="date" value={relationship?.anniversary} onChange={handleChange('anniversary')} />
          <Input label="First Date" type="date" value={relationship?.firstDate} onChange={handleChange('firstDate')} />
          <Input label="Engagement Date" type="date" value={relationship?.engagementDate} onChange={handleChange('engagementDate')} />
          <Input label="City / Location" type="text" value={relationship?.location} onChange={handleChange('location')} placeholder="Where you met" />
          <div className="md:col-span-2">
            <Input label="Our Story" type="text" value={relationship?.story} onChange={handleChange('story')} placeholder="A short description of your love story" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Years Together', value: relationship?.yearsTogther, icon: 'Clock' },
              { label: 'Anniversary', value: relationship?.anniversary, icon: 'CalendarHeart' },
              { label: 'Home City', value: relationship?.location, icon: 'MapPin' },
            ]?.map(({ label, value, icon }) => (
              <div key={label} className="text-center p-4 rounded-xl"
                style={{ backgroundColor: 'var(--color-muted)' }}>
                <Icon name={icon} size={20} color="var(--color-primary)" className="mx-auto mb-2" />
                <p className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>{value}</p>
                <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>{label}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-caption text-sm font-semibold mb-3" style={{ color: 'var(--color-muted-foreground)' }}>
              MILESTONES
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--color-border)' }} />
              <div className="space-y-3 pl-10">
                {relationship?.milestones?.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-primary)', top: '2px' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name={MILESTONE_ICONS?.[m?.label] || 'Star'} size={14} color="var(--color-primary)" />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{m?.label}</span>
                      </div>
                      <span className="text-xs font-data" style={{ color: 'var(--color-muted-foreground)' }}>{m?.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relationship?.story && (
            <div className="mt-5 p-4 rounded-xl italic text-sm"
              style={{ backgroundColor: 'rgba(212,118,26,0.06)', color: 'var(--color-muted-foreground)', borderLeft: '3px solid var(--color-primary)' }}>
              &ldquo;{relationship?.story}&rdquo;
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelationshipInfo;