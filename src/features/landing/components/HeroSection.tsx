import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

export function HeroSection() {
  const { groom, bride, copy, event } = weddingConfig;

  return (
    <section id="hero" className="hero" aria-label="التهنئة">
      <img
        className="hero__photo"
        src={weddingConfig.media.heroBackground}
        alt=""
        aria-hidden
      />
      <div className="hero__overlay" aria-hidden />

      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="hero__intro">
          <p className="hero__eyebrow">{copy.heroEyebrow}</p>
        </header>

        <div className="hero__names">
          <h1 className="hero__name gold-text">
            {groom.fullName}
            <span className="hero__nickname">({groom.nickname})</span>
          </h1>

          <div className="hero__divider" aria-hidden>
            <span />
            <Heart size={16} color="#c9a24d" strokeWidth={1.75} />
            <span />
          </div>

          <h2 className="hero__name gold-text">{bride.fullName}</h2>
        </div>

        <blockquote className="hero__quote">"{copy.heroQuote}"</blockquote>

        <p className="hero__date">
          {event.day} · {event.dateShort} · {event.time}
        </p>

        <motion.a
          href="#invitation"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-gold hero__cta"
        >
          {copy.heroCta}
        </motion.a>
      </motion.div>

      <motion.a
        href="#invitation"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="hero__scroll-hint"
        aria-label="الانتقال لبطاقة الدعوة"
      >
        <ChevronDown size={28} color="#c9a24d" opacity={0.55} />
      </motion.a>
    </section>
  );
}
