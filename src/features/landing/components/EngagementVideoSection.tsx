import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';
import {
  isBackgroundAudioPlaying,
  pauseBackgroundAudio,
  resumeBackgroundAudio,
} from '@/lib/audio/backgroundAudio';

export function EngagementVideoSection() {
  const { media, groom } = weddingConfig;
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasMusicPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoPlay = () => {
    wasMusicPlayingRef.current = isBackgroundAudioPlaying();
    if (wasMusicPlayingRef.current) {
      pauseBackgroundAudio();
    }
    setIsPlaying(true);
  };

  const handleVideoStop = () => {
    setIsPlaying(false);

    if (!wasMusicPlayingRef.current) return;

    resumeBackgroundAudio();
    wasMusicPlayingRef.current = false;
  };

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;

    void video.play();
  };

  return (
    <section className="engagement-video-section section-pad" aria-labelledby="video-heading">
      <div className="engagement-video-section__backdrop" aria-hidden>
        <img
          className="engagement-video-section__bg-image"
          src={media.engagementSectionBackground}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="engagement-video-section__overlay" />
        <div className="engagement-video-section__glow" />
      </div>

      <motion.div
        className="engagement-video-section__content"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
      >
        <h2 id="video-heading" className="section__title engagement-video-section__title">
          لحظات الخطوبة
        </h2>
        <p className="section__subtitle engagement-video-section__subtitle">
          فيديو من أيام الخطوبة — إنتاج {groom.nickname}
        </p>

        <div className="engagement-video-section__player">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster={media.engagementVideoPoster}
            src={media.engagementVideo}
            onPlay={handleVideoPlay}
            onPause={handleVideoStop}
            onEnded={handleVideoStop}
          >
            المتصفح لا يدعم تشغيل الفيديو.
          </video>

          {!isPlaying && (
            <motion.button
              type="button"
              className="engagement-video-section__play"
              onClick={handlePlayClick}
              aria-label="تشغيل فيديو الخطوبة"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="engagement-video-section__play-ring" aria-hidden />
              <span
                className="engagement-video-section__play-ring engagement-video-section__play-ring--delay"
                aria-hidden
              />
              <span className="engagement-video-section__play-core" aria-hidden>
                <Play size={28} strokeWidth={2} fill="currentColor" />
              </span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
