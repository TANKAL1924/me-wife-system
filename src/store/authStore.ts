import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import {
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getSession,
  onAuthStateChange,
} from '../pages/login/service/authService';
import { supabase } from '../utils/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  session: Session | null;
  username: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<(() => void) | void>;
  clearError: () => void;
}

// Module-level guard — prevents double-init from React StrictMode
let authInitialized = false;

// Helper — fetch username from public.users by auth UUID
async function fetchUsername(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('username')
    .eq('auth_id', userId)
    .single();
  return data?.username ?? null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  username: null,
  loading: false,
  error: null,

  // Sign in — username will be set by onAuthStateChange SIGNED_IN event
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
    authInitialized = false;
    set({ user: null, session: null, username: null, loading: false, error: null });
  },

  // Called once on app mount — guarded against StrictMode double-invoke
  initAuth: async () => {
    if (authInitialized) return;
    authInitialized = true;

    set({ loading: true });
    const { session } = await getSession();
    const username = session?.user ? await fetchUsername(session.user.id) : null;
    set({ user: session?.user ?? null, session, username, loading: false });

    // Subscribe to auth changes — returns unsubscribe for useEffect cleanup
    const subscription = onAuthStateChange(async (newSession) => {
      const newUsername = newSession?.user ? await fetchUsername(newSession.user.id) : null;
      set({ user: newSession?.user ?? null, session: newSession, username: newUsername });
    });

    return () => subscription.unsubscribe();
  },

  clearError: () => set({ error: null }),
}));
