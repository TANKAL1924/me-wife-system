import React from 'react';
import Icon from '../../../components/AppIcon';

const badges = [
  { icon: 'Lock', label: 'SSL Secured', desc: '256-bit encryption' },
  { icon: 'Shield', label: 'Private Space', desc: 'Only for you two' },
  { icon: 'Eye', label: 'No Tracking', desc: 'Your data stays yours' },
];

const SecurityBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
    {badges?.map(({ icon, label, desc }) => (
      <div key={label} className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(45, 80, 22, 0.10)' }}
        >
          <Icon name={icon} size={15} color="var(--color-success)" strokeWidth={2} />
        </div>
        <div>
          <p className="text-xs font-caption font-semibold leading-tight" style={{ color: 'var(--color-foreground)' }}>
            {label}
          </p>
          <p className="text-xs font-caption leading-tight" style={{ color: 'var(--color-muted-foreground)' }}>
            {desc}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default SecurityBadges;