import { supabase } from '../../../utils/supabase';
import type { CalendarEvent } from '../components/UpcomingEvents';

// ─── DB Row ───────────────────────────────────────────────────────────────────

interface CalendarRow {
  id: number;
  event: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const toCalendarEvent = (row: CalendarRow): CalendarEvent => ({
  id: String(row.id),
  title: row.event ?? '',
  startDate: row.start_date ?? new Date().toISOString(),
  endDate: row.end_date ?? undefined,
  location: row.location ?? undefined,
});

// ─── Fetch All ────────────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<{ data: CalendarEvent[]; error: string | null }> {
  const { data, error } = await supabase
    .from('calendar')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: (data as CalendarRow[]).map(toCalendarEvent), error: null };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createEvent(
  ev: Omit<CalendarEvent, 'id'>
): Promise<{ data: CalendarEvent | null; error: string | null }> {
  const { data, error } = await supabase
    .from('calendar')
    .insert({
      event: ev.title,
      location: ev.location ?? null,
      start_date: ev.startDate,
      end_date: ev.endDate ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: toCalendarEvent(data as CalendarRow), error: null };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateEvent(
  ev: CalendarEvent
): Promise<{ data: CalendarEvent | null; error: string | null }> {
  const { data, error } = await supabase
    .from('calendar')
    .update({
      event: ev.title,
      location: ev.location ?? null,
      start_date: ev.startDate,
      end_date: ev.endDate ?? null,
    })
    .eq('id', Number(ev.id))
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: toCalendarEvent(data as CalendarRow), error: null };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('calendar')
    .delete()
    .eq('id', Number(id));

  return { error: error ? error.message : null };
}
