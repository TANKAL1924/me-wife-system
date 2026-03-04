import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import {
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getSession,
  onAuthStateChange,
} from '../pages/login/service/authService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  // Sign in — returns true on success, false on failure
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { user, session, error } = await supabaseSignIn(email, password);
    if (error) {
      set({ loading: false, error: error.message ?? 'Invalid email or password.' });
      return false;
    }
    set({ user, session, loading: false, error: null });
    return true;
  },

  // Sign out — clears store state
  signOut: async () => {
    set({ loading: true });
    await supabaseSignOut();
    set({ user: null, session: null, loading: false, error: null });
  },

  // Called once on app mount — restores existing session and listens for changes
  initAuth: async () => {
    set({ loading: true });
    const { session } = await getSession();
    set({ user: session?.user ?? null, session, loading: false });

    // Keep store in sync with Supabase auth state changes (e.g. token refresh, signout from another tab)
    onAuthStateChange((newSession) => {
      set({ user: newSession?.user ?? null, session: newSession });
    });
  },

  clearError: () => set({ error: null }),
}));
