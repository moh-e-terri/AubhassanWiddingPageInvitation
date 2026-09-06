import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/wedding.config';
import { useNaqootLeaderboard } from '@/features/naqoot/hooks/useNaqootLeaderboard';
import { formatCandles } from '@/features/naqoot/utils/formatCandles';

type NaqootLeaderboardProps = {
  refreshKey?: number;
};

export function NaqootLeaderboard({ refreshKey = 0 }: NaqootLeaderboardProps) {
  const { copy } = weddingConfig.naqoot;
  const { entries, topDonor, loading, error, refetch } = useNaqootLeaderboard();

  useEffect(() => {
    if (refreshKey > 0) {
      void refetch();
    }
  }, [refreshKey, refetch]);

  return (
    <section className="naqoot-leaderboard" aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading">{copy.leaderboardTitle}</h2>

      {loading && <p className="section__status">جاري التحميل…</p>}
      {error && <p className="section__status section__status--error">{error}</p>}

      {topDonor && (
        <motion.div
          className="naqoot-leaderboard__champion"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <span className="naqoot-leaderboard__badge">{copy.championBadge}</span>
          <strong>{topDonor.donorName}</strong>
          <span>{formatCandles(topDonor.totalAmount)}</span>
        </motion.div>
      )}

      <ol className="naqoot-leaderboard__list">
        {entries.map((entry, index) => (
          <li key={entry.donorName}>
            <span className="naqoot-leaderboard__rank">{index + 1}</span>
            <span className="naqoot-leaderboard__name">{entry.donorName}</span>
            <span className="naqoot-leaderboard__amount">{formatCandles(entry.totalAmount)}</span>
          </li>
        ))}
      </ol>

      {entries.length === 0 && !loading && (
        <p className="section__status">{copy.leaderboardEmpty}</p>
      )}
    </section>
  );
}
