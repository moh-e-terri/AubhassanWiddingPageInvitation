import { getSupabaseClient, requireSupabaseClient } from '@/lib/supabase/client';
import type { NaqootEntryInput, NaqootLeaderboardEntry } from '@/types/naqoot.types';

export async function submitNaqootEntry(input: NaqootEntryInput) {
  const supabase = requireSupabaseClient();

  const { error } = await supabase.from('naqoot_entries').insert({
    donor_name: input.donorName,
    amount: input.amount,
    message: input.message ?? null,
  });

  if (error) throw error;
}

export async function getNaqootLeaderboard(): Promise<NaqootLeaderboardEntry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('naqoot_leaderboard')
    .select('donor_name, total_amount, entries_count')
    .order('total_amount', { ascending: false })
    .limit(20);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    donorName: row.donor_name,
    totalAmount: row.total_amount,
    entriesCount: row.entries_count,
  }));
}
