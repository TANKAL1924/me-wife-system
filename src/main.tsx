import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import AppRoutes from './routes/routes'
import { useAuthStore } from './store/authStore'

// Initialize auth once, outside React — immune to StrictMode double-invoke
useAuthStore.getState().initAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
