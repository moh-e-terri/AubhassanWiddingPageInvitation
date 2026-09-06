import { motion } from 'framer-motion';
import { useGallery } from '@/features/landing/hooks/useGallery';

export function GallerySection() {
  const { images, loading, error } = useGallery();

  return (
    <section className="section gallery" aria-labelledby="gallery-heading">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 id="gallery-heading" className="section__title">
          ذكريات جميلة
        </h2>

        {loading && <p className="section__status">جاري تحميل الصور…</p>}
        {error && <p className="section__status section__status--error">{error}</p>}

        {!loading && images.length === 0 && (
          <p className="section__status">الصور ستُضاف قريباً من لوحة العريس.</p>
        )}

        <div className="gallery__grid">
          {images.map((image, index) => (
            <motion.figure
              key={image.id}
              className="gallery__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <img src={image.url} alt={image.caption ?? 'صورة من ألبوم الزفاف'} loading="lazy" />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
