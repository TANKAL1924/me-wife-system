import { supabase } from '../../../utils/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LanguageRecord {
  id: number;
  user_id: number | null;
  language: string | null;
  proficient: string | null;
  created_at: string;
}

export type LanguageInput = Omit<LanguageRecord, 'id' | 'created_at'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getPublicUserId(authId: string): Promise<number | null> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single();
  return data?.id ?? null;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchLanguageRecords(
  authId: string
): Promise<{ data: LanguageRecord[]; userId: number | null; error: string | null }> {
  const userId = await getPublicUserId(authId);
  if (!userId) return { data: [], userId: null, error: 'User not found' };

  const { data, error } = await supabase
    .from('language')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return { data: [], userId, error: error.message };
  return { data: data as LanguageRecord[], userId, error: null };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createLanguageRecord(
  record: LanguageInput
): Promise<{ data: LanguageRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('language')
    .insert(record)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as LanguageRecord, error: null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteLanguageRecord(
  id: number
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('language').delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}
