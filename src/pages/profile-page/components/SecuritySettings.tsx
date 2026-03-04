import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface Security {
  twoFAEnabled?: boolean;
  device?: string;
  lastActive?: string;
}

interface Passwords {
  current: string;
  newPass: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  newPass?: string;
  confirm?: string;
}

interface PasswordStrength {
  level: number;
  label: string;
  color: string;
}

interface SecuritySettingsProps {
  security: Security;
  onPasswordChange?: (passwords: Passwords) => void;
}

const SecuritySettings = ({ security }: SecuritySettingsProps) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState<Passwords>({ current: '', newPass: '', confirm: '' });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [success, setSuccess] = useState(false);
  const [twoFA, setTwoFA] = useState(security?.twoFAEnabled ?? false);

  const getPasswordStrength = (pass: string): PasswordStrength => {
    if (!pass) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pass?.length >= 8) score++;
    if (/[A-Z]/?.test(pass)) score++;
    if (/[0-9]/?.test(pass)) score++;
    if (/[^A-Za-z0-9]/?.test(pass)) score++;
    const levels = [
      { level: 1, label: 'Weak', color: 'var(--color-error)' },
      { level: 2, label: 'Fair', color: 'var(--color-warning)' },
      { level: 3, label: 'Good', color: 'var(--color-primary)' },
      { level: 4, label: 'Strong', color: 'var(--color-success)' },
    ];
    return levels?.[score - 1] || { level: 0, label: '', color: '' };
  };

  const strength = getPasswordStrength(passwords?.newPass);

  const handleSubmit = () => {
    const errs: PasswordErrors = {};
    if (!passwords?.current) errs.current = 'Current password is required';
    if (passwords?.newPass?.length < 8) errs.newPass = 'Password must be at least 8 characters';
    if (passwords?.newPass !== passwords?.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs)?.length) { setErrors(errs); return; }
    setErrors({});
    setSuccess(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setShowPasswordForm(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(212,118,26,0.12)' }}>
          <Icon name="Shield" size={18} color="var(--color-primary)" />
        </div>
        <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
          Security Settings
        </h2>
      </div>
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
          style={{ backgroundColor: 'rgba(45,80,22,0.1)', color: 'var(--color-success)' }}>
          <Icon name="CheckCircle" size={16} color="var(--color-success)" />
          Password updated successfully!
        </div>
      )}
      {/* Current session info */}
      <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-muted)' }}>
        <div className="flex items-center gap-3">
          <Icon name="Monitor" size={18} color="var(--color-muted-foreground)" />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Current Session</p>
            <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              {security?.device} · Last active {security?.lastActive}
            </p>
          </div>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-caption"
            style={{ backgroundColor: 'rgba(45,80,22,0.12)', color: 'var(--color-success)' }}>
            Active
          </span>
        </div>
      </div>
      {/* 2FA */}
      <div className="flex items-start justify-between gap-4 py-3 mb-4"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Two-Factor Authentication</p>
          <p className="text-xs font-caption mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
            Add an extra layer of security to your account
          </p>
        </div>
        <button
          role="switch"
          aria-checked={twoFA}
          onClick={() => setTwoFA(!twoFA)}
          className="relative flex-shrink-0 w-11 h-6 rounded-full transition-base focus-ring"
          style={{ backgroundColor: twoFA ? 'var(--color-primary)' : 'var(--color-muted)' }}
        >
          <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-warm-sm transition-base"
            style={{ transform: twoFA ? 'translateX(20px)' : 'translateX(0)' }} />
        </button>
      </div>
      {/* Password Change */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Password</p>
          <Button variant="ghost" size="sm" iconName={showPasswordForm ? 'ChevronUp' : 'ChevronDown'} iconPosition="right"
            onClick={() => setShowPasswordForm(!showPasswordForm)}>
            {showPasswordForm ? 'Hide' : 'Change Password'}
          </Button>
        </div>

        {showPasswordForm && (
          <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-muted)' }}>
            <Input label="Current Password" type="password" value={passwords?.current}
              onChange={(e) => setPasswords(p => ({ ...p, current: e?.target?.value }))}
              error={errors?.current} placeholder="Enter current password" />
            <Input label="New Password" type="password" value={passwords?.newPass}
              onChange={(e) => setPasswords(p => ({ ...p, newPass: e?.target?.value }))}
              error={errors?.newPass} placeholder="Enter new password" />
            {passwords?.newPass && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4]?.map(i => (
                    <div key={i} className="h-1.5 flex-1 rounded-full transition-base"
                      style={{ backgroundColor: i <= strength?.level ? strength?.color : 'var(--color-border)' }} />
                  ))}
                </div>
                <span className="text-xs font-caption" style={{ color: strength?.color }}>{strength?.label}</span>
              </div>
            )}
            <Input label="Confirm New Password" type="password" value={passwords?.confirm}
              onChange={(e) => setPasswords(p => ({ ...p, confirm: e?.target?.value }))}
              error={errors?.confirm} placeholder="Confirm new password" />
            <div className="flex gap-2 pt-1">
              <Button variant="default" size="sm" onClick={handleSubmit}>Update Password</Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowPasswordForm(false); setErrors({}); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;