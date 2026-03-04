import { supabase } from '../../../utils/supabase';
import type { Session, User, AuthError } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
  };
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ─── Get Current Session ──────────────────────────────────────────────────────

export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

// ─── Reset Password (sends email) ─────────────────────────────────────────────

export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

// ─── Listen to Auth State Changes ─────────────────────────────────────────────

export function onAuthStateChange(
  callback: (session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}
