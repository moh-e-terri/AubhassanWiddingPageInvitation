import { useEffect, useState } from 'react';
import { getPublicGalleryImages } from '@/lib/supabase/gallery.service';
import type { GalleryImage } from '@/types/gallery.types';

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getPublicGalleryImages();
        if (!cancelled) setImages(data);
      } catch {
        if (!cancelled) setError('تعذّر تحميل الصور حالياً.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { images, loading, error };
}
