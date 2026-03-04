import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import NotFound from '../pages/NotFound';
import CalendarPage from '../pages/calendar';
import DashboardPage from '../pages/dashboard';
import GalleryPage from '../pages/gallery';
import HomepagePage from '../pages/homepage';
import LoginPage from '../pages/login';
import PortfolioResumeSettingsPage from '../pages/portfolio-resume-settings';
import ProfilePage from '../pages/profile-page';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from '../components/ui/ProtectedRoute';

const AppRoutes = () => {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomepagePage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
        <Route path="/profile-page" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/portfolio-resume-settings" element={<ProtectedRoute><PortfolioResumeSettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
