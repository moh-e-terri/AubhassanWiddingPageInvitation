import { motion } from 'framer-motion';
import { weddingConfig } from '@/config/wedding.config';

export function FormalTextSection() {
  const { groom, bride, copy } = weddingConfig;

  return (
    <section className="section-pad formal-text" aria-label="نص الدعوة">
      <motion.div
        className="formal-text__card glass"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="formal-text__accent" aria-hidden />
        <p className="formal-text__bismillah">{copy.splashBismillah}</p>
        <p className="formal-text__intro">{copy.formalIntro}</p>

        <div className="formal-text__names-block">
          <p className="formal-text__name gold-text">{groom.fullName}</p>
          <p className="formal-text__ampersand gold-text" aria-hidden>
            &
          </p>
          <p className="formal-text__name gold-text">{bride.fullName}</p>
        </div>

        <p className="formal-text__outro">{copy.formalOutro}</p>
      </motion.div>
    </section>
  );
}
