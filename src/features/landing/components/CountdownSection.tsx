import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { weddingConfig } from '@/config/wedding.config';

type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

type TimeLeft = Record<CountdownUnit, number>;

const UNITS: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds'];

const labels: Record<CountdownUnit, string> = {
  days: 'يوم',
  hours: 'ساعة',
  minutes: 'دقيقة',
  seconds: 'ثانية',
};

function calculateTimeLeft(targetDate: number): TimeLeft | null {
  const diff = targetDate - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownCard({
  unit,
  value,
  index,
}: {
  unit: CountdownUnit;
  value: number;
  index: number;
}) {
  const paddedValue = String(value).padStart(2, '0');

  return (
    <motion.div
      className={`countdown-unit countdown-unit--${unit}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <div className="countdown-unit__glow" aria-hidden />
      <div className="countdown-unit__body">
        <div className="countdown-unit__value-wrap" aria-live={unit === 'seconds' ? 'polite' : 'off'}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={paddedValue}
              className="countdown-unit__value gold-text"
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {paddedValue}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="countdown-unit__label">{labels[unit]}</span>
      </div>
    </motion.div>
  );
}

export function CountdownSection() {
  const { event } = weddingConfig;
  const targetDate = useMemo(() => new Date(event.countdownISO).getTime(), [event.countdownISO]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="section-pad countdown-section" aria-labelledby="countdown-heading">
      <div className="countdown-section__glow" aria-hidden />

      <motion.header
        className="countdown-section__header"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <h2 id="countdown-heading" className="countdown-section__title gold-text">
          العد التنازلي لليلة العمر
        </h2>
        <p className="countdown-section__meta">
          {event.day} · {event.dateShort} · {event.time}
        </p>
      </motion.header>

      {timeLeft ? (
        <div className="countdown-grid" dir="ltr">
          {UNITS.map((unit, index) => (
            <CountdownCard key={unit} unit={unit} value={timeLeft[unit]} index={index} />
          ))}
        </div>
      ) : (
        <motion.p
          className="countdown-section__complete gold-text"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          حان وقت الفرح — أهلاً بكم
        </motion.p>
      )}
    </section>
  );
}
