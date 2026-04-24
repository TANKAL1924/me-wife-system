import { supabase } from '../../../utils/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudyRecord {
  id: number;
  user_id: number | null;
  uni_name: string | null;
  course: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  cgpa: number | null;
  location: string | null;
  achievement: unknown | null;
}

export type StudyInput = Omit<StudyRecord, 'id' | 'created_at'>;

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

export async function fetchStudyRecords(
  authId: string
): Promise<{ data: StudyRecord[]; userId: number | null; error: string | null }> {
  const userId = await getPublicUserId(authId);
  if (!userId) return { data: [], userId: null, error: 'User not found' };

  const { data, error } = await supabase
    .from('study')
    .select('*')
    .eq('user_id', userId);

  if (error) return { data: [], userId, error: error.message };
  return { data: data as StudyRecord[], userId, error: null };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createStudyRecord(
  record: StudyInput
): Promise<{ data: StudyRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('study')
    .insert(record)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as StudyRecord, error: null };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateStudyRecord(
  id: number,
  record: Partial<StudyInput>
): Promise<{ data: StudyRecord | null; error: string | null }> {
  const { data, error } = await supabase
    .from('study')
    .update(record)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as StudyRecord, error: null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteStudyRecord(
  id: number
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('study').delete().eq('id', id);
  return { error: error?.message ?? null };
}
