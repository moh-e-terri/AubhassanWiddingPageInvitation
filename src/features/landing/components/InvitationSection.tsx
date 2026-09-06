import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X, ZoomIn } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

const INVITATION_DOWNLOAD_NAME = 'wedding-invitation-abu-hassan.png';

export function InvitationSection() {
  const { media, groom, bride } = weddingConfig;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);
  const openLightbox = useCallback(() => setIsLightboxOpen(true), []);

  const downloadInvitation = useCallback(async () => {
    try {
      const response = await fetch(media.invitation);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = INVITATION_DOWNLOAD_NAME;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement('a');
      link.href = media.invitation;
      link.download = INVITATION_DOWNLOAD_NAME;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  }, [media.invitation]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    document.body.classList.add('no-scroll');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeLightbox, isLightboxOpen]);

  return (
    <section id="invitation" className="section-pad invitation-section" aria-labelledby="invitation-heading">
      <motion.h2
        id="invitation-heading"
        className="section__title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        دعوتكم للفرح
      </motion.h2>

      <motion.p
        className="section__subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        باسم خالق الحب نبدأ
      </motion.p>

      <motion.div
        className="invitation-section__frame"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          className="invitation-section__trigger"
          onClick={openLightbox}
          aria-label="عرض الدعوة بحجم أوضح"
        >
          <img
            src={media.invitation}
            alt={`دعوة زفاف ${groom.fullName} و${bride.fullName}`}
            className="invitation-section__image"
            loading="lazy"
          />
          <span className="invitation-section__hint" aria-hidden>
            <ZoomIn size={18} strokeWidth={1.75} />
            اضغط للعرض أوضح
          </span>
        </button>
      </motion.div>

      <motion.div
        className="invitation-section__actions"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <button type="button" className="btn-gold invitation-section__download" onClick={downloadInvitation}>
          <Download size={18} strokeWidth={1.75} aria-hidden />
          تحميل الدعوة
        </button>
      </motion.div>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            key="invitation-lightbox"
            className="invitation-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="عرض الدعوة"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <button
              type="button"
              className="invitation-lightbox__backdrop"
              onClick={closeLightbox}
              aria-label="إغلاق"
            />

            <motion.div
              className="invitation-lightbox__panel"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className="invitation-lightbox__close"
                onClick={closeLightbox}
                aria-label="إغلاق"
              >
                <X size={22} strokeWidth={1.75} />
              </button>

              <img
                src={media.invitation}
                alt={`دعوة زفاف ${groom.fullName} و${bride.fullName}`}
                className="invitation-lightbox__image"
              />

              <div className="invitation-lightbox__actions">
                <button type="button" className="btn-gold invitation-lightbox__download" onClick={downloadInvitation}>
                  <Download size={18} strokeWidth={1.75} aria-hidden />
                  تحميل الدعوة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
