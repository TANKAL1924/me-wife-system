import type { ReactNode } from 'react';
import AuthenticationGuard from './AuthenticationGuard';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthStore();

  return (
    <AuthenticationGuard isAuthenticated={!!user} isLoading={loading}>
      {children}
    </AuthenticationGuard>
  );
};

export default ProtectedRoute;
