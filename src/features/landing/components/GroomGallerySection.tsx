import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

const AUTO_PLAY_MS = 4800;

export function GroomGallerySection() {
  const { media, groom } = weddingConfig;
  const photos = media.groomGallery.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (!photos.length) return;
      const nextIndex = ((index % photos.length) + photos.length) % photos.length;
      setActiveIndex(nextIndex);
      setProgressKey((key) => key + 1);
    },
    [photos.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused || photos.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % photos.length);
      setProgressKey((key) => key + 1);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, photos.length]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;

    if (!delta || Math.abs(delta) < 42) return;

    if (delta > 0) goNext();
    else goPrev();
  };

  if (!photos.length) return null;

  return (
    <section className="section-pad groom-gallery" aria-labelledby="groom-gallery-heading">
      <motion.header
        className="groom-gallery__header"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 id="groom-gallery-heading" className="section__title">
          عريسنا الغالي
        </h2>
        <p className="section__subtitle">
          {groom.fullName} — {groom.nickname}
        </p>
      </motion.header>

      <motion.div
        className="groom-slider"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.85, delay: 0.08 }}
      >
        <div
          className="groom-slider__frame"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="groom-slider__glow" aria-hidden />

          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={photos[activeIndex]}
              className="groom-slider__slide"
              initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={photos[activeIndex]}
                alt={`صورة ${groom.nickname} ${activeIndex + 1}`}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                animate={{ scale: isPaused ? 1.03 : 1.08 }}
                transition={{ duration: AUTO_PLAY_MS / 1000, ease: 'linear' }}
              />
              <div className="groom-slider__shade" aria-hidden />
            </motion.figure>
          </AnimatePresence>

          <div className="groom-slider__counter" aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="groom-slider__counter-sep">/</span>
            <span>{String(photos.length).padStart(2, '0')}</span>
          </div>

          <div
            key={progressKey}
            className={`groom-slider__progress${isPaused ? ' groom-slider__progress--paused' : ''}`}
            style={{ ['--groom-slider-duration' as string]: `${AUTO_PLAY_MS}ms` }}
            aria-hidden
          />

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="groom-slider__nav groom-slider__nav--prev"
                onClick={goPrev}
                aria-label="الصورة السابقة"
              >
                <ChevronRight size={22} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="groom-slider__nav groom-slider__nav--next"
                onClick={goNext}
                aria-label="الصورة التالية"
              >
                <ChevronLeft size={22} strokeWidth={1.75} />
              </button>
            </>
          )}
        </div>

        {photos.length > 1 && (
          <div className="groom-slider__dots" role="tablist" aria-label="معرض صور العريس">
            {photos.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`عرض الصورة ${index + 1}`}
                className={`groom-slider__dot${index === activeIndex ? ' groom-slider__dot--active' : ''}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}

        {photos.length > 1 && (
          <div className="groom-slider__thumbs" aria-hidden>
            {photos.map((src, index) => (
              <button
                key={`thumb-${src}`}
                type="button"
                tabIndex={-1}
                className={`groom-slider__thumb${index === activeIndex ? ' groom-slider__thumb--active' : ''}`}
                onClick={() => goTo(index)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
