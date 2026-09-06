import { motion } from 'framer-motion';
import InteractiveMap from '@/features/landing/components/InteractiveMap';

export function MapSection() {
  return (
    <section id="map" className="section-pad map-section" aria-labelledby="map-heading">
      <motion.h2
        id="map-heading"
        className="section__title"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        خريطة الوصول
      </motion.h2>
      <motion.p
        className="section__subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        الطريق إلى قاعة الفرح
      </motion.p>
      <InteractiveMap />
    </section>
  );
}
