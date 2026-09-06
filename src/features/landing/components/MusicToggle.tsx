import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useWeddingExperience } from '@/features/landing/context/WeddingExperienceContext';

export function MusicToggle() {
  const { showSplash, isPlaying, toggleMusicFromGesture } = useWeddingExperience();

  if (showSplash) return null;

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    toggleMusicFromGesture();
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      onPointerDown={handlePointerDown}
      onClick={(event) => event.preventDefault()}
      className={`music-toggle glass ${isPlaying ? 'playing' : ''}`}
      aria-label={isPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}
    >
      {isPlaying ? <Volume2 color="#c9a24d" size={20} /> : <VolumeX color="#a3a3ab" size={20} />}
    </motion.button>
  );
}
