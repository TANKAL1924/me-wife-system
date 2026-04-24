import { supabase } from '../../../utils/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExperienceRecord {
  id: number;
  user_id: number | null;
  company_name: string | null;
  title_company: string | null;
  description: unknown | null; // jsonb
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export type ExperienceInput = Omit<ExperienceRecord, 'id' | 'created_at'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolves the public.users bigint id from a Supabase auth UUID. */
async function getPublicUserId(authId: string): Promise<number | null> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', authId)
    .single();
  return data?.id ?? null;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchExperienceRecords(
  authId: string
): Promise<{ data: ExperienceRecord[]; userId: number | null; error: string | null }> {
  const userId = await getPublicUserId(authId);
  if (!userId) return { data: [], userId: null, error: 'User not found' };

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) return { data: [], userId, error: error.message };
  return { data: data as ExperienceRecord[], userId, error: null };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createExperienceRecord(
  record: ExperienceInput
): Promise<{ data: ExperienceRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('experiences')
    .insert(record)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ExperienceRecord, error: null };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateExperienceRecord(
  id: number,
  record: Partial<ExperienceInput>
): Promise<{ data: ExperienceRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('experiences')
    .update(record)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ExperienceRecord, error: null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteExperienceRecord(
  id: number
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  return { error: error?.message ?? null };
}
