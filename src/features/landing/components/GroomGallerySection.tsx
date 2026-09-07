import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

const AUTO_PLAY_MS = 4800;
const MANUAL_PAUSE_MS = 2800;

function centerStoryItemInTrack(track: HTMLElement, item: HTMLElement) {
  const trackRect = track.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const delta = itemRect.left - trackRect.left - (trackRect.width - itemRect.width) / 2;
  track.scrollBy({ left: delta, behavior: 'smooth' });
}

export function GroomGallerySection() {
  const { media, groom } = weddingConfig;
  const photos = media.groomGallery.filter(Boolean);
  const photoCount = photos.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isInView, setIsInView] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const storyTrackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const storyItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualPauseTimer = useRef<number | null>(null);

  const clearManualPause = useCallback(() => {
    if (manualPauseTimer.current) {
      window.clearTimeout(manualPauseTimer.current);
      manualPauseTimer.current = null;
    }
  }, []);

  const pauseBriefly = useCallback(() => {
    clearManualPause();
    setIsPaused(true);
    manualPauseTimer.current = window.setTimeout(() => {
      setIsPaused(false);
      manualPauseTimer.current = null;
    }, MANUAL_PAUSE_MS);
  }, [clearManualPause]);

  const moveTo = useCallback(
    (nextIndex: number, direction: number) => {
      if (!photoCount) return;

      const normalized = ((nextIndex % photoCount) + photoCount) % photoCount;

      setSlideDirection(direction);
      setActiveIndex((current) => {
        const wrappedForward = current === photoCount - 1 && normalized === 0;
        const wrappedBackward = current === 0 && normalized === photoCount - 1;

        if (wrappedForward || wrappedBackward) {
          setCycleKey((key) => key + 1);
        }

        return normalized;
      });
      setProgressKey((key) => key + 1);
    },
    [photoCount],
  );

  const goNext = useCallback(() => {
    setSlideDirection(1);
    setActiveIndex((current) => {
      const next = (current + 1) % photoCount;
      if (current === photoCount - 1 && next === 0) {
        setCycleKey((key) => key + 1);
      }
      return next;
    });
    setProgressKey((key) => key + 1);
  }, [photoCount]);

  const goPrev = useCallback(() => {
    setSlideDirection(-1);
    setActiveIndex((current) => {
      const next = (current - 1 + photoCount) % photoCount;
      if (current === 0 && next === photoCount - 1) {
        setCycleKey((key) => key + 1);
      }
      return next;
    });
    setProgressKey((key) => key + 1);
  }, [photoCount]);

  // إيقاف التشغيل التلقائي عندما يكون القسم خارج الشاشة
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // جدولة الصورة التالية — فقط والقسم ظاهر
  useEffect(() => {
    if (photoCount <= 1 || isPaused || !isInView) return;

    const timer = window.setTimeout(goNext, AUTO_PLAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, isInView, photoCount, goNext]);

  // تمرير أفقي داخل الشريط فقط — بدون scrollIntoView حتى لا تقفز الصفحة
  useEffect(() => {
    if (!isInView) return;

    const track = storyTrackRef.current;
    const item = storyItemRefs.current[activeIndex];
    if (!track || !item) return;

    centerStoryItemInTrack(track, item);
  }, [activeIndex, isInView]);

  useEffect(() => () => clearManualPause(), [clearManualPause]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;

    if (!delta || Math.abs(delta) < 42) return;

    pauseBriefly();
    if (delta > 0) goNext();
    else goPrev();
  };

  const handleFrameMouseEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsPaused(true);
    }
  };

  const handleFrameMouseLeave = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsPaused(false);
    }
  };

  if (!photoCount) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction >= 0 ? 48 : -48,
      scale: 1.02,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction >= 0 ? -48 : 48,
      scale: 0.99,
    }),
  };

  return (
    <section ref={sectionRef} className="section-pad groom-gallery" aria-labelledby="groom-gallery-heading">
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
          onMouseEnter={handleFrameMouseEnter}
          onMouseLeave={handleFrameMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="groom-slider__glow" aria-hidden />

          {photoCount > 1 && (
            <>
              <div className="groom-slider__counter" aria-live="polite">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="groom-slider__counter-sep">/</span>
                <span>{String(photoCount).padStart(2, '0')}</span>
              </div>

              <div
                key={progressKey}
                className={`groom-slider__progress${isPaused ? ' groom-slider__progress--paused' : ''}`}
                style={{ ['--groom-slider-duration' as string]: `${AUTO_PLAY_MS}ms` }}
                aria-hidden
              />
            </>
          )}

          {photoCount > 1 && (
            <div key={cycleKey} className="groom-slider__segments" aria-hidden>
              {photos.map((src, index) => (
                <div key={`segment-${src}`} className="groom-slider__segment">
                  <div
                    key={index === activeIndex ? `active-${progressKey}` : `segment-${index}`}
                    className={[
                      'groom-slider__segment-fill',
                      index < activeIndex && activeIndex > 0 ? 'groom-slider__segment-fill--done' : '',
                      index === activeIndex ? 'groom-slider__segment-fill--active' : '',
                      index === activeIndex && isPaused ? 'groom-slider__segment-fill--paused' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={
                      index === activeIndex
                        ? ({ ['--groom-slider-duration' as string]: `${AUTO_PLAY_MS}ms` } as CSSProperties)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
            <motion.figure
              key={`${cycleKey}-${activeIndex}`}
              custom={slideDirection}
              variants={slideVariants}
              className="groom-slider__slide"
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={photos[activeIndex]}
                alt={`صورة ${groom.nickname} ${activeIndex + 1}`}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                animate={{ scale: isPaused ? 1.02 : 1.05 }}
                transition={{ duration: AUTO_PLAY_MS / 1000, ease: 'linear' }}
              />
              <div className="groom-slider__shade" aria-hidden />
            </motion.figure>
          </AnimatePresence>

          {photoCount > 1 && (
            <>
              <button
                type="button"
                className="groom-slider__nav groom-slider__nav--prev"
                onClick={() => {
                  pauseBriefly();
                  goPrev();
                }}
                aria-label="الصورة السابقة"
              >
                <ChevronRight size={22} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="groom-slider__nav groom-slider__nav--next"
                onClick={() => {
                  pauseBriefly();
                  goNext();
                }}
                aria-label="الصورة التالية"
              >
                <ChevronLeft size={22} strokeWidth={1.75} />
              </button>
            </>
          )}
        </div>

        {photoCount > 1 && (
          <div className="groom-stories">
            <div className="groom-stories__fade groom-stories__fade--start" aria-hidden />
            <div className="groom-stories__fade groom-stories__fade--end" aria-hidden />

            <div
              ref={storyTrackRef}
              className="groom-stories__track"
              role="tablist"
              aria-label="اختر صورة من ألبوم العريس"
            >
              {photos.map((src, index) => {
                const isActive = index === activeIndex;
                const isSeen = activeIndex > 0 && index < activeIndex;

                return (
                  <button
                    key={src}
                    ref={(node) => {
                      storyItemRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`عرض الصورة ${index + 1} من ${photoCount}`}
                    className={[
                      'groom-stories__item',
                      isActive ? 'groom-stories__item--active' : '',
                      isSeen ? 'groom-stories__item--seen' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      pauseBriefly();
                      moveTo(index, index >= activeIndex ? 1 : -1);
                    }}
                  >
                    <span className="groom-stories__ring">
                      <span className="groom-stories__ring-inner">
                        <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {photoCount > 1 && (
          <div className="groom-slider__dots" role="tablist" aria-label="معرض صور العريس">
            {photos.map((src, index) => (
              <button
                key={`dot-${src}`}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`عرض الصورة ${index + 1}`}
                className={`groom-slider__dot${index === activeIndex ? ' groom-slider__dot--active' : ''}`}
                onClick={() => {
                  pauseBriefly();
                  moveTo(index, index >= activeIndex ? 1 : -1);
                }}
              />
            ))}
          </div>
        )}

        {photoCount > 1 && (
          <div className="groom-slider__thumbs" aria-label="صور مصغّرة">
            {photos.map((src, index) => (
              <button
                key={`thumb-${src}`}
                type="button"
                className={`groom-slider__thumb${index === activeIndex ? ' groom-slider__thumb--active' : ''}`}
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => {
                  pauseBriefly();
                  moveTo(index, index >= activeIndex ? 1 : -1);
                }}
              >
                <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
