import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';
import { useWeddingExperience } from '@/features/landing/context/WeddingExperienceContext';
import { playBackgroundAudioFromGesture } from '@/lib/audio/backgroundAudio';

export function SplashScreen() {
  const { showSplash, isPlaying, openInvitationFromGesture, toggleMusicFromGesture } =
    useWeddingExperience();
  const { copy } = weddingConfig;

  function handleOpenPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    playBackgroundAudioFromGesture();
    openInvitationFromGesture();
  }

  function handleSoundPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleMusicFromGesture();
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          className="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="splash-overlay__bg" aria-hidden>
            <div className="splash-overlay__base" />
            <div className="splash-overlay__aurora splash-overlay__aurora--1" />
            <div className="splash-overlay__aurora splash-overlay__aurora--2" />
            <div className="splash-overlay__sheen" />
            <div className="splash-overlay__vignette" />
            <div className="splash-overlay__grain" />
          </div>

          <motion.div
            className="splash-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="splash-card">
              <div className="splash-card__text">
                <p className="splash-card__bismillah">{copy.splashBismillah}</p>
                <p className="splash-card__subtitle">{copy.splashSubtitle}</p>
                <p className="splash-card__names gold-text">{copy.splashGroomName}</p>
                <p className="splash-card__nickname">({copy.splashGroomNickname})</p>
              </div>

              <div className="splash-card__actions">
                <button
                  type="button"
                  onPointerDown={handleOpenPointerDown}
                  onClick={(event) => event.preventDefault()}
                  className="btn-open"
                >
                  فتح الدعوة
                </button>

                <button
                  type="button"
                  onPointerDown={handleSoundPointerDown}
                  onClick={(event) => event.preventDefault()}
                  className="btn-sound glass"
                  aria-label={isPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}
                >
                  {isPlaying ? <Volume2 size={20} color="#c9a24d" /> : <VolumeX size={20} color="#a3a3ab" />}
                  <span>{isPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
