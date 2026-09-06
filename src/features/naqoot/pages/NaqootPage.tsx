import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NaqootForm } from '@/features/naqoot/components/NaqootForm';
import { NaqootLeaderboard } from '@/features/naqoot/components/NaqootLeaderboard';
import { NaqootProgrammerNote } from '@/features/naqoot/components/NaqootProgrammerNote';
import { weddingConfig } from '@/config/wedding.config';

export function NaqootPage() {
  const { copy } = weddingConfig.naqoot;
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="naqoot-page">
      <NaqootProgrammerNote />

      <header className="naqoot-page__header">
        <Link to="/" className="naqoot-page__back">
          ← العودة للرئيسية
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="naqoot-page__eyebrow">محبة مو مبالغ</p>
          <h1 className="naqoot-page__title gold-text">{copy.pageTitle}</h1>
          <p className="naqoot-page__intro">{copy.pageIntro}</p>
          <p className="naqoot-page__note">{copy.pageNote}</p>
        </motion.div>
      </header>

      <NaqootForm onSubmitted={() => setRefreshKey((key) => key + 1)} />
      <NaqootLeaderboard refreshKey={refreshKey} />
    </main>
  );
}
