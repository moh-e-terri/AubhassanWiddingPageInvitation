import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { NaqootForm } from '@/features/naqoot/components/NaqootForm';
import { NaqootProgrammerNote } from '@/features/naqoot/components/NaqootProgrammerNote';
import { weddingConfig } from '@/config/wedding.config';

export function NaqootPage() {
  const { copy } = weddingConfig.naqoot;
  const [compactBack, setCompactBack] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    function onScroll() {
      setCompactBack(window.scrollY > 72);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="naqoot-page">
      <NaqootProgrammerNote />

      <Link
        to="/"
        className={`naqoot-page__back${compactBack ? ' naqoot-page__back--compact' : ''}`}
        aria-label="العودة للرئيسية"
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden />
        <span className="naqoot-page__back-text">العودة للرئيسية</span>
      </Link>

      <header className="naqoot-page__header">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <h1 className="naqoot-page__title gold-text">{copy.pageTitle}</h1>
          <p className="naqoot-page__note">{copy.pageNote}</p>
        </motion.div>
      </header>

      <NaqootForm />
    </main>
  );
}
