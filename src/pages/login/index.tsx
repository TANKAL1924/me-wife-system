import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import BrandPanel from './components/BrandPanel';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Left Brand Panel - desktop only */}
      <div className="hidden lg:block lg:w-1/2 xl:w-5/12 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <BrandPanel />
        </div>
      </div>
      {/* Right Auth Panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-4 md:px-6 py-4 border-b"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
        >
          <Link to="/homepage" className="flex items-center gap-2 focus-ring rounded-md">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Icon name="Heart" size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Together
            </span>
          </Link>
          <Link
            to="/homepage"
            className="flex items-center gap-1.5 text-sm font-caption transition-base focus-ring rounded-md px-2 py-1 hover-lift"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <Icon name="ArrowLeft" size={15} />
            <span>Back</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-10 md:py-14">
          <div className="w-full max-w-md">

            {/* Desktop back link */}
            <Link
              to="/homepage"
              className="hidden lg:inline-flex items-center gap-1.5 text-sm font-caption mb-8 transition-base focus-ring rounded-md hover-lift"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <Icon name="ArrowLeft" size={15} />
              <span>Back to homepage</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-caption font-medium mb-4"
                style={{
                  backgroundColor: 'rgba(212, 118, 26, 0.10)',
                  color: 'var(--color-primary)',
                }}
              >
                <Icon name="Lock" size={12} color="var(--color-primary)" />
                <span>Private &amp; Secure Access</span>
              </div>
              <h1
                className="font-heading text-3xl md:text-4xl font-semibold mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Welcome back
              </h1>
              <p className="font-body text-base" style={{ color: 'var(--color-muted-foreground)' }}>
                Sign in to your shared space and pick up right where you left off.
              </p>
            </div>

            {/* Form Card */}
            <div
              className="card mb-6"
              style={{ padding: '28px 32px' }}
            >
              <LoginForm />
            </div>

            {/* Security badges */}
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              <SecurityBadges />
            </div>

            {/* Footer note */}
            <p className="text-center text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              This is a private platform for registered couples only.
              <br />
              <span>
                Need help?{' '}
                <button
                  type="button"
                  className="font-medium transition-base focus-ring rounded hover-lift"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Contact support
                </button>
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 md:px-8 py-4 border-t text-center"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
            &copy; {new Date()?.getFullYear()} Together. All rights reserved. Your privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;