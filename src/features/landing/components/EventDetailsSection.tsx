import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { weddingConfig } from '@/config/wedding.config';

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
};

export function EventDetailsSection() {
  const { event } = weddingConfig;

  return (
    <section className="section event-details" aria-labelledby="event-heading">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 id="event-heading" className="section__title">
          تفاصيل الموعد والمكان
        </h2>

        <div className="event-details__cards">
          <motion.article
            className="event-details__card"
            aria-label="التاريخ"
            {...cardMotion}
            transition={{ duration: 0.65 }}
          >
            <span className="event-details__icon" aria-hidden>
              <Calendar size={22} strokeWidth={1.75} />
            </span>
            <p className="event-details__value">
              {event.day} — {event.dateShort}
            </p>
          </motion.article>

          <motion.article
            className="event-details__card"
            aria-label="الوقت"
            {...cardMotion}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <span className="event-details__icon" aria-hidden>
              <Clock size={22} strokeWidth={1.75} />
            </span>
            <p className="event-details__value">{event.time}</p>
          </motion.article>

          <motion.article
            className="event-details__card event-details__card--wide"
            aria-label="المكان"
            {...cardMotion}
            transition={{ duration: 0.65, delay: 0.16 }}
          >
            <span className="event-details__icon" aria-hidden>
              <MapPin size={22} strokeWidth={1.75} />
            </span>
            <div className="event-details__venue">
              <p className="event-details__value">{event.venue}</p>
              <p className="event-details__sub">{event.venueDetail}</p>
              <p className="event-details__note">{event.venueDirectionNote}</p>
            </div>
          </motion.article>
        </div>
      </motion.div>
    </section>
  );
}
