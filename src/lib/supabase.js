import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anonKey);

export const supabase = hasSupabase ? createClient(url, anonKey) : null;

export async function fetchStoredHistory(coinId, hours = 48) {
  if (!supabase) return [];
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('price_snapshots')
    .select('price, captured_at')
    .eq('coin_id', coinId)
    .gte('captured_at', since)
    .order('captured_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({ ts: new Date(row.captured_at).getTime(), price: row.price }));
}
