import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

export function NaqootProgrammerNote() {
  const { copy } = weddingConfig.naqoot;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="naqoot-programmer-fab"
        onClick={() => setIsOpen(true)}
        aria-label={copy.programmerButton}
      >
        <MessageCircle size={22} strokeWidth={1.75} />
        <span>{copy.programmerButton}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="naqoot-programmer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={copy.programmerTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="naqoot-programmer-panel__backdrop"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
            />

            <motion.div
              className="naqoot-programmer-panel__card"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className="naqoot-programmer-panel__close"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق"
              >
                <X size={18} strokeWidth={1.75} />
              </button>

              <p className="naqoot-programmer-panel__eyebrow">{copy.programmerTitle}</p>
              <h2 className="naqoot-programmer-panel__name">{copy.programmerName}</h2>
              <div className="naqoot-programmer-panel__message">
                {copy.programmerMessage.split('\n').map((line, index) =>
                  line.trim() ? (
                    <p key={`${index}-${line}`}>{line}</p>
                  ) : (
                    <br key={`br-${index}`} />
                  ),
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
