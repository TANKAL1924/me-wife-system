import { supabase } from '../../../utils/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkillRecord {
  id: number;
  user_id: number | null;
  skills: string | null;
  type: string | null;
  created_at: string;
}

export type SkillInput = Omit<SkillRecord, 'id' | 'created_at'>;

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

export async function fetchSkillRecords(
  authId: string
): Promise<{ data: SkillRecord[]; userId: number | null; error: string | null }> {
  const userId = await getPublicUserId(authId);
  if (!userId) return { data: [], userId: null, error: 'User not found' };

  const { data, error } = await supabase
    .from('technical')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return { data: [], userId, error: error.message };
  return { data: data as SkillRecord[], userId, error: null };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSkillRecord(
  record: SkillInput
): Promise<{ data: SkillRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('technical')
    .insert(record)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as SkillRecord, error: null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSkillRecord(
  id: number
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('technical').delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}
