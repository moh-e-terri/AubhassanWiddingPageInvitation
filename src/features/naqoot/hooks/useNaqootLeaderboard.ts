import { useCallback, useEffect, useState } from 'react';
import { getNaqootLeaderboard } from '@/lib/supabase/naqoot.service';
import type { NaqootLeaderboardEntry } from '@/types/naqoot.types';

export function useNaqootLeaderboard() {
  const [entries, setEntries] = useState<NaqootLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNaqootLeaderboard();
      setEntries(data);
    } catch {
      setError('تعذّر تحميل لوحة النقوط.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const topDonor = entries[0] ?? null;

  return { entries, topDonor, loading, error, refetch };
}
