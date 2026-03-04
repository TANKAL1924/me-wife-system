import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';
import CalendarPage from './pages/calendar';
import DashboardPage from './pages/dashboard';
import GalleryPage from './pages/gallery';
import HomepagePage from './pages/homepage';
import LoginPage from './pages/login';
import PortfolioResumeSettingsPage from './pages/portfolio-resume-settings';
import ProfilePage from './pages/profile-page';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomepagePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/portfolio-resume-settings" element={<PortfolioResumeSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
