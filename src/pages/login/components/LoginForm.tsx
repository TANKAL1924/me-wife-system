import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, loading, error: authError, clearError } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (authError) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const success = await signIn(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {authError && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl text-sm font-caption"
          style={{
            backgroundColor: 'rgba(160, 82, 45, 0.08)',
            border: '1px solid rgba(160, 82, 45, 0.25)',
            color: 'var(--color-error)',
          }}
          role="alert"
        >
          <Icon name="AlertCircle" size={18} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <span>{authError}</span>
        </div>
      )}
      <div>
        <Input
          label="Email Address"
          type="email"
          id="email"
          name="email"
          placeholder="couple@together.com"
          value={formData?.email}
          onChange={handleChange}
          error={errors?.email}
          required
          disabled={loading}
        />
      </div>
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleChange}
          error={errors?.password}
          required
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(p => !p)}
          className="absolute right-3 top-9 p-1 rounded focus-ring transition-base"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <div
            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-base flex-shrink-0"
            style={{
              borderColor: rememberMe ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: rememberMe ? 'var(--color-primary)' : 'transparent',
            }}
            onClick={() => setRememberMe(p => !p)}
          >
            {rememberMe && <Icon name="Check" size={12} color="white" strokeWidth={3} />}
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={rememberMe}
            onChange={e => setRememberMe(e?.target?.checked)}
            aria-label="Remember me"
          />
          <span className="text-sm font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
            Remember me
          </span>
        </label>
        <button
          type="button"
          className="text-sm font-caption font-medium transition-base focus-ring rounded hover-lift"
          style={{ color: 'var(--color-primary)' }}
        >
          Forgot password?
        </button>
      </div>
      <Button
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
        iconName={loading ? undefined : 'LogIn'}
        iconPosition="right"
        type="submit"
        className="mt-1"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;