import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useWeddingExperience } from '@/features/landing/context/WeddingExperienceContext';

export function ScrollToTopButton() {
  const { showSplash } = useWeddingExperience();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (showSplash) return null;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="الطلوع للأعلى"
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          <ArrowUp size={20} strokeWidth={2.25} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
