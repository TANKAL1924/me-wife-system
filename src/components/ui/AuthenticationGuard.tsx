import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const PUBLIC_PATHS = ['/homepage', '/login'];

interface AuthenticationGuardProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  onSessionExpired?: () => void;
}

const AuthenticationGuard = ({ children, isAuthenticated = false, isLoading = false, onSessionExpired }: AuthenticationGuardProps) => {
  const location = useLocation();
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);

  const isPublicPath = PUBLIC_PATHS?.includes(location?.pathname);

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath && !isLoading) {
      setShowExpiredMessage(true);
      const timer = setTimeout(() => setShowExpiredMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isPublicPath, isLoading]);

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: 'var(--color-background)' }}
        role="status"
        aria-label="Verifying your session"
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Icon name="Heart" size={28} color="white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p
            className="font-caption text-sm"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicPath) {
    return (
      <Navigate
        to="/login"
        state={{ from: location?.pathname, sessionExpired: showExpiredMessage }}
        replace
      />
    );
  }

  if (isAuthenticated && isPublicPath && location?.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {children}
      {/* Session expiry toast */}
      {showExpiredMessage && (
        <div
          className="fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-md shadow-warm-lg z-toast animate-slide-up"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-foreground)',
            zIndex: 'var(--z-toast)',
          }}
          role="alert"
          aria-live="polite"
        >
          <Icon name="AlertCircle" size={18} color="var(--color-warning)" />
          <p className="font-caption text-sm">Your session has expired. Please sign in again.</p>
        </div>
      )}
    </>
  );
};

export default AuthenticationGuard;
